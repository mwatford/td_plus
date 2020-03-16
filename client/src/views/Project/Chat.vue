<template>
  <div class="box chat">
    <ul v-chat-scroll="{ always: true }" class="chat__messages">
      <li
        v-for="(message, index) in messages"
        :key="index"
        :class="['message col', { 'message--right': message.user === user._id }]"
      >
        <h4>{{ message.user }}</h4>
        <p>{{ message.text }}</p>
      </li>
    </ul>
    <form class="row" @submit.prevent="sendMessage">
      <input type="textarea" class="input" name="" id="" v-model="input" />
      <button type="submit" class="button">send</button>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      input: "",
      messages: []
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    sendMessage() {
      this.$socket.emit("sendMessage", this.input);
      this.input = "";
    },
    loadMessages() {
      this.$socket.on("message", data => {
        if (Array.isArray(data)) {
          this.messages.push(...data);
        } else {
          this.messages.push(data);
        }
      });
      this.$socket.emit("load messages");
    }
  },
  mounted() {
    this.loadMessages();
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.box {
  margin: 0;
  padding: 0;
}
.chat {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  height: 500px;
  overflow: hidden;

  form {
    margin: 0 10px;
    padding-top: 10px;
    border-top: 1px solid #fff;
    .input {
      width: 100%;
    }
    .button {
      margin-left: 5px;
    }
  }

  &__messages {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    padding-bottom: 0;
    list-style-type: none;
  }
}
.message {
  word-wrap: break-word;
  width: 70%;
  align-items: flex-end;

  &--right {
    margin-left: auto;
  }
}
</style>
