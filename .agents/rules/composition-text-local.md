# composition-text.local.json policy

- **`config/local/composition-text.local.json`** and other **`config/local/*.local.json`** files are personal, uncommitted, per-user settings.
- Agents must not edit, create, delete, or rekey them unless the user explicitly names the local target path and asks for that exact change in chat.
- The sample/template copy lives in **`config/local/composition-text.example.json`**, and the types/merge logic live under **`src/composition/`**.
- For `CodeStream`, keep the content split across **`config/local/composition-text.example.json`** and **`config/local/composition-text.local.json`** under `codeStreamPatterns`, with runtime wiring in **`src/composition/`**.
