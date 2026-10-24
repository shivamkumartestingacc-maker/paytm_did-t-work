# Making UPI Rewards Worth Earning

A long-form product-design case study with an interactive mobile prototype for a Paytm rewards concept.
Independent concept: not affiliated with, commissioned or endorsed by Paytm. All payments and rewards are simulated.

## Deployment (use the Vite preset)

This repo contains a **pre-built, self-contained `index.html`** plus a minimal Vite wrapper
(`package.json`, `package-lock.json`, and `vite.config.js`). The wrapper exists for hosts
whose deployment panel does not offer an "Other/Static" preset. During deployment, Vite
processes the checked-in file and publishes a normal Vite build from `dist/`.

Use these deployment settings:

| Setting | Value |
|---|---|
| Directory / Root Directory | `./` |
| Application / Framework Preset | **Vite** |
| Install Command | `npm ci` (or the panel's default `npm install`) |
| Build Command | `npm run build` |
| Output / Publish Directory | `dist` |
| Node.js version | 18 or newer |

`vite` is deliberately listed under `dependencies`, not `devDependencies`, so production
installs do not omit it. That prevents the earlier deployment failure:

> `sh: line 1: vite: command not found` / `[BUILD_UTILS_SPAWN_127] Command "vite build" exited with 127`

That error happened because the host selected the Vite preset while the repo contained no
`package.json`, lockfile, or Vite configuration, so Vite was never installed.

To verify locally:

```bash
npm ci
npm run build
```

A successful build creates `dist/index.html` and `dist/assets/*.js`.

## Restoring the Vite source project (optional, future)

The original source scaffold (`package.json`, `vite.config.ts`, `tsconfig*.json`,
`eslint.config.js`, source `index.html`) is preserved in git history at commit `990511a`;
the `src/` source itself was never committed (`src/main.tsx`, `src/config.ts`,
`src/state.tsx`, `src/phone/*`, `src/case/*`, `src/styles/*`, `src/art.tsx`).

If you restore `src/` + that scaffold and want the host to build from source again:

1. Restore the original source `index.html` (the template that loads `/src/main.tsx`) in
   place of the current pre-built file.
2. Restore the full development dependencies and TypeScript scripts from the original
   `package.json`.
3. Keep the Build Command as `npm run build` and the output directory as `dist`.
4. Make sure the install step includes every package needed by the build. In particular,
   do not omit packages required by `tsc` or Vite.
5. Run `npm ci && npm run build` locally before deploying.
