<template>
  <div class="chat col">
    <ChatDisplay :messages="messages"></ChatDisplay>
    <ChatInput></ChatInput>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChatDisplay from './ChatDisplay.vue'
import ChatInput from './ChatInput.vue'

export default {
  components: {
    ChatDisplay,
    ChatInput,
  },
  data() {
    return {
      messages: [],
    }
  },
  methods: {
    loadMessages() {
      this.$socket.on('message', data => {
        if (Array.isArray(data)) {
          this.messages.push(...data)
        } else {
          this.messages.push(data)
        }
      })
      this.$socket.emit('load-messages')
    },
  },
  mounted() {
    this.loadMessages()
  },
}
</script>

<style lang="scss" scoped>
.box {
  border: 1px solid #000;
}

.chat {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  height: 500px;
  margin-right: 3px;
}
</style>
