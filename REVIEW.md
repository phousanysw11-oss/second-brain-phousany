# Usability review — version 3.0.1

Verdict: suitable for a first recipient pilot. Fresh Windows installation and the tested Dashboard interactions work. A full interview on a new user's Claude Code or Codex account is still an acceptance check, not a demonstrated result.

## Bugs reproduced and fixed

| Problem in 3.0.0 | Change in 3.0.1 |
| --- | --- |
| Saving a custom onboarding department could silently replace it with a preset department. Skipping the department was not preserved. | Free-text department with optional suggestions; custom and blank values survive saving. |
| Profile and task forms dropped extra saved fields, including task source provenance. | Form changes merge into the existing record, preserving fields the form does not edit. |
| Due dates used Laos time for every recipient. | Today and the next seven days use the recipient computer's local calendar date. |
| Lao entry pages still instructed beginners to install Node and open the Dashboard first. | Both entry pages use create folder → open in AI app → paste installation request. Dashboard and 3D Brain are optional. |
| The generic Dashboard identified the recipient as a PUZANY manager. | Generic personal Second Brain label. |

## What was tested

- 10 focused browser checks passed in headless Microsoft Edge with synthetic data, including timezone, profile/task preservation and Lao guide rendering. Screenshots were inspected. The earlier reproduction had 8 failures and 1 pass; one rendering check was added after repair.
- 23 package/installer checks passed: exact file hashes, both skill trees, skill links, fresh installs, repeated installs preserving user answers, collision refusal, malformed archive rejection and optional app preflight.
- 24 local guide links resolved.
- The published Windows installation route is checked separately; see [verification](VERIFICATION.md).

## Is it simple? Is it better?

The starting flow is three user actions and one interview. Core use does not require Git, Node, Google connections or a separate manual skill installation. This reduces setup steps compared with this package's former app-first guide.

The optional Dashboard, team controls and 3D Brain still add concepts. They should not be prerequisites for a beginner's first useful task. The kit has more components than [AIS-OS](https://github.com/nateherkai/AIS-OS), whose current README lists six core skills. More components are not proof of a better experience; this release has no measured time-saving or comparative user-study result.

Recommended recipient check: one new user creates a folder, installs through the README message, answers or skips onboarding questions, starts a new session, confirms the AI recalls the saved answers, and completes one real task. Record any point where help is required.

## Limits

- Actual macOS execution, native recipient skill discovery and a complete model-led interview remain untested. Bash was previously exercised through Git Bash on Windows.
- Claude Code uses `/onboard`; Codex uses `$onboard` or plain-language invocation. During installation the AI reads the local skill directly, without waiting for menu discovery.
- Google/team connections are optional and are not configured or proved by these tests.
- This is a fresh-install release, not an automatic migration. The installer refuses incompatible existing files. For an existing personalized 3.0.0 folder, retain it and apply a reviewed, backed-up patch; do not replace the entire folder with the new ZIP.
