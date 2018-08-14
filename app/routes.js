const express = require('express'),
  countries = require('./countries/location-picker-canonical-list'),
  reside_types = require('./residence/right-to-reside-canonical-list'),
  cta = require('./countries/british_cta'),
  eea = require('./countries/eea'),
  router = express.Router();

const staticmap = [
  { uri: '/',           view: 'index' },
  { uri: '/refer',      view: 'pages/outcome/refer_to_dm' },
  { uri: '/nochange',   view: 'pages/outcome/no_change' },
  { uri: '/noneea',     view: 'pages/noneea' },
  { uri: '/cta',        view: 'pages/cta' }
];

const yesnomap = [
  { uri: '/current_worker',                 view: 'pages/change/current_worker',               yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/family_of_british_citizen',      view: 'pages/change/family_of_british_citizen',    yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/family_of_eea_national',         view: 'pages/change/family_of_eea_national',       yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/humanitarian_protection',        view: 'pages/change/humanitarian_protection',      yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/indefinite_leave_to_remain',     view: 'pages/change/indefinite_leave_to_remain',   yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/limited_leave_to_remain',        view: 'pages/change/limited_leave_to_remain',      yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/no_recourse_public_funds',       view: 'pages/change/no_recourse_public_funds',     yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/permanant_right_to_reside',      view: 'pages/change/permanant_right_to_reside',    yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/primary_carer_child_education',  view: 'pages/change/primary_carer_child_education',yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/refugee',                        view: 'pages/change/refugee',                      yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/retained_self_employed',         view: 'pages/change/retained_self_employed',       yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/retained_worker_pregnancy',      view: 'pages/change/retained_worker_pregnancy',    yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/retained_worker_seeking',        view: 'pages/change/retained_worker_seeking',      yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/retained_worker_sick',           view: 'pages/change/retained_worker_sick',         yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/self_employed',                  view: 'pages/change/self_employed',                yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/settlement',                     view: 'pages/change/settlement',                   yes: '/refer',           no: '/nochange',   dontknow:'/refer' },
  { uri: '/find_decision',                  view: 'pages/find_decision',                       yes: '/country',         no: '/refer',      dontknow:'/refer' },
  { uri: '/find_change',                    view: 'pages/find_change',                         yes: '/find_decision',   no: '/refer',      dontknow:'/refer' }
];

staticmap.forEach((route) => {   // this is for the static routes that dont need to handle POST requests
  router.route(route.uri).get((req, res) => {
    res.render(route.view);
  });
});

yesnomap.forEach((route) => {   // this is for the pages that have the yes/no thing
  router.route(route.uri).get((req, res) => {
    res.render(route.view);
  }).post((req, res) => {
    (route.hasOwnProperty(req.body.response)) ?       // if the response is in the route object (ie, user has responded 'yes' 'no' or 'dontknow'...
      res.redirect(route[req.body.response]) :        // ...redirect to whatever is in the route,
      res.render(route.view, { error: true });        // or if the response is NOT in the route, render the error thingy
  });
});

router.route('/country').get((req, res) => {
  res.render('pages/country', { countries: countries });
}).post((req, res) => {
  if(req.body.response.length === 0) {
    return res.render('pages/country', { countries: countries, error: true });
  }
  var iso = req.body.response.split(':')[1];
  if(cta.includes(iso)) {
    res.redirect('/nochange');
  } else if(eea.includes(iso)) {
    res.redirect('/eea');
  } else {
    res.redirect('/noneea');
  }
});

router.route('/eea').get((req, res) => {      // the typeaheads for the status is just for eea ATM - non eea is a load of links, with the regulations.
  res.render('pages/eea', { types: reside_types });
}).post((req, res) => {
  if(req.body.response.length === 0) {
    return res.render('pages/eea', { types: reside_types, error: true });   // TODO if enter something not on the list, refer???
  }
  res.redirect(`/${req.body.response}`);
});

module.exports = router;
