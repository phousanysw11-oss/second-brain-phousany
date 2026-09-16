"""Deterministic four-factor task prioritization; Python standard library only."""
import argparse
from decimal import Decimal, InvalidOperation
import json
from pathlib import Path
import sys

DEFAULTS = {"money": [100000, 500000], "time": [15, 60], "repetition": [4, 20]}
TOP_FIELDS = {"business", "period", "currency", "tasks", "thresholds", "threshold_reason"}
TASK_FIELDS = {"name", "direct_cost_lak", "cost_includes", "human_minutes", "impact",
               "impact_reason", "frequency", "evidence", "business", "period", "currency",
               "fix_minutes", "ease_evidence", "ease_basis"}
LABELS = {"active": "พร้อมจัดลำดับตรวจ", "inactive": "ไม่เกิดในช่วงประเมิน",
          "incomplete": "ข้อมูลไม่ครบ", "invalid": "ข้อมูลผิด"}


class BadInput(ValueError):
    pass


def missing(value):
    return value is None or (isinstance(value, str) and value.strip() in ("", "?"))


def number(value, field):
    if missing(value):
        return None
    if isinstance(value, bool) or not isinstance(value, (int, float, Decimal)):
        raise BadInput(f"{field}: ต้องเป็นตัวเลข ไม่ใช่ข้อความหรือ true/false")
    try:
        result = Decimal(str(value))
    except InvalidOperation as exc:
        raise BadInput(f"{field}: ตัวเลขไม่ถูกต้อง") from exc
    if not result.is_finite() or result < 0:
        raise BadInput(f"{field}: ต้องไม่ติดลบและไม่เป็น NaN/Infinity")
    return result


def text_value(value, field):
    if missing(value):
        return None
    if not isinstance(value, str):
        raise BadInput(f"{field}: ต้องเป็นข้อความ")
    return value.strip()


def band(value, cutoffs):
    if value is None:
        return None
    return 0 if value == 0 else 1 if value <= cutoffs[0] else 2 if value <= cutoffs[1] else 3


def monthly_frequency(freq):
    if missing(freq):
        return None
    if not isinstance(freq, dict):
        raise BadInput("frequency: ต้องเป็น object")
    unit = freq.get("unit")
    if not missing(unit) and unit not in ("monthly", "yearly", "daily"):
        raise BadInput("frequency.unit: ใช้ monthly, yearly หรือ daily")
    allowed = {"unit", "count"} | ({"working_days_per_month"} if unit == "daily" else set())
    if set(freq) - allowed:
        raise BadInput("frequency: ช่องเกินหรือมีการคูณวันทำงานซ้ำ")
    count = number(freq.get("count"), "frequency.count")
    days = None
    if unit == "daily":
        days = number(freq.get("working_days_per_month"), "working_days_per_month")
        if days is not None and (days > 31 or days != days.to_integral_value()):
            raise BadInput("working_days_per_month: วันทำงานจริงต้องเป็นจำนวนเต็ม 0–31")
    if missing(unit) or count is None or (unit == "daily" and days is None):
        return None
    return count / 12 if unit == "yearly" else count * days if unit == "daily" else count


