/**
 * Decision helper
 */

// Map of all decisions
const list = require('./source/decision-canonical-list.json')

// Array of all decisions
const items = []

// Convert map to array of objects
for (const [text, value] of list) {
  items.push({ text, value })
}

// Add default item
items.unshift({
  text: 'Please select',
  value: ''
})

// List with optional selected value
module.exports.list = value => {
  for (const item of items) {
    item.selected = (value === item.value)
  }
  return items
}
