<template>
  <form class="box row" @submit.prevent="sendMessage">
    <input type="textarea" class="input" v-model="input" ref="message" />
    <EmojiPicker @chosen="addEmoji"></EmojiPicker>
    <button type="submit" class="button">
      <app-icon type="send" color="inherit"></app-icon>
    </button>
  </form>
</template>

<script>
import EmojiPicker from './EmojiPicker.vue'

export default {
  components: { EmojiPicker },
  data: () => ({
    input: '',
  }),
  methods: {
    sendMessage() {
      if (this.input.trim().length) {
        this.$socket.emit('send-message', this.input)
      }
      this.input = ''
    },
    addEmoji(el) {
      this.input += String.fromCodePoint(el)
      this.$refs['message'].focus()
    },
  },
}
</script>

<style lang="scss" scoped>
form.box {
  margin: 3px 0 0 0;
  width: 100%;
  height: auto;
  padding: 10px;
  align-items: flex-end;

  .input {
    width: 70%;
    margin: 0;
  }
  .button {
    margin: 0 5px 0 auto;
  }
}
</style>
