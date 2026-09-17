# Verification — 16 September 2026

The installation flow was exercised in disposable learner folders, not in the author's live Second Brain.

Verified locally:

- Archive CRC, exact manifest membership and SHA-256 for all payload files.
- 14 matching skill packages in each host directory, including supporting files and local Markdown skill links.
- Python and Windows PowerShell archive installers: fresh installation, repeat preservation, partial-install recovery, collision refusal, and rejection of traversal, symlink, duplicate-case and tampered archive inputs.
- Windows PowerShell and Bash GitHub bootstrap logic using the local release ZIP: fresh installation, hidden skill folders, preserved personal answers, missing-skill detection, conflict refusal and checksum rejection. Bash was exercised through Git Bash on Windows; that is not a physical macOS test.
- Optional Node app preflight. Dashboard profile/task save, Markdown projections, saved interview preservation, stale-revision rejection and persistence after the process exits.
- Scan for author-specific absolute computer paths and common credential patterns in the release. No personal business records were added from the surrounding workspace.

The final documentation-only changes were followed by another full archive/PowerShell/Python regression run. They do not turn the following untested items into verified outcomes:

- Actual macOS execution.
- A recipient's native Claude Code `/onboard` or Codex `$onboard` menu discovery.
- A complete model-led interview on a fresh recipient account. The skill instructions and saving contract were reviewed; file presence is not proof of model behavior.
- Google connections, background synchronization, publication of a recipient's data, or business/time-saving results.

The main flow starts onboarding by reading the local SKILL.md, so a skill menu refresh is not required to ask the first question. A native menu check can be made in a new local session after installation.

The current ZIP size and digest are in release.json and SHA256SUMS.txt.

## Version 3.0.1 regression review

The usability review reproduced and repaired custom/blank department changes, dropped profile/task metadata, hardcoded Laos dates, the app-first Lao guide and the old company label. All 10 focused browser checks and 23 package/installer checks passed on the revised release; 24 local guide links resolved. See [the review and remaining acceptance checks](REVIEW.md). The previously stated runtime and recipient-testing limits still apply.

## Published GitHub route

Verified on 2026-09-16 after publication: the repository is Public through an unauthenticated API request. Anonymous downloads of README, INSTALL.md and both bootstrap scripts match the reviewed release. The published PowerShell bootstrap downloaded the public ZIP and installed every payload file into a fresh Windows folder containing spaces. Both project skill directories contain 14 skills, and the initial profile/tasks/intake are blank. No GitHub login was used for the download test. This does not establish a physical macOS test or a recipient's native skill-menu discovery.
