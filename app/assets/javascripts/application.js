/* global $ openregisterLocationPicker */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

// Any autocomplete picker
var picker = document.querySelector('select[data-source]')

if (picker) {
  openregisterLocationPicker({
    defaultValue: '',
    selectElement: picker,
    url: picker.dataset.source
  })
}

// Document container for event bubbling
var container = $(document.body)

// Use history for back link
container.on('click', '.govuk-back-link', function (event) {
  if (window.history && window.history.length > 2) {
    window.history.back()
    event.preventDefault()
  }
})
