<template>
  <AppList :items="lists" :limit="9" header="Lists">
    <template v-slot="{ item }">
      <h3 slot="list-item-text" class="text">{{ item.name }}</h3>
      <AppListItemAction
        title="delete list"
        slot="list-item-action"
      ></AppListItemAction>
    </template>
    <h3 slot="list-action" class="text text--center" @click="addList">
      <app-icon type="plus" class="m-auto" size="19"></app-icon>
    </h3>
  </AppList>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import AppList from '../../components/appList/AppList.vue';
import AppListItemAction from '../../components/appList/AppListItemAction.vue';

export default {
  components: {
    AppListItemAction,
    AppList,
  },
  computed: {
    ...mapState({ project: state => state.activeProject.data }),
    lists() {
      return this.project.lists || [];
    },
  },
  methods: {
    ...mapMutations({ update: 'activeProject/UPDATE' }),
    addList() {
      debugger;

      let name = prompt('Name:');

      if (name) {
        this.update({ fn: this.project.addList, data: { name: name } });
        //save
      }
    },
  },
};
</script>

<style></style>
