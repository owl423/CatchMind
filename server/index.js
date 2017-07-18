import Nuxt from 'nuxt'
import express from 'express'
import http from 'http'
import socket from 'socket.io'
import api from './api'
import bodyParser from 'body-parser'
import multer from 'multer'
const app = express()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

let server = http.Server(app);
let io = socket(server);
let upload = multer();
app.set('port', port)

// Import API Routes
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api', api)
// Start nuxt.js
async function start() {
  // Import and Set Nuxt.js options
  let config = require('../nuxt.config.js')
  config.dev = !(process.env.NODE_ENV === 'production')
  // Instanciate nuxt.js
  const nuxt = new Nuxt(config)
  // Add nuxt.js middleware
  app.use(nuxt.render)
  // Listen the server
  // app.listen(3001, host)
  server.listen(port, function(data){
    console.log('Server listening on ' + host + ':' + port)
  })

  io.on('connection', function(socket){
    console.log('connection')
    socket.emit('news', {hello: 'world'});
    socket.on('my event', function(data){
      console.log(data);
    })
  })
}

start()

