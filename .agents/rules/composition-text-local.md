---
description: Agents must not edit config/local's *.local.json (especially composition-text.local.json)
alwaysApply: true
---

# Don't touch `composition-text.local.json`

- **`config/local/composition-text.local.json`** and other **`config/local/*.local.json`** files in the same directory are personal, uncommitted, per-user settings. **Agents must not do anything beyond reading them (no editing content, creating new ones, deleting, or rekeying).**
- Only edit committed files: the sample/template copy lives in **`config/local/composition-text.example.json`**, and the types/merge logic live under **`src/composition/`**.
- **Exception**: only when the user explicitly asks in this chat to "update local," naming the target path and the change — and only within the scope of that instruction.
