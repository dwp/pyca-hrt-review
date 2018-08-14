const gulp = require(`gulp`),
  fs = require(`fs`),
  path = require(`path`);

const options = {
  country: {
    src: path.join(__dirname, `../node_modules/openregister-location-picker/dist/location-picker-canonical-list.json`),
    dest: path.join(__dirname, `../app/countries/`)
  },
  residence: {
    src: path.join(__dirname, `../app/assets/residence/right-to-reside-canonical-list.json`),
    dest: path.join(__dirname, `../app/residence/`)
  }
};

Object.keys(options).forEach((key) => {
  gulp.task(`copy-data:${key}`, () => {
    gulp.src(options[key].src)    // TODO have to fetch the list form somewhere at some point i guess????
      .pipe(gulp.dest(options[key].dest));
  });
});

gulp.task(`copy-data`, Object.keys(options).map(key => `copy-data:${key}`));
