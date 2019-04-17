const express = require('express')
const router = express.Router()

// Local dependencies
const countries = require('../../../data/location-autocomplete')
const decisions = require('../../../data/decision')
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
  return res.redirect('./questions/find-decision-to-do')
})

/**
 * Question: Is the HRT decision recorded in the history?
 */
router.all('/questions/find-decision-history', (req, res) => {
  const submitted = req.body

  // Decision found
  if (submitted.findDecision === 'yes') {
    return res.redirect('./nationality')
  }

  // Decision not found
  if (submitted.findDecision === 'no') {
    return res.redirect('../outcome/do-not-clear')
  }

  res.render(`${__dirname}/views/questions/find-decision-history`)
})

/**
 * Question: Is the HRT decision recorded in the to-do?
 */
router.all('/questions/find-decision-to-do', (req, res) => {
  const submitted = req.body

  // Decision found
  if (submitted.findDecisionToDo === 'yes') {
    return res.redirect('./decision')
  }

  // Decision not found
  if (submitted.findDecisionToDo === 'no') {
    return res.redirect('./find-decision-history')
  }

  res.render(`${__dirname}/views/questions/find-decision-to-do`)
})

/**
 * Question: What’s the current decision recorded in the to-do?
 */
router.all('/questions/decision', (req, res) => {
  const submitted = req.body
  const saved = req.session.data

  // Check right to reside
  if (submitted.rightToReside) {
    return res.redirect('./check-right-to-reside')
  }

  res.render(`${__dirname}/views/questions/decision`, {
    items: decisions.list(saved.rightToReside),
    source: `/data/decision/source/decision-graph.json`
  })
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

  // Only accept valid types
  if (!['eea', 'non-eea'].includes(type)) {
    return res.redirect('../')
  }

  // Check right to reside
  if (submitted.rightToReside) {
    return res.redirect('../check-right-to-reside')
  }

  res.render(`${__dirname}/views/questions/right-to-reside`, {
    items: type === 'eea' ? rightsEEA.list(saved.rightToReside) : rightsNonEEA.list(saved.rightToReside),
    source: `/data/right-to-reside-${type}/source/right-to-reside-${type}-graph.json`
  })
})

/**
 * Handle right to reside redirect
 */
router.all('/questions/check-right-to-reside', (req, res) => {
  const saved = req.session.data

  if (saved.rightToReside) {
    if (saved.rightToReside.match(/(student|self_sufficient|(?<!non_)eea_(indefinite|limited)_leave_to_remain)$/g)) {
      return res.redirect('../outcome/do-not-clear')
    }

    if (saved.rightToReside.match(/(british|permanent_right_to_reside)$/g)) {
      return res.redirect('../outcome/clear')
    }

    // Normalise: Remove prefix, use hyphens for URL
    const right = saved.rightToReside
      .replace(/^(non_)?eea_/, '')
      .replace(/_/g, '-')

    // Redirect to change of circumstances
    return res.redirect(`./confirm-change/${right}`)
  }

  res.redirect('./find-decision-to-do')
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
 * Questions
 */
router.all('/questions/:question', (req, res) => {
  res.render(`${__dirname}/views/questions/${req.params.question}`)
})

/**
 * Outcomes
 */
router.all('/outcome/:outcome', (req, res) => {
  res.render(`${__dirname}/views/outcome/${req.params.outcome}`)
})

module.exports = router
