export default {
  methods: {
    navigate(value) {
      if (typeof value == 'string') {
        this.$router.push({ name: value })
      } else if (typeof value == 'number') {
        this.$router.go(value)
      } else {
        this.$router.push(value)
      }
    },
  },
}
