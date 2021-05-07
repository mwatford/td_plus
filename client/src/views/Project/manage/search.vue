<template>
  <div class="modal col">
    <!-- <ul
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
    </ul> -->
    <div class="box box--inverted col suggestions">
      <AppList header="Invite" :items="suggestions" v-slot="{ item }">
        <h3 class="text" @click="addUser(item)">{{ item.email }}</h3>
      </AppList>
    </div>
    <div class="box box--inverted">
      <input
        type="text"
        class="input"
        name="invite"
        @input="onInput"
        v-model="search"
        data-search
        placeholder="invite people"
        ref="input"
      />
      <button class="button button--inverted" @click="close">Cancel</button>
    </div>
  </div>
</template>

<script>
import AppList from 'Components/appList/AppList.vue'
import { mapState } from 'vuex'
import cloneDeep from 'Utils/cloneDeep'
import http from 'Services/api/index'
import _ from 'lodash'

export default {
  components: {
    AppList,
  },
  data() {
    return {
      search: '',
      responseList: [],
    }
  },
  computed: {
    ...mapState({
      project: state => state.activeProject.data,
      token: state => state.auth.token,
      user: state => state.user,
    }),
    memberList() {
      return this.project.members
    },
    suggestions() {
      let suggestions = this.responseList

      this.memberList.forEach(el => {
        let element = suggestions.find(elem => elem._id === el.id)
        let index = suggestions.indexOf(element)

        if (index > -1) suggestions.splice(index, 1)
      })

      return suggestions
    },
  },
  mounted() {
    this.$refs['input'].focus()
  },
  methods: {
    close() {
      this.$eventBus.$emit('close-search')
    },
    onInput: _.debounce(function () {
      if (this.search.trim().length) this.fetchUsers()
    }, 800),
    async addUser(user) {
      try {
        await http.projects.addUser(this.token, {
          id: this.project._id,
          userId: user._id,
        })

        await this.$store.dispatch('activeProject/fetchProject', {
          token: this.token,
          id: this.project._id,
        })
      } catch (e) {
        this.alert('error', e || 'Error adding the user')
      }
    },
    async fetchUsers() {
      try {
        const { data } = await http.users.searchByEmail(this.token, this.search)
        this.responseList = data
      } catch (e) {
        this.alert('error', 'Connection error')
      }
    },
  },
}
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

  input {
    outline: none;
  }

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
  justify-content: center;
  align-items: center;
}
.suggestions {
  height: auto;
  max-height: 400px;
  overflow-y: auto;
}
</style>
