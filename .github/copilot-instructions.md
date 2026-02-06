# Copilot / AI agent instructions — SuperStremio

This file contains concise, actionable knowledge to help an AI coding agent be productive in this repository.

Overview
- Project type: Node.js (CommonJS) Stremio addon with a small Express-based admin UI.
- Key runtime files: `addon.js` (server + Stremio addon), `admin.html` (web UI).
- Data files: `movies.json` and `series.json` — the addon reads these at runtime and the admin UI edits them.

Quick dev commands
- Install dependencies used by the admin UI: `npm install express` (this repo's `package.json` currently only lists `stremio-addon-sdk`).
- Start locally: `node addon.js` — server listens on port 7000 by convention and exposes `/manifest.json` and `/admin`.

Important conventions & patterns
- Data shape (movies): an array of objects with keys: `id` (IMDb id), `name`, `poster`, `url` (stream link), `title` (display/metadata). Example entry from `movies.json`:

```
{
  "id": "tt35718349",
  "name": "La meta es el amor",
  "poster": "https://...jpg",
  "url": "https://real-debrid.com/streaming-...",
  "title": "📺 Calidad HD\nAudio 🇲🇽 Latino • 🇺🇸 English"
}
```

- Data shape (series): array of shows with `id`, `name`, `poster`, and `episodes` (array of `{season, episode, title, url}`). Example from `series.json`:

```
{
  "id": "tt21066182",
  "name": "Wonder Man",
  "poster": "https://...jpg",
  "episodes": [ { "season":1, "episode":1, "title":"📺 Calidad HD...","url":"https://...mkv" } ]
}
```

- Admin behavior: The admin panel (`admin.html`) writes directly to `movies.json` and `series.json`. Do not rename these files or change their root structure without updating the admin UI and `addon.js` handling code.

- Manifest and port: `addon.js` serves the Stremio manifest at `/manifest.json`. The codebase expects port 7000 in the README/INSTRUCTIONS; if you change the port, update any hard-coded URLs (admin links, manifest URL used by Stremio).

Project-specific notes for code edits
- `stremio-addon-sdk` is used for the addon; inspect `addon.js` to see how metadata and streams are generated. Keep stream `url` values intact — they are Real-Debrid / direct-host links used by Stremio.
- `package.json` lists `type: "commonjs"` — new files should follow CommonJS `require/module.exports` style unless you intentionally migrate the project to ESM and update configs.
- There is no automated test suite. Make small, incremental edits and run `node addon.js` to validate runtime behavior.

What to look for when changing behavior
- If adding endpoints or changing JSON fields, update both `addon.js` and `admin.html` so the UI and addon remain consistent.
- When adding new npm packages, add them to `package.json` and prefer `npm install --save` so collaborators can run `npm install`.

Files to inspect for context
- `addon.js` — main server and Stremio manifest/routes.
- `admin.html` — admin UI that posts updates to the JSON files.
- `movies.json` / `series.json` — data store; used directly by the addon.
- `INSTRUCTIONS.md` — local developer notes (how to install `express`, start server, and expected endpoints).

If something's unclear
- Ask for a quick run of `node addon.js` output if uncertain about runtime messages (server logs indicate loaded counts and URLs).
- If the admin UI behavior needs to be changed, request sample edits to `movies.json`/`series.json` so tests can be run locally.

Status
- If you want, I can run a quick smoke test (install `express`, start the server, and hit `/manifest.json` and `/admin`) and report results.
