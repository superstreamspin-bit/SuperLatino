# SuperStremio Admin Interface - Installation Instructions

## What's New
You now have a web-based admin panel to easily add movies and TV shows without editing JSON files!

## Installation Steps

### 1. Install Express (required for the web interface)
Open your terminal and run:
```bash
cd /Users/zgdx_carlos/SuperStremio
npm install express
```

### 2. Replace your files
Replace these files in your SuperStremio folder:
- `addon.js` (the updated version)
- `admin.html` (new file)

### 3. Start the server
```bash
node addon.js
```

You should see:
```
SuperStremio running on http://localhost:7000
Admin panel: http://localhost:7000/admin
Loaded X movies and Y series
```

## How to Use the Admin Panel

### Access the Admin Panel
Open your browser and go to:
```
http://localhost:7000/admin
```

### Add a Movie
1. Click "Add Movie" tab
2. Fill in:
   - IMDb ID (e.g., tt0133093)
   - Movie Name
   - Poster URL
   - Video URL (your Real-Debrid link)
   - Quality (HD or 4K)
   - Audio languages (check all that apply)
3. Click "Add Movie"

### Add a TV Episode
1. Click "Add TV Episode" tab
2. Fill in:
   - IMDb ID (e.g., tt21066182)
   - Show Name
   - Poster URL
   - Season Number
   - Episode Number
   - Video URL (your Real-Debrid link)
   - Quality (HD or 4K)
   - Audio languages (check all that apply)
3. Click "Add Episode"

### View Your Content
1. Click "View Content" tab
2. See all your movies and episodes
3. Delete items with the "Delete" button

## Important Notes

- **No restart needed!** Changes are saved automatically to your JSON files
- The Stremio addon still works at: `http://localhost:7000/manifest.json`
- Your existing `movies.json` and `series.json` files are still used
- The admin panel just makes it easier to edit them

## Troubleshooting

**If you get "Cannot find module 'express'":**
Run: `npm install express`

**If the admin panel doesn't load:**
Make sure both `addon.js` and `admin.html` are in the same folder

**If changes don't appear in Stremio:**
The addon updates automatically, but you may need to refresh Stremio

## Next Steps

When you're ready to host this on a cloud server, let me know and I'll help you:
1. Set up password protection for the admin panel
2. Deploy to a cloud provider
3. Get a permanent URL

Enjoy! 🎬