def assess(data):
    if not isinstance(data, dict) or set(data) - TOP_FIELDS:
        raise BadInput("ข้อมูลระดับบนไม่ถูกต้องหรือมีชื่อช่องที่ไม่รองรับ")
    context = {k: text_value(data.get(k), k) for k in ("business", "period", "currency")}
    context_missing = [k for k, v in context.items() if v is None]
    if context["currency"] not in (None, "LAK"):
        raise BadInput("currency: เกณฑ์นี้ใช้ LAK เท่านั้น ห้ามรวมสกุลเงินอื่น")
    thresholds = DEFAULTS
    reason = "เกณฑ์เริ่มต้นที่อนุมัติ เป็น heuristic ยังไม่ปรับเทียบกับผลจริง"
    if "thresholds" in data:
        raw = data["thresholds"]
        reason = text_value(data.get("threshold_reason"), "threshold_reason")
        if not isinstance(raw, dict) or set(raw) != set(DEFAULTS) or not reason:
            raise BadInput("thresholds: ต้องระบุ money/time/repetition และ threshold_reason")
        thresholds = {}
        for key, pair in raw.items():
            if not isinstance(pair, list) or len(pair) != 2:
                raise BadInput(f"thresholds.{key}: ต้องเป็นคู่ตัวเลข")
            low, high = [number(v, f"thresholds.{key}") for v in pair]
            if low is None or high is None or not 0 < low < high:
                raise BadInput(f"thresholds.{key}: ต้องเป็น 0 < ค่าต่ำ < ค่าสูง")
            thresholds[key] = [low, high]
    elif "threshold_reason" in data:
        raise BadInput("threshold_reason: ระบุได้พร้อม thresholds เท่านั้น")
    tasks = data.get("tasks")
    if not isinstance(tasks, list) or not tasks:
        raise BadInput("tasks: ต้องมีรายการงานอย่างน้อยหนึ่งงาน")
    rows = []
    for index, task in enumerate(tasks, 1):
        row = {"input_row": index, "name": None, "rank": None, "total": None,
               "scores": {}, "status": "invalid", "missing": [], "warnings": [], "errors": []}
        rows.append(row)
        try:
            if not isinstance(task, dict) or set(task) - TASK_FIELDS:
                raise BadInput("รายการงานไม่ถูกต้องหรือมีชื่อช่องที่ไม่รองรับ")
            row["input"] = task
            row["name"] = text_value(task.get("name"), "name")
            for field in ("business", "period", "currency"):
                if field in task and task[field] != context[field]:
                    raise BadInput(f"{field}: ไม่ตรงขอบเขตหลัก แยกประเมินก่อน")
            texts = {k: text_value(task.get(k), k) for k in
                     ("name", "cost_includes", "impact_reason", "evidence", "ease_evidence", "ease_basis")}
            cost = number(task.get("direct_cost_lak"), "direct_cost_lak")
            minutes = number(task.get("human_minutes"), "human_minutes")
            impact = number(task.get("impact"), "impact")
            if impact is not None and (impact > 3 or impact != impact.to_integral_value()):
                raise BadInput("impact: ต้องเป็นจำนวนเต็ม 0, 1, 2 หรือ 3")
            freq = monthly_frequency(task.get("frequency"))
            fix = number(task.get("fix_minutes"), "fix_minutes")
            needed = {"direct_cost_lak": cost, "human_minutes": minutes, "impact": impact,
                      "frequency": freq, **{k: texts[k] for k in ("name", "cost_includes", "impact_reason")}}
            row["missing"] = context_missing + [k for k, v in needed.items() if v is None]
            if not texts["evidence"]:
                row["warnings"].append("ขาดแหล่งข้อมูล/ฐานประมาณ ยังไม่ยืนยันค่าที่กรอก")
            row["monthly_occurrences"] = freq
            row["inactive"] = freq == 0
            row["scores"] = {"money": band(cost, thresholds["money"]),
                             "time": band(minutes, thresholds["time"]),
                             "impact": int(impact) if impact is not None and texts["impact_reason"] else None,
                             "repetition": band(freq, thresholds["repetition"])}
            row["ease"] = {"fix_minutes": fix, "evidence": texts["ease_evidence"], "basis": texts["ease_basis"]}
            row["status"] = "incomplete" if row["missing"] else "inactive" if freq == 0 else "active"
            if not row["missing"]:
                row["total"] = sum(row["scores"].values())
        except BadInput as exc:
            row["errors"].append(str(exc))

    active = sorted((r for r in rows if r["status"] == "active"),
                    key=lambda r: (-r["total"], -r["scores"]["impact"]))
    ranked = []
    while active:
        first = active[0]
        group = [r for r in active if (r["total"], r["scores"]["impact"]) ==
                 (first["total"], first["scores"]["impact"])]
        active = active[len(group):]
        complete_ease = len(group) > 1 and all(
            r["ease"]["fix_minutes"] is not None and r["ease"]["evidence"] and r["ease"]["basis"]
            for r in group) and len({r["ease"]["basis"] for r in group}) == 1
        if complete_ease:
            group.sort(key=lambda r: r["ease"]["fix_minutes"])
        start = len(ranked) + 1
        for i, row in enumerate(group):
            row["rank"] = (start + i if i == 0 or (complete_ease and
                           row["ease"]["fix_minutes"] != group[i - 1]["ease"]["fix_minutes"])
                           else group[i - 1]["rank"])
            row["tie_break"] = "หลักฐานเวลาแก้ในขอบเขตเดียวกัน" if complete_ease else "อันดับร่วมเมื่อรวมและผลกระทบเสมอ"
        ranked.extend(group)
    result = {**context, "model": "four-factor-additive-v1", "thresholds": thresholds,
              "threshold_reason": reason, "notice": "คะแนนเลือกตรวจงานต่อ ไม่ใช่ผลประหยัดที่พิสูจน์แล้ว",
              "rows": ranked + [r for r in rows if r["status"] != "active"]}
    result["exit_code"] = 2 if any(r["errors"] for r in rows) else 1 if any(r["missing"] for r in rows) else 0
    return result


