<template>
  <div class="box chat">
    <ul v-chat-scroll="{ always: true }" class="chat__messages">
      <li
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'message col',
          { 'message--right': message.user === user._id },
        ]"
      >
        <h4>{{ username(message.user) || message.user }}</h4>
        <p>{{ message.text }}</p>
      </li>
    </ul>
    <form class="row" @submit.prevent="sendMessage">
      <input type="textarea" class="input" v-model="input" ref="message" />
      <div class="emojiPicker" @click="expandEmojiPicker = !expandEmojiPicker">
        <div>
          &#x1F604;
        </div>
        <ul class="emojiList" v-if="expandEmojiPicker">
          <li
            class="emojiList__element"
            v-for="el in emojis"
            :key="el"
            @click="addEmoji(el)"
          >
            {{ String.fromCodePoint(el) }}
          </li>
        </ul>
      </div>
      <button type="submit" class="button">
        <app-icon type="send"></app-icon>
      </button>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import emojis from '../../modules/emojis';

export default {
  data() {
    return {
      input: '',
      messages: [],
      emojis,
      expandEmojiPicker: false,
    };
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
    sendMessage() {
      this.$socket.emit('sendMessage', this.input);
      this.input = '';
    },
    loadMessages() {
      this.$socket.on('message', data => {
        if (Array.isArray(data)) {
          this.messages.push(...data);
        } else {
          this.messages.push(data);
        }
      });
      this.$socket.emit('load messages');
    },
    addEmoji(el) {
      this.input = this.input + String.fromCodePoint(el);
      this.$refs['message'].focus();
    },
  },
  mounted() {
    this.loadMessages();
  },
};
</script>

<style lang="scss" scoped>
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

  form {
    margin: 0 10px;
    padding-top: 10px;
    border-top: 1px solid #fff;

    .input {
      width: 70%;
    }
    .button {
      margin: 0 5px 0 auto;

      &:hover svg {
        fill: #000;
      }
    }
  }

  &__messages {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 10px;
    padding-bottom: 0;
    list-style-type: none;
  }
}
.message {
  word-wrap: break-word;
  width: 70%;
  font-size: 16px;
  background: #ffffffd2;
  border-radius: 12px;
  padding: 5px 15px;
  color: #000;
  margin-bottom: 5px;

  h4 {
    font-size: 12px;
    font-style: italic;
  }

  p {
    width: 100%;
    text-align: left;
  }

  &--right {
    align-items: flex-end;
    margin-left: auto;

    p {
      text-align: right;
    }
  }
}
.emojiPicker {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 30px;
  width: 30px;
  margin: auto;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    background: #0000008e;
  }
}
.emojiList {
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  bottom: 50%;
  right: 50%;
  display: flex;
  flex-wrap: wrap;
  width: 250px;
  background: #fff;
  list-style-type: none;
  padding: 5px;
  border-radius: 4px;

  &__element {
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #c0c0c0;
    }
  }
}
</style>
