const { addonBuilder, serveHTTP } = require('stremio-addon-sdk')
const fs = require('fs')
const path = require('path')
const express = require('express')

// Load content from separate JSON files
const moviesPath = path.join(__dirname, 'movies.json')
const seriesPath = path.join(__dirname, 'series.json')

let movies = JSON.parse(fs.readFileSync(moviesPath, 'utf8'))
let series = JSON.parse(fs.readFileSync(seriesPath, 'utf8'))

// Manifest
const manifest = {
  id: 'org.superstremio.private',
  version: '0.2.3',
  name: 'Latino',
  description: 'Private family addon',
  resources: ['catalog', 'stream'],
  types: ['movie', 'series'],
  catalogs: [
    {
      type: 'movie',
      id: 'superstremio-movies',
      name: 'Latino'
    },
    {
      type: 'series',
      id: 'superstremio-series',
      name: 'Latino'
    }
  ]
}

const builder = new addonBuilder(manifest)

// Catalog handler
builder.defineCatalogHandler(({ type, id }) => {
  console.log('Catalog request:', type, id)
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
  console.log('Stream request:', type, id)
  // Handle movies
  if (type === 'movie') {
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

// Start Stremio addon server on port 7000
serveHTTP(builder.getInterface(), { port: 7000 })

// Create separate Express app for admin on port 7001
const adminApp = express()
adminApp.use(express.json())
adminApp.use(express.urlencoded({ extended: true }))

adminApp.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'))
})

adminApp.get('/api/content', (req, res) => {
  res.json({ movies, series })
})

adminApp.post('/api/movies', (req, res) => {
  const { id, name, poster, url, quality, audio } = req.body
  
  const qualityText = quality === '4K' ? '4K' : 'HD'
  const audioText = audio.join(' • ')
  const title = `📺 Calidad ${qualityText}\nAudio ${audioText}`
  
  const newMovie = { id, name, poster, url, title }
  
  const existingIndex = movies.findIndex(m => m.id === id)
  if (existingIndex !== -1) {
    movies[existingIndex] = newMovie
  } else {
    movies.push(newMovie)
  }
  
  fs.writeFileSync(moviesPath, JSON.stringify(movies, null, 2))
  
  res.json({ success: true, movie: newMovie })
})

adminApp.post('/api/episodes', (req, res) => {
  const { id, name, poster, season, episode, url, quality, audio } = req.body
  
  const qualityText = quality === '4K' ? '4K' : 'HD'
  const audioText = audio.join(' • ')
  const title = `📺 Calidad ${qualityText}\nAudio ${audioText}`
  
  const newEpisode = {
    season: parseInt(season),
    episode: parseInt(episode),
    title,
    url
  }
  
  let show = series.find(s => s.id === id)
  if (!show) {
    show = {
      id,
      name,
      poster,
      episodes: []
    }
    series.push(show)
  }
  
  const existingEpIndex = show.episodes.findIndex(
    e => e.season === parseInt(season) && e.episode === parseInt(episode)
  )
  
  if (existingEpIndex !== -1) {
    show.episodes[existingEpIndex] = newEpisode
  } else {
    show.episodes.push(newEpisode)
  }
  
  fs.writeFileSync(seriesPath, JSON.stringify(series, null, 2))
  
  res.json({ success: true, episode: newEpisode })
})

adminApp.delete('/api/movies/:id', (req, res) => {
  movies = movies.filter(m => m.id !== req.params.id)
  fs.writeFileSync(moviesPath, JSON.stringify(movies, null, 2))
  res.json({ success: true })
})

adminApp.delete('/api/episodes/:id/:season/:episode', (req, res) => {
  const { id, season, episode } = req.params
  const show = series.find(s => s.id === id)
  
  if (show) {
    show.episodes = show.episodes.filter(
      e => !(e.season === parseInt(season) && e.episode === parseInt(episode))
    )
    
    if (show.episodes.length === 0) {
      series = series.filter(s => s.id !== id)
    }
    
    fs.writeFileSync(seriesPath, JSON.stringify(series, null, 2))
  }
  
  res.json({ success: true })
})

adminApp.listen(7001, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║          SuperStremio is running!                  ║
╠════════════════════════════════════════════════════╣
║  Stremio Addon: http://192.168.100.101:7000        ║
║  Admin Panel:   http://localhost:7001/admin        ║
║                                                     ║
║  Content: ${movies.length} movies, ${series.length} series                         ║
╚════════════════════════════════════════════════════╝
  `)
})