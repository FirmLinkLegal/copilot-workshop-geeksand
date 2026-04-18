# Initialize Copilot Instructions

Prompt (same for VS Code and CLI):
```
/init Include in these instructions that, whenever changes are made, you must run a new script, `npm run verify`. Create this new verify command to run the lint, build, and test commands. Also, for frontend changes, verify the flow works as expected using either the #browser tools or Playwright MCP.
```
---

⚡ **Developer Mission Control**

**🛡️ Quality Gate: The Verification Pipeline**

> **CRITICAL:** All changes must pass the project pre-flight check before merging.
>
> Command:
>
> ```bash
> # why: Ensures linting, a production build, and the test-suite all succeed before merging
> npm run verify
> ```
>
> This triggers a sequential pipeline: 🛡️ Linting → 🚀 Production Build → 🧪 Test Suite

---

**🚦 Quick Actions**

- Install dependencies:

```bash
# why: get all required packages for development and CI
npm install
```

- Start the dev server for manual verification:

```bash
# why: run the app locally to visually confirm UI/UX flows
npm run dev
```

---

**🧪 UI Verification Table (Manual)**

| Feature | Action | Expected Result |
|---|---|---|
| Kanban columns | Open the app at `http://localhost:5173` | Three columns render: To Do, In Progress, Complete |
| Add card | Click `+ Add card` in a column and submit | New card appears instantly in that column and badge count increments |
| Edit card | Click ✏️, change title/body, Save | Card updates inline; updated content persists after reload |
| Delete card | Click 🗑️ and confirm | Card is removed; badge count updates accordingly |
| Move card | Use the Move dropdown to change column | Card appears in target column; source/target badges update |
| Persistence | Reload the page | All cards remain (state persisted in localStorage) |

---

**🤖 Automated Testing (optional)**

If you use Playwright or an automated browser runner, you can validate UI flows programmatically.

```bash
# why: run Playwright tests to automate the same manual checks across environments
npx playwright test
```

---

**Checklist — Pre-merge**

- [ ] Run `npm run verify` and fix any reported issues
- [ ] Manually validate critical UI flows (or run Playwright tests)
- [ ] Ensure new UI code includes component-level tests where appropriate

---

If `npm run verify` fails, address lint/build/test errors and re-run the command. The merge should only proceed once the pipeline is green.
