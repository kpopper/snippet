Modernizr.load([
  {
    load: "//code.jquery.com/jquery.js"
  },
  {
    test: Modernizr.getusermedia,
    yep : 'js/audio.js',
    nope: ''
  }
]);