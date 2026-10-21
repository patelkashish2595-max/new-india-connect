# New India Connect – repair notes

This repair fills the zero-byte React source files found in the supplied archive with working starter implementations (API helpers, auth/theme contexts, hooks, route components, page shells, and shared layout/chat/story/reel components).

## Important status
- The existing `src/App.jsx` is still the primary application UI and contains its own navigation and API calls.
- Newly repaired modular pages/components are starter implementations; they are not proof that every Instagram-like feature is fully implemented.
- Full build/runtime verification could not be completed in this environment because dependencies were not available to run Vite successfully.
- The original `better-sqlite3` native module install issue is not silently bypassed by this archive. On Windows it may require compatible Node.js/native build tools. See `npm install` output and install the Visual Studio C++ Build Tools workload if the native module must compile.

## Run locally
1. Install a supported Node.js LTS release.
2. In this directory run `npm install`.
3. Copy `server/.env.example` to `server/.env` and configure the values as documented in README.md.
4. Terminal 1: `npm run dev:server`
5. Terminal 2: `npm run dev`
6. Open the local Vite URL printed in the terminal.

Do not use production credentials in local testing. Test authentication, upload, database persistence, permissions and admin functions before deployment.
