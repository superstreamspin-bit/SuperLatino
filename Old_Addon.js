const { addonBuilder, serveHTTP } = require('stremio-addon-sdk')
const fs = require('fs')
const path = require('path')

// Load content from separate JSON files
const moviesPath = path.join(__dirname, 'movies.json')
const seriesPath = path.join(__dirname, 'series.json')

const movies = JSON.parse(fs.readFileSync(moviesPath, 'utf8'))
const series = JSON.parse(fs.readFileSync(seriesPath, 'utf8'))

// Manifest
const manifest = {
  id: 'org.superstremio.private',
  version: '0.1.1',
  name: 'Latino',
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
  if (id === 'superstremio-movies') {
    const metas = movies.map(movie => ({
      id: movie.id,
      type: 'movie',
      name: movie.name,
      poster: movie.poster
    }))
    return Promise.resolve({ metas })
  } else if (id === 'superstremio-series') {
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
  // Handle movies
  if (type === 'movie') {
    const movie = movies.find(m => m.id === id)
    if (movie) {
      return Promise.resolve({
        streams: [{
          title: movie.title || `${movie.name} [${movie.quality}]`,
          url: movie.url
        }]
      })
    }
  }
  
  // Handle series
  if (type === 'series') {
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

serveHTTP(builder.getInterface(), { port: 7000 })
console.log('SuperStremio running on http://localhost:7000')
console.log(`Loaded ${movies.length} movies and ${series.length} series`)