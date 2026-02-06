/**
 * BeamUp deployment entry point.
 * Serves the addon on PORT (set by BeamUp/Heroku). Use this for cloud deployment.
 * For local use with admin panel, run: node addon.js
 */
const { serveHTTP } = require('stremio-addon-sdk')
const addonInterface = require('./beamup.js')

const port = process.env.PORT || 7000
serveHTTP(addonInterface, { port })
console.log('Addon listening on port', port)
