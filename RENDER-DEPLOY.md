# Deploy SuperLatino addon to Render (free)

Render’s free tier hosts your addon so you can use it from anywhere. The addon may “sleep” after ~15 minutes of no use; the first open after that can take 30–60 seconds.

## 1. Push your code to GitHub

Your repo is already at: **https://github.com/superstreamspin-bit/SuperLatino**

If you changed files locally, push them:

```bash
cd /Users/zgdx_carlos/SuperStremio
git add .
git commit -m "Add Render deploy config"
git push origin main
```

## 2. Create a Render account

1. Go to **https://render.com**
2. Sign up (e.g. “Sign up with GitHub” so Render can use your repo).

## 3. Create a Web Service

1. In the Render dashboard click **New +** → **Web Service**.
2. **Connect a repository:**  
   If SuperLatino isn’t listed, click **Configure account** and give Render access to the repo, then select **superstreamspin-bit/SuperLatino**.
3. Use these settings:
   - **Name:** `superlatino` (or any name; this becomes part of the URL).
   - **Region:** Pick the one closest to you.
   - **Branch:** `main`.
   - **Runtime:** `Node`.
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** **Free**.
4. Click **Create Web Service**.

Render will build and deploy. When it’s done, you’ll see a URL like:

**https://superlatino.onrender.com**

(or whatever name you chose).

## 4. Use the addon in Stremio

1. Open Stremio.
2. Add addon: paste your Render URL, e.g. **https://superlatino.onrender.com**.
3. Install. Your catalog and streams will work from any network.

## 5. Updating the addon (new movies/series)

1. **At home:** run `node addon.js`, open `http://localhost:7001/admin`, add or edit content. That updates `movies.json` and `series.json`.
2. **Push to GitHub:**
   ```bash
   git add movies.json series.json
   git commit -m "Update content"
   git push origin main
   ```
3. Render will **auto-deploy** from `main`. Wait 1–2 minutes, then the live addon will have the new content.

## Notes

- **Free tier:** Service may sleep after inactivity; first request after sleep can be slow.
- **No credit card** required for the free tier.
- Your **stream URLs** (e.g. Real-Debrid) are unchanged and work from anywhere.
