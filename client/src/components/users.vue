<template>
  <ul>
    <li
      v-for="user in users"
      :key="user.token"
      class="box__item"
      @click="selectUser(user)"
    >
      <h4>
        {{ user.email }}
      </h4>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      users: [
        {
          token: '11111',
          email: 'dummyuser1@asd.com',
        },
        {
          token: '22222',
          email: 'dummyuser2@asd.com',
        },
        {
          token: '33333',
          email: 'dummyuser3@asd.com',
        },
        {
          token: '44444',
          email: 'dummyuser4@asd.com',
        },
        {
          token: '55555',
          email: 'dummyuser5@asd.com',
        },
      ],
    };
  },
  methods: {
    selectUser(user) {
      this.$eventBus.$emit('user chosen', user);
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;

  li {
    &:hover {
      color: #000;
      background: #ffffffd2;
    }
  }
}
</style>
