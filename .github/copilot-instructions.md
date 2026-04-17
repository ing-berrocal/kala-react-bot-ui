---
applyTo: '**'
---
### Build, test, lint
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview prod build: `npm run preview`
- Lint: `npm run lint`
- Tests: No test runner configured in `package.json`. Consider adding a test framework like Jest or Vitest for unit testing.

### Architecture
- Vite + React app. Entry `src/main.jsx` mounts `<App />` into `#root`, and imports `rsuite/dist/rsuite-no-reset.min.css` plus `src/index.css`.
- UI composition starts in `src/App.jsx`; it uses static assets from `src/assets` and renders `src/components/MainMenu.jsx`.
- UI widgets are built with RSuite (e.g., `Navbar`, `Nav`), so prefer RSuite components for layout and controls.
- Build pipeline uses `@vitejs/plugin-react` plus React Compiler via `@rolldown/plugin-babel` and `reactCompilerPreset()` in `vite.config.js`.

### Conventions
- ESM modules only (`"type": "module"` in `package.json`); use `import`/`export` everywhere.
- Assets live in `src/assets`, reusable UI in `src/components`.
- RSuite styles: keep `rsuite-no-reset` imported in `main.jsx`; avoid overriding RSuite styles directly unless required.
- ESLint uses flat config (`eslint.config.js`) with React Hooks + React Refresh rules; `no-unused-vars` ignores capitalized vars (`^[A-Z_]`).

### Recommendations
- **Testing**: Add a testing framework to ensure code quality.
- **Documentation**: Expand the `README.md` to include setup instructions and contribution guidelines.
- **Error Handling**: Implement error boundaries in React to handle runtime errors gracefully.
