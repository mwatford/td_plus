export default {
  methods: {
    alert(type, message) {
      this.$store.dispatch('alerts/display', {
        message,
        type,
      })
    },
  },
}
