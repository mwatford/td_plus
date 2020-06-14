<template>
  <ul v-chat-scroll="{ always: true }" class="box chat__messages">
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
import { mapState } from 'vuex';
import ChatMessage from './ChatMessage.vue';

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
      return this.members.find(el => el.id === value).name;
    },
  },
};
</script>

<style lang="scss" scoped></style>
