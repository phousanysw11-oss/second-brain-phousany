import copy
from decimal import Decimal
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from score import assess, band, BadInput, DEFAULTS, markdown, monthly_frequency

ROOT = Path(__file__).resolve().parents[1]


class ScorerTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads((ROOT / "assets/example.json").read_text(encoding="utf-8"))

    def row(self, **changes):
        data = copy.deepcopy(self.data)
        data["tasks"] = [dict(data["tasks"][0], **changes)]
        return assess(data)["rows"][0]

    def test_approved_examples(self):
        result = assess(self.data)
        self.assertEqual([r["total"] for r in result["rows"]], [10, 7, 4])
        self.assertEqual([r["rank"] for r in result["rows"]], [1, 2, 3])
        self.assertEqual(list(result["rows"][0]["scores"].values()), [2, 3, 3, 2])

    def test_every_numeric_boundary(self):
        for key, (low, high) in DEFAULTS.items():
            for value, expected in [(0, 0), (Decimal("0.01"), 1), (low, 1),
                                    (Decimal(low) + Decimal("0.01"), 2), (high, 2),
                                    (Decimal(high) + Decimal("0.01"), 3)]:
                with self.subTest(factor=key, value=value):
                    self.assertEqual(band(value, [low, high]), expected)

    def test_impact_categories(self):
        for i in range(4):
            self.assertEqual(self.row(impact=i)["scores"]["impact"], i)

    def test_zero_is_complete(self):
        row = self.row(direct_cost_lak=0, human_minutes=0, impact=0,
                       impact_reason="ตรวจแล้วไม่พบผล", frequency={"unit": "monthly", "count": 1})
        self.assertEqual((row["total"], row["rank"]), (1, 1))

    def test_missing_never_zero(self):
        for key in ("direct_cost_lak", "human_minutes", "impact", "impact_reason", "cost_includes", "frequency", "name"):
            for value in (None, ""):
                with self.subTest(key=key, value=value):
                    row = self.row(**{key: value})
                    self.assertEqual(row["status"], "incomplete")
                    self.assertIsNone(row["total"])
                    self.assertIsNone(row["rank"])

    def test_missing_context_blocks_rank(self):
        for field in ("business", "period", "currency"):
            data = copy.deepcopy(self.data)
            data[field] = None
            result = assess(data)
            self.assertEqual(result["exit_code"], 1)
            self.assertTrue(all(r["rank"] is None and r["total"] is None for r in result["rows"]))

    def test_blank_file_incomplete(self):
        result = assess(json.loads((ROOT / "assets/blank.json").read_text()))
        self.assertEqual(result["exit_code"], 1)

    def test_invalid_numeric_inputs(self):
        for key in ("direct_cost_lak", "human_minutes", "impact", "fix_minutes"):
            for value in (-1, float("nan"), float("inf"), -float("inf"), True, "15", [], {}):
                with self.subTest(key=key, value=value):
                    row = self.row(**{key: value})
                    self.assertEqual(row["status"], "invalid")
                    self.assertIsNone(row["total"])
                    self.assertIsNone(row["rank"])

    def test_invalid_impact(self):
        for value in (4, 1.5, "critical"):
            self.assertEqual(self.row(impact=value)["status"], "invalid")

    def test_fractional_frequency(self):
        for count, expected in [(0.083333, 1), (4.1, 2), (20.1, 3)]:
            self.assertEqual(self.row(frequency={"unit": "monthly", "count": count})["scores"]["repetition"], expected)

    def test_annual_average(self):
        row = self.row(frequency={"unit": "yearly", "count": 1})
        self.assertEqual(row["monthly_occurrences"], Decimal(1) / 12)
        self.assertEqual(row["scores"]["repetition"], 1)
        self.assertEqual(monthly_frequency({"unit": "yearly", "count": 48}), 4)
        self.assertEqual(monthly_frequency({"unit": "yearly", "count": 240}), 20)

    def test_daily_actual_days_once(self):
        row = self.row(frequency={"unit": "daily", "count": 2, "working_days_per_month": 22})
        self.assertEqual(row["monthly_occurrences"], 44)
        self.assertEqual(row["scores"]["money"], 2)
        self.assertEqual(self.row(frequency={"unit": "daily", "count": 2})["status"], "incomplete")
        self.assertEqual(self.row(frequency={"unit": "daily", "count": 2, "working_days_per_month": 0})["status"], "inactive")

    def test_bad_frequency(self):
        for freq in ({"unit":"weekly","count":1}, {"unit":"monthly","count":-1},
                     {"unit":"monthly","count":1,"working_days_per_month":22},
                     {"unit":"yearly","count":1,"working_days_per_month":22},
                     {"unit":"daily","count":1,"working_days_per_month":32},
                     {"unit":"daily","count":1,"working_days_per_month":1.5},
                     {"unit":"monthly","count":float("inf")}, {"unit":[],"count":1}):
            self.assertEqual(self.row(frequency=freq)["status"], "invalid")

    def test_inactive_cannot_outrank_active(self):
        self.data["tasks"][0].update(direct_cost_lak=900000, frequency={"unit":"monthly","count":0})
        result = assess(self.data)
        self.assertEqual(result["rows"][0]["name"], "กรอกข้อมูลซ้ำ")
        inactive = result["rows"][-1]
        self.assertEqual(inactive["total"], 9)
        self.assertIsNone(inactive["rank"])
        self.assertEqual(inactive["status"], "inactive")
        self.assertIn("ไม่เกิดในช่วงประเมิน", markdown(result))

    def test_inactive_and_missing_visible(self):
        row = self.row(direct_cost_lak=None, frequency={"unit":"monthly","count":0})
        self.assertTrue(row["inactive"])
        self.assertIsNone(row["total"])

    def test_impact_breaks_equal_total(self):
        low = copy.deepcopy(self.data["tasks"][0])
        high = copy.deepcopy(low)
        low.update(name="lower impact", impact=2)
        high.update(name="higher impact", human_minutes=60)
        self.data["tasks"] = [low, high]
        result = assess(self.data)["rows"]
        self.assertEqual([r["total"] for r in result], [9, 9])
        self.assertEqual([r["name"] for r in result], ["higher impact", "lower impact"])

    def tied(self):
        self.data["tasks"] = [copy.deepcopy(self.data["tasks"][0]) for _ in range(3)]
        for i, row in enumerate(self.data["tasks"]):
            row["name"] = f"task {i}"
        return self.data["tasks"]

    def test_shared_rank(self):
        self.tied()[2]["impact"] = 2
        self.assertEqual([r["rank"] for r in assess(self.data)["rows"]], [1, 1, 3])

    def test_ease_evidence_breaks_tie(self):
        for row, effort in zip(self.tied(), [60, 20, 20]):
            row.update(fix_minutes=effort, ease_basis="same scope", ease_evidence="timed trial")
        result = assess(self.data)["rows"]
        self.assertEqual([r["name"] for r in result], ["task 1", "task 2", "task 0"])
        self.assertEqual([r["rank"] for r in result], [1, 1, 3])

    def test_partial_or_incompatible_ease_keeps_tie(self):
        rows = self.tied()
        rows[0].update(fix_minutes=1, ease_basis="same", ease_evidence="trial")
        self.assertEqual([r["rank"] for r in assess(self.data)["rows"]], [1, 1, 1])
        for i, row in enumerate(rows):
            row.update(fix_minutes=i + 1, ease_basis=str(i), ease_evidence="trial")
        self.assertEqual([r["rank"] for r in assess(self.data)["rows"]], [1, 1, 1])

    def test_mixed_scope_currency_rejected(self):
        for key, value in [("business", "other"), ("period", "other"), ("currency", "THB")]:
            self.assertEqual(self.row(**{key:value})["status"], "invalid")
        self.data["currency"] = "USD"
        with self.assertRaises(BadInput):
            assess(self.data)

    def test_threshold_configuration(self):
        self.data.update(thresholds={"money":[200000, 500000], "time":[90, 120], "repetition":[8, 20]},
                         threshold_reason="consciously changed for test")
        result = assess(self.data)
        self.assertEqual(result["rows"][0]["total"], 6)
        self.assertEqual(result["threshold_reason"], "consciously changed for test")
        del self.data["threshold_reason"]
        with self.assertRaises(BadInput):
            assess(self.data)

    def test_invalid_thresholds(self):
        for pair in ([0, 10], [10, 10], [20, 10], [None, 10], [-1, 10], [float("inf"), 10]):
            self.data.update(thresholds=dict(DEFAULTS, money=pair), threshold_reason="test")
            with self.assertRaises(BadInput):
                assess(self.data)

    def test_unknown_fields_rejected(self):
        self.assertEqual(self.row(thresholds=DEFAULTS)["status"], "invalid")
        self.assertEqual(self.row(direct_cost=5)["status"], "invalid")

    def test_cli_and_no_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp) / "result.md"
            command = [sys.executable, str(ROOT / "scripts/score.py"), str(ROOT / "assets/example.json"), "--output", str(output)]
            first = subprocess.run(command, capture_output=True)
            self.assertEqual(first.returncode, 0, first.stderr)
            original = output.read_bytes()
            self.assertIn("แก้คำสั่งซื้อผิด", original.decode("utf-8"))
            self.assertEqual(subprocess.run(command, capture_output=True).returncode, 2)
            self.assertEqual(output.read_bytes(), original)
            blank = subprocess.run([sys.executable, str(ROOT / "scripts/score.py"), str(ROOT / "assets/blank.json")], capture_output=True)
            self.assertEqual(blank.returncode, 1)
            bad = Path(tmp) / "bad.json"
            bad.write_text('{"tasks":[],"tasks":[]}', encoding="utf-8")
            self.assertEqual(subprocess.run([sys.executable, str(ROOT / "scripts/score.py"), str(bad)], capture_output=True).returncode, 2)

    def test_markdown_preserves_reasons_escapes_cells(self):
        self.data["tasks"][0]["name"] = "task | one\nnext"
        output = markdown(assess(self.data))
        self.assertIn("task \\| one next", output)
        self.assertIn("ลูกค้าได้รับสินค้าช้า", output)


if __name__ == "__main__":
    unittest.main()
