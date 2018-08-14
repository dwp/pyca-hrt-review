/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (
  window.sessionStorage && window.sessionStorage.getItem('prototypeWarning') !== 'false' &&
  window.console && window.console.info
) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
  window.sessionStorage.setItem('prototypeWarning', true)
}

// load GA tracking immediately
(function() {
  "use strict";

  GOVUK.Analytics.load();

  var cookieDomain = (document.domain === 'www.gov.uk') ? '.www.gov.uk' : document.domain;

  var options = {
    universalId: 'UA-57523228-34',      // this is the id from PYCA
    cookieDomain: cookieDomain,
    siteSpeedSampleRate: 100    // this is for the timing
  };

  if(location.pathname === '/') { // if on start page
    options['sessionControl'] = 'start'   // start new session
  };

  GOVUK.analytics = new GOVUK.Analytics(options);

  // track the service
  GOVUK.analytics.setDimension(4, 'service=hrt-review-prototype');

  // track the release
  var release = document.querySelector('meta[property=releaseVersion]').content;
  GOVUK.analytics.setDimension(7, 'release=' + release);

  // track the question
  var question = document.querySelector('#question');
  if(!!question) {
    GOVUK.analytics.setDimension(9, '' + question.innerText);
  }

  // track outcomes
  var outcome = document.querySelector('#outcome');
  if(!!outcome) {
    GOVUK.analytics.setDimension(1, 'outcome=' + outcome.innerText);
    GOVUK.analytics.setDimension(3, 'outcome=' + outcome.innerText);
    GOVUK.analytics.setDimension(9, 'outcome=' + outcome.innerText);
  }

  GOVUK.analyticsPlugins.error();
  GOVUK.analyticsPlugins.externalLinkTracker();
  GOVUK.analyticsPlugins.printIntent();

  // Track initial pageview
  GOVUK.analytics.trackPageview();
})();

$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()
  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()

  // Handle back clicks
  var backLink = $('.link-back');
  backLink.click(function(e) {
    e.preventDefault();
    window.history.back();
  });

  // openregister picker init
  var openregisterPicker = document.querySelector('#openregister-picker');
  if(!!openregisterPicker) {
    openregisterLocationPicker({
      selectElement: openregisterPicker,
      url: openregisterPicker.dataset.graph,
      onSelect: function(result) {
        if(!result) { return; }
        var requestedOption = Array.prototype.filter.call(openregisterPicker.options, o => o.innerText === (result && result.name))[0];
        if (requestedOption) { requestedOption.selected = true }
      }
    });
  }

  // track button clicks
  var button = document.querySelector('.button');
  if(!!button) {
    button.addEventListener('click', function(event) {
      GOVUK.analytics.trackEvent(button.classList[1], 'button-click', { label: button.value });
    });
  }

  var chosen = null;

  // track radio select, change
  var inputs = document.querySelectorAll('.multiple-choice');
  inputs.forEach(function(input) {
    input.addEventListener('click', function(e) {
      var question = document.querySelector('#question');
      (chosen === null) ?
        GOVUK.analytics.trackEvent('radio-select', question.innerText, { label: e.target.value }) :
        GOVUK.analytics.trackEvent('radio-change', question.innerText, { label: 'From: ' + chosen + ' - ' + 'To: ' + e.target.value });
      chosen = e.target.value;
    });
  });

  // track form submit
  var form = document.querySelector('form');
  if(!!form) {
    form.addEventListener('submit', function(e) {
      var question = document.querySelector('#question');
      GOVUK.analytics.trackEvent('form-submit', question.innerText, { label: chosen });
    });
  }

  var error = document.querySelector('.error-summary');
  if(!!error) {
    var question = document.querySelector('#question');
    var component = 'radio';
    GOVUK.analytics.trackEvent(component + '-error', question.innerText, { label: location.pathname + ' - incomplete field' });
  }

  // track clicks on back
  var back = document.querySelector('.link-back');
  if(!!back) {
    back.addEventListener('click', function(e) {
      GOVUK.analytics.trackEvent('button - click', 'link-back', { label: 'Back' });
    });
  }

  // track clicks on service name in topnav
  var propName = document.querySelector('#proposition-name');
  if(!!propName) {
    propName.addEventListener('click', function(e) {
      GOVUK.analytics.trackEvent('link - click', 'proposition-name');
    });
  }

  // track clicks on links
  var links = document.querySelectorAll('main#content a');
  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      GOVUK.analytics.trackEvent('link - click', link.innerText);
    });
  });

});
