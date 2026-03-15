#!/usr/bin/env python3
"""
Dark Factory v6.1 — PostToolUse Hooks
Runs after every Write/Edit tool call.

Hooks:
1. update-progress: After every 2 file writes, prompt progress update
2. elegance-trigger: After significant code writes, inject elegance check
3. lessons-reminder: If error pattern detected, remind to update lessons.md
"""

import json
import sys
import os
import re

def main():
    try:
        hook_input = json.loads(sys.stdin.read())
    except Exception:
        sys.exit(0)

    tool_name = hook_input.get("tool_name", "")
    tool_input = hook_input.get("tool_input", {})
    tool_response = hook_input.get("tool_response", {})

    # Only trigger on Write and Edit tools
    if tool_name not in ("Write", "Edit", "str_replace_based_edit_tool", "create_file"):
        sys.exit(0)

    file_path = tool_input.get("path", tool_input.get("file_path", ""))

    # Skip meta-files to avoid infinite loops
    skip_patterns = ["lessons.md", "progress.md", "task_plan.md", "findings.md"]
    if any(skip in file_path for skip in skip_patterns):
        sys.exit(0)

    # Track write count in temp file
    counter_file = "/tmp/df_write_counter"
    try:
        with open(counter_file, "r") as f:
            count = int(f.read().strip())
    except Exception:
        count = 0

    count += 1

    with open(counter_file, "w") as f:
        f.write(str(count))

    messages = []

    # Every 2 writes: remind to update progress.md
    if count % 2 == 0:
        messages.append(
            "📊 [DF Hook] Update tasks/progress.md with what was just completed."
        )

    # Check if this is a significant code file (not config/lock)
    is_code_file = bool(re.search(
        r"\.(ts|tsx|js|jsx|py|rs|go|java|rb|php|vue|svelte)$",
        file_path
    ))

    content = tool_input.get("content", tool_input.get("new_str", ""))
    is_significant = len(content) > 100  # More than 100 chars of code

    # Every 5 writes on code files: trigger elegance check
    if is_code_file and is_significant and count % 5 == 0:
        messages.append(
            "✨ [DF Hook — Demand Elegance] Before continuing: "
            "Is there a more elegant way to implement what was just written? "
            "'Knowing everything I know now, implement the elegant solution.' "
            "If it's already elegant, proceed."
        )

    if messages:
        print("\n".join(messages))
        # Output as a message to Claude (non-blocking)
        sys.exit(0)

    sys.exit(0)

if __name__ == "__main__":
    main()
