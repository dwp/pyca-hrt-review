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
