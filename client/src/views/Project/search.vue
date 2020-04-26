<template>
  <div class="modal col">
    <ul
      class="col box box--inverted suggestions"
      v-if="suggestions.length"
      ref="suggestions"
    >
      <h3>Invite</h3>
      <li
        v-for="suggestion in suggestions"
        :key="suggestion._id"
        @click="addUser(suggestion)"
        class="box__item col"
        title="Invite"
      >
        <h4>{{ suggestion.name }}</h4>
        <h5>
          {{ suggestion.email }}
        </h5>
      </li>
    </ul>
    <div class="box box--inverted">
      <input
        type="text"
        class="input"
        name="invite"
        v-model="search"
        data-search
        placeholder="invite people"
      />
      <button class="button button--inverted" @click="close">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import cloneDeep from '../../utils/cloneDeep';

export default {
  data() {
    return {
      search: '',
      responseList: [],
    };
  },
  computed: {
    ...mapState({
      memberList: state => state.activeProject.data.members,
      token: state => state.auth.token,
      user: state => state.user,
    }),
    suggestions() {
      const suggestions = cloneDeep(this.responseList);

      this.memberList.forEach(el => {
        const element = suggestions.find(elem => elem._id === el.id);
        const index = suggestions.indexOf(element);
        delete suggestions[index];
      });

      return suggestions.filter(el => el !== null);
    },
  },
  methods: {
    close() {
      this.$eventBus.$emit('close modal');
    },
    addUser(user) {
      this.$eventBus.$emit('add user', user);
    },
    fetchUsers(search) {
      this.$http({
        method: 'get',
        url: `/api/users/search/${search}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }).then(({ data }) => {
        this.responseList = data;
      });
    },
  },
  watch: {
    search(n) {
      if (n.length > 3) {
        this.fetchUsers(n);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;

  &::before {
    content: '';
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    position: absolute;
    height: 100vh;
    width: 100vw;
    background: transparent;
  }
}
.box {
  margin: 10px 0;
  height: 200px;
  width: 380px;
  box-shadow: 0 0 15px 3px #00000062;
  padding: 50px;
}
</style>
