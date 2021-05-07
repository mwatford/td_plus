<template>
  <ul v-chat-scroll="{ always: true }" class="box display">
    <ChatMessage
      v-for="(message, index) in messages"
      :key="index"
      :author="username(message.user)"
      :text="message.text"
      :isUser="message.user === user._id"
    ></ChatMessage>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
import ChatMessage from './ChatMessage.vue'

export default {
  components: { ChatMessage },
  props: {
    messages: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  computed: {
    ...mapState({
      user: state => state.user,
      members: state => state.activeProject.data.members,
    }),
  },
  methods: {
    username(value) {
      return this.members.find(el => el.id === value).name
    },
  },
}
</script>

<style lang="scss" scoped>
.display {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px;
  padding-bottom: 0;
  list-style-type: none;
}
</style>
