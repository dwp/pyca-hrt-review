const express = require('express')
const router = express.Router()

// Local dependencies
const countries = require('../../../data/location-autocomplete')
const rightsEEA = require('../../../data/right-to-reside-eea')
const rightsNonEEA = require('../../../data/right-to-reside-non-eea')
const rightsList = rightsEEA.list().concat(rightsNonEEA.list())

/**
 * Prototype index
 */
router.all('/', (req, res) => {
  req.session = {}
  res.render(`${__dirname}/views/index`, { isStart: true })
})

/**
 * Redirects to first question
 */
router.all('/questions', (req, res) => {
  return res.redirect('./questions/find-decision')
})

/**
 * Question: Can you locate the decision?
 */
router.all('/questions/find-decision', (req, res) => {
  const submitted = req.body

  // Decision found
  if (submitted.findDecision === 'yes') {
    return res.redirect('./nationality')
  }

  // Decision not found
  if (submitted.findDecision === 'no') {
    return res.redirect('../outcome/do-not-clear')
  }

  res.render(`${__dirname}/views/questions/find-decision`)
})

/**
 * Question: Nationality
 */
router.all('/questions/nationality', (req, res) => {
  const submitted = req.body
  const saved = req.session.data

  if (submitted.nationality) {
    if (countries.isCTA(submitted.nationality)) {
      return res.redirect('../outcome/clear')
    }

    if (countries.isEEA(submitted.nationality)) {
      return res.redirect('./right-to-reside/eea')
    }

    return res.redirect('./right-to-reside/non-eea')
  }

  res.render(`${__dirname}/views/questions/nationality`, {
    items: countries.list(saved.nationality)
  })
})

/**
 * Question: Right to reside (EEA and Non-EEA)
 */
router.all('/questions/right-to-reside/:type', (req, res) => {
  const submitted = req.body
  const saved = req.session.data

  // Check if routing EEA or Non-EEA
  const type = req.params.type

  // Check right to reside
  if (submitted.rightToReside) {
    if (['student', 'self_sufficient'].includes(submitted.rightToReside)) {
      return res.redirect('../../outcome/do-not-clear')
    }

    if (['permanent_right_to_reside'].includes(submitted.rightToReside)) {
      return res.redirect('../../outcome/clear')
    }

    // Normalise with hyphens for URL
    const right = submitted.rightToReside.replace(/_/g, '-')
    return res.redirect(`../confirm-change/${right}`)
  }

  res.render(`${__dirname}/views/questions/right-to-reside`, {
    items: type === 'eea' ? rightsEEA.list(saved.rightToReside) : rightsNonEEA.list(saved.rightToReside),
    source: `/data/right-to-reside-${type}/source/right-to-reside-${type}-graph.json`
  })
})

/**
 * Question: Change of circumstances?
 */
for (let { value: right } of rightsList) {
  right = right.replace(/_/g, '-')

  // Routing for this right
  router.all(`/questions/confirm-change/${right}`, (req, res) => {
    const submitted = req.body

    // Circumstances have changed
    if (submitted.changes === 'yes') {
      return res.redirect('../../outcome/do-not-clear')
    }

    // Circumstances have not changed
    if (submitted.changes === 'no') {
      return res.redirect('../../outcome/clear')
    }

    res.render(`${__dirname}/views/questions/confirm-change/${right}`)
  })
}

/**
 * Outcomes
 */
router.all('/outcome/:outcome', (req, res) => {
  res.render(`${__dirname}/views/outcome/${req.params.outcome}`)
})

module.exports = router
