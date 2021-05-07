<template>
  <AppList :items="lists" :limit="9" header="Lists">
    <template v-slot="{ item, index }">
      <h3 slot="list-item-text" class="text" @click="editListName(index)">
        {{ item.name }}
      </h3>
      <AppListItemAction
        title="delete list"
        slot="list-item-action"
        @click.native="deleteList(index, item.name)"
      ></AppListItemAction>
    </template>
    <h3 slot="list-action" class="text text--center" @click="addList">
      <app-icon type="plus" class="m-auto" size="19"></app-icon>
    </h3>
  </AppList>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import AppList from 'Components/appList/AppList.vue'
import AppListItemAction from 'Components/appList/AppListItemAction.vue'
import saveProject from 'Mixins/saveProject'

export default {
  mixins: [saveProject],
  components: {
    AppListItemAction,
    AppList,
  },
  computed: {
    ...mapState({ project: state => state.activeProject.data }),
    lists() {
      return this.project.lists || []
    },
  },
  methods: {
    ...mapMutations({ update: 'activeProject/UPDATE' }),
    addList() {
      let name = prompt('Name:')

      if (name) {
        this.update({ fn: this.project.addList, data: { name } })
        this.save()
      }
    },
    editListName(index) {
      try {
        if (typeof index !== 'number') return

        let name = prompt('Change name:').trim()

        if (!name) {
          return this.alert('error', 'Name can not be empty')
        }

        this.update({
          fn: this.project.editListName,
          data: { index, name },
        })

        this.save()
      } catch (error) {}
    },
    deleteList(index, name) {
      if (typeof index !== 'number') return

      let userResponse = confirm(`Are you sure you want to delete ${name}`)

      if (userResponse) {
        this.update({ fn: this.project.deleteList, data: { index } })
        this.save()
      }
    },
  },
}
</script>

<style></style>
