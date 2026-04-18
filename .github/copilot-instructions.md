# Copilot Instructions

## Verification

Whenever you make changes to the codebase, run the project verification script:

```bash
npm run verify
```

This runs the project linters, builds the app, and runs the test suite (`npm run lint && npm run build && npm test`). Fix any reported errors before finishing.

For frontend/visual changes, verify the user flows work correctly using the `#browser` tool or Playwright MCP.

## Documentation & Research

When you need to look up or learn how to use **Vite features**, use the context7 MCP with the `vitejs/vite` library. For example:

- How to configure plugins
- How to use `defineConfig`
- Build optimisations, SSR, env variables, proxy settings, etc.

Always resolve the library ID first with `context7`, then fetch up-to-date docs before writing Vite-related code.
