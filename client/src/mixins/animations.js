export const fadeOut = function(duration, delay, easing) {
  if (this.$store.state.app.animations) {
    return (el, done) => {
      return this.$anime({
        targets: el,
        opacity: [1, 0],
        duration,
        delay: (el, index) => index * delay,
        easing
      }).finished.then(done);
    };
  }
  return Promise.resolve();
};

export const fadeIn = function(duration, delay, easing) {
  if (this.$store.state.app.animations) {
    return (el, done) => {
      return this.$anime({
        targets: el,
        opacity: [0, 1],
        duration,
        delay: (el, index) => index * delay,
        easing
      }).finished.then(done);
    };
  }
  return Promise.resolve();
};

export const popUp = function(duration, delay, easing) {
  if (this.$store.state.app.animations) {
    return (el, done) => {
      return this.$anime({
        targets: el,
        scale: [0, 1],
        duration,
        delay: (el, index) => index * delay,
        easing
      }).finished.then(done);
    };
  }
  return Promise.resolve();
};

export const scaleDown = function(duration, delay, easing) {
  if (this.$store.state.app.animations) {
    return (el, done) => {
      return this.$anime({
        targets: el,
        scale: [1, 0],
        duration,
        delay: (el, index) => index * delay,
        easing
      }).finished.then(done);
    };
  }
  return Promise.resolve();
};

export default {
  methods: {
    fadeOut,
    fadeIn,
    popUp,
    scaleDown
  }
};
