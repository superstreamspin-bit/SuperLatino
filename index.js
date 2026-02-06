/**
 * Cloud deployment entry point (Render, Railway, etc.).
 * Serves the addon on PORT. For local use with admin panel, run: node addon.js
 */
const { serveHTTP } = require('stremio-addon-sdk')
const addonInterface = require('./beamup.js')

const port = process.env.PORT || 7000
serveHTTP(addonInterface, { port })
console.log('Addon listening on port', port)