def cell(value):
    if value is None:
        return "?"
    return str(value).replace("|", "\\|").replace("\r", " ").replace("\n", " ")


def markdown(result):
    lines = [f"ธุรกิจ: {cell(result['business'])} · ช่วง: {cell(result['period'])} · สกุลเงิน: {cell(result['currency'])}",
             "", result["notice"], "", f"เกณฑ์: {result['threshold_reason']}",
             " · ".join(f"{k}: {', '.join(map(str, v))}" for k, v in result["thresholds"].items()), "",
             "| อันดับ | งาน | เงิน | เวลา | ผลกระทบ | ความถี่ | รวม/12 | ครั้ง/เดือน | สถานะ / ตรวจต่อ |",
             "|---|---|---:|---:|---:|---:|---:|---:|---|"]
    for row in result["rows"]:
        status = LABELS[row["status"]]
        if row.get("inactive") and row["status"] != "inactive":
            status += "; ไม่เกิดในช่วงประเมิน"
        details = row["errors"] + (["ขาด: " + ", ".join(row["missing"])] if row["missing"] else []) + row["warnings"]
        values = [row["rank"], row["name"]] + [row["scores"].get(k) for k in ("money", "time", "impact", "repetition")]
        values += [row["total"], row.get("monthly_occurrences"), status + ("; " + "; ".join(details) if details else "")]
        lines.append("| " + " | ".join(map(cell, values)) + " |")
    lines += ["", "ก่อนทดลอง: ลดส่วนไหนได้จริง · ตรวจวิธีทำ/เครื่องมือแล้วหรือยัง · ติดระบบหรือคนอนุมัติอะไร",
              "", "หลักฐานและเหตุผลจากข้อมูลที่กรอก:"]
    for row in result["rows"]:
        raw = row.get("input", {})
        lines.append(f"- {cell(row['name'])}: ค่าใช้จ่ายรวม {cell(raw.get('cost_includes'))}; ผลกระทบ: {cell(raw.get('impact_reason'))}; แหล่ง: {cell(raw.get('evidence'))}")
        if row.get("ease", {}).get("fix_minutes") is not None:
            lines.append(f"  เวลาแก้ประมาณ {cell(row['ease']['fix_minutes'])} นาทีคน; ฐาน: {cell(row['ease']['basis'])}; หลักฐาน: {cell(row['ease']['evidence'])}; ใช้ตัดสิน: {cell(row.get('tie_break'))}")
    return "\n".join(lines) + "\n"


def json_default(value):
    if isinstance(value, Decimal):
        # Preserve exact decimal values (including extreme finite input) as strings in output.
        return str(value)
    raise TypeError(type(value).__name__)


def no_duplicates(pairs):
    data = {}
    for key, value in pairs:
        if key in data:
            raise BadInput(f"JSON มีชื่อช่องซ้ำ: {key}")
        data[key] = value
    return data


def main():
    parser = argparse.ArgumentParser(description="ให้คะแนนงาน 4 ปัจจัย 0–12")
    parser.add_argument("input", type=Path)
    parser.add_argument("--format", choices=("json", "markdown"), default="markdown")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        data = json.loads(args.input.read_text(encoding="utf-8-sig"), parse_float=Decimal,
                          parse_int=Decimal, object_pairs_hook=no_duplicates)
        result = assess(data)
        output = markdown(result) if args.format == "markdown" else json.dumps(
            result, ensure_ascii=False, indent=2, default=json_default, allow_nan=False) + "\n"
        if args.output:
            with args.output.open("x", encoding="utf-8", newline="\n") as handle:
                handle.write(output)
        else:
            if hasattr(sys.stdout, "reconfigure"):
                sys.stdout.reconfigure(encoding="utf-8")
            print(output, end="")
        return result["exit_code"]
    except (BadInput, OSError, ValueError, TypeError, ArithmeticError) as exc:
        print(f"ข้อมูลผิด: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
