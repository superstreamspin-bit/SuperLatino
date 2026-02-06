# Deploy SuperStremio to BeamUp (use from anywhere)

BeamUp is Stremio’s free addon hosting. Once deployed, your addon gets a public URL so you can use it from any network (home, travel, etc.). Your Real-Debrid stream URLs keep working from anywhere.

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- **GitHub account** (you have this)
- **SSH key added to GitHub** (see below if needed)

## 1. Add your SSH key to GitHub (one-time)

If you already use `git push` with GitHub over SSH, skip to step 2.

1. Check for an existing key:
   ```bash
   ls -la ~/.ssh
   ```
   Look for `id_ed25519.pub` or `id_rsa.pub`.

2. If you don’t have one, create it (use your GitHub email):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519 -N ""
   ```

3. Copy the **public** key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   (or `id_rsa.pub` if you use RSA.)

4. In GitHub: **Settings → SSH and GPG keys → New SSH key**. Paste the key and save.

5. Test:
   ```bash
   ssh -T git@github.com
   ```
   You should see: “Hi username! You've successfully authenticated…”

## 2. Put your project on GitHub

In the SuperStremio folder:

```bash
cd /Users/zgdx_carlos/SuperStremio

# If this is not yet a git repo
git init

# Add everything (node_modules is ignored via .gitignore)
git add .
git commit -m "SuperStremio addon for BeamUp"

# Create a new repo on GitHub (github.com → New repository), then:
git remote add origin git@github.com:YOUR_USERNAME/SuperStremio.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and use your real repo name if it’s different.

## 3. Install and configure BeamUp CLI (one-time)

```bash
npm install -g beamup-cli
```

First time you run `beamup`:

- **Host:** `a.baby-beamup.club`
- **GitHub username:** your GitHub username

To change these later: `beamup config`.

## 4. Deploy to BeamUp

From your project directory:

```bash
cd /Users/zgdx_carlos/SuperStremio
beamup
```

The CLI will create a repo on your GitHub (e.g. `superstremio-beamup`) and deploy. When it finishes, it will show your addon URL, e.g.:

`https://superstremio.a.baby-beamup.club`

## 5. Use the addon in Stremio

1. Open Stremio.
2. Add addon: paste the URL (e.g. `https://superstremio.a.baby-beamup.club`).
3. Install the addon. It will work from any location.

## Updating the addon (new movies/series)

1. **At home:** use your admin panel as usual (`node addon.js`, then open `http://localhost:7001/admin`) to add/remove movies and series. This updates `movies.json` and `series.json`.
2. **Commit and push** (so BeamUp gets the new data):
   ```bash
   git add movies.json series.json
   git commit -m "Update content"
   git push origin main
   ```
3. **Redeploy** so BeamUp uses the new files:
   ```bash
   beamup
   ```
   Or, if the CLI set it up: `git push beamup main`.

## Summary

| Step | Action |
|------|--------|
| 1 | Add SSH key to GitHub |
| 2 | Push SuperStremio to a GitHub repo |
| 3 | `npm install -g beamup-cli` and run `beamup` (set host + username once) |
| 4 | Run `beamup` in the project folder and get your addon URL |
| 5 | In Stremio, add the addon by URL and use it from anywhere |

Your stream links (Real-Debrid) are not tied to your home IP, so they work no matter where you open Stremio.
