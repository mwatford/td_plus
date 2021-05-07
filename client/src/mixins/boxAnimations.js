function stagger(staggerVal, delay) {
  if (staggerVal) {
    return (el, index) => index * delay
  }
  return delay
}

export default {
  methods: {
    boxEnterAnimation(duration, delay = 100, staggerVal) {
      if (this.$store.state.app.animations) {
        this.$anime.remove('.box')
        return this.$anime({
          targets: '.box',
          duration,
          delay: stagger(staggerVal, delay),
          easing: 'easeOutBack',
          scale: [0, 1],
        })
      }
      return Promise.resolve()
    },
    boxExitAnimation(duration, delay = 100, staggerVal) {
      if (this.$store.state.app.animations) {
        return this.$anime({
          targets: '.box',
          duration,
          delay: stagger(staggerVal, delay),
          scale: [1, 0],
          easing: 'easeInBack',
        }).finished
      }
      return Promise.resolve()
    },
  },
}
