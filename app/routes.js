const express = require('express')
const fs = require('fs')
const router = express.Router()

// Add your routes here - above the module.exports line
router.use(require('./middleware/locals'))

// Data sources
router.all('/data/:data/source/:source', (req, res) => {
  const { data, source } = req.params
  res.json(require(`./data/${data}/source/${source}`))
})

// Remove trailing slashes
router.all('\\S+/$', (req, res) => {
  res.redirect(301, req.path.slice(0, -1) + req.url.slice(req.path.length))
})

// Determine latest product name
const { productName } = require('./config')

// Find prototypes here
const search = `${__dirname}/views/prototypes/`
const prototypes = fs.readdirSync(search).filter(file => {
  return fs.statSync(`${search}/${file}`).isDirectory()
})

// Multiple prototypes
for (const directory of prototypes) {
  const prototype = require(`${search}${directory}`)

  // Top level type redirect
  prototype.all('/:type', (req, res) => {
    res.redirect(`/${directory}`)
  })

  // Prototype static assets
  prototype.use(`/assets`, express.static(`${__dirname}/views/prototypes/${directory}/assets`))

  // Prototype router
  router.use(`/${directory}`, (req, res, next) => {
    res.locals.release = directory === 'prototype' ? productName : directory
    prototype(req, res, next)
  });
}

module.exports = router
