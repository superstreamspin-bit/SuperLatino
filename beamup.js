const { addonBuilder, serveHTTP } = require('stremio-addon-sdk')
const fs = require('fs')
const path = require('path')

// File paths
const moviesPath = path.join(__dirname, 'movies.json')
const seriesPath = path.join(__dirname, 'series.json')

// Helper functions to load data
function loadMovies() {
  return JSON.parse(fs.readFileSync(moviesPath, 'utf8'))
}

function loadSeries() {
  return JSON.parse(fs.readFileSync(seriesPath, 'utf8'))
}

// Manifest
const manifest = {
  id: 'org.superstremio.private',
  version: '1.0.0',
  name: 'SuperStremio',
  description: 'Private family addon',
  resources: ['catalog', 'stream'],
  types: ['movie', 'series'],
  catalogs: [
    {
      type: 'movie',
      id: 'superstremio-movies',
      name: 'SuperStremio - Movies'
    },
    {
      type: 'series',
      id: 'superstremio-series',
      name: 'SuperStremio - TV'
    }
  ]
}

const builder = new addonBuilder(manifest)

// Catalog handler
builder.defineCatalogHandler(({ type, id }) => {
  console.log('Catalog request:', type, id)
  
  if (id === 'superstremio-movies') {
    const movies = loadMovies()
    const metas = movies.map(movie => ({
      id: movie.id,
      type: 'movie',
      name: movie.name,
      poster: movie.poster
    }))
    return Promise.resolve({ metas })
  } else if (id === 'superstremio-series') {
    const series = loadSeries()
    const metas = series.map(show => ({
      id: show.id,
      type: 'series',
      name: show.name,
      poster: show.poster
    }))
    return Promise.resolve({ metas })
  }
  return Promise.resolve({ metas: [] })
})

// Stream handler
builder.defineStreamHandler(({ type, id }) => {
  console.log('Stream request:', type, id)
  
  if (type === 'movie') {
    const movies = loadMovies()
    const movie = movies.find(m => m.id === id)
    if (movie) {
      return Promise.resolve({
        streams: [{
          title: movie.title,
          url: movie.url
        }]
      })
    }
  }
  
  if (type === 'series') {
    const series = loadSeries()
    const [imdbId, season, episode] = id.split(':')
    const show = series.find(s => s.id === imdbId)
    
    if (show) {
      const ep = show.episodes.find(e => 
        e.season === parseInt(season) && e.episode === parseInt(episode)
      )
      
      if (ep) {
        return Promise.resolve({
          streams: [{
            title: ep.title,
            url: ep.url
          }]
        })
      }
    }
  }
  
  return Promise.resolve({ streams: [] })
})

module.exports = builder.getInterface()