<template>
  <AppList :items="members" :limit="9" header="Members">
    <template v-slot="{ item }">
      <h3 class="text">{{ item.name }}</h3>
      <AppListItemAction
        title="remove member"
        slot="list-item-action"
        @click.native="removeUser(item)"
        v-if="item.id !== project.admin"
      ></AppListItemAction>
    </template>
    <h3 slot="list-action" class="text text--center" @click="openSearch">
      <app-icon type="search" size="19"></app-icon>
    </h3>
  </AppList>
</template>

<script>
import { mapState } from 'vuex'
import AppList from 'Components/appList/AppList.vue'
import AppListItemAction from 'Components/appList/AppListItemAction.vue'
import http from 'Services/api/index'

export default {
  components: {
    AppListItemAction,
    AppList,
  },
  data: () => ({
    searchOpen: false,
  }),
  computed: {
    ...mapState({
      members: state => state.activeProject.data.members || [],
      project: state => state.activeProject.data,
      token: state => state.auth.token,
    }),
  },
  methods: {
    openSearch() {
      this.$eventBus.$emit('open-search')
    },
    async removeUser(user, index) {
      try {
        await http.projects.removeUser(this.token, {
          id: this.project._id,
          userId: user.id,
        })

        await this.$store.dispatch('activeProject/fetchProject', {
          token: this.token,
          id: this.project._id,
        })

        this.$socket.emit('user-removed', user.id)

        this.alert('success', 'User has been removed')
      } catch (e) {
        this.alert('error', e || 'User has not been removed')
      }
    },
    updateUser({ projects, _id }, action) {
      if (action === 'add') {
        projects.push(this.project._id)
      }

      return this.$this.http({
        method: 'put',
        url: `/api/users/${_id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        data: {
          changes: { projects },
        },
      })
    },
  },
}
</script>

<style></style>
