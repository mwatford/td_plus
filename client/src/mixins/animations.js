export const fadeOut = function (duration, delay, easing) {
  return (el, done) => {
    return this.$anime({
      targets: el,
      opacity: [1, 0],
      duration,
      delay: (el, index) => index * delay,
      easing,
    }).finished.then(done)
  }
}

export const fadeIn = function (duration, delay, easing) {
  return (el, done) => {
    return this.$anime({
      targets: el,
      opacity: [0, 1],
      duration,
      delay: (el, index) => index * delay,
      easing,
    }).finished.then(done)
  }
}

export const popUp = function (duration, delay, easing) {
  return (el, done) => {
    return this.$anime({
      targets: el,
      scale: [0, 1],
      duration,
      delay: (el, index) => index * delay,
      easing,
    }).finished.then(done)
  }
}

export const scaleDown = function (duration, delay, easing) {
  return (el, done) => {
    return this.$anime({
      targets: el,
      scale: [1, 0],
      duration,
      delay: (el, index) => index * delay,
      easing,
    }).finished.then(done)
  }
}

export default {
  methods: {
    fadeOut,
    fadeIn,
    popUp,
    scaleDown,
  },
}
