export default {
  methods: {
    snippet(text, length) {
      if (text.length > length) {
        text = text.slice(0, length) + '...'
      }
      return text
    },
  },
}
