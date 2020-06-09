<template>
  <AppList :items="members" :limit="9" header="Members">
    <template v-slot="{ item }">
      <h3 class="text">{{ item.name }}</h3>
      <AppListItemAction
        title="remove member"
        slot="list-item-action"
      ></AppListItemAction>
    </template>
    <h3 slot="list-action" class="text text--center">
      <app-icon type="search" size="19"></app-icon>
    </h3>
  </AppList>
</template>

<script>
import { mapState } from 'vuex';
import AppList from '../../components/appList/AppList.vue';
import AppListItemAction from '../../components/appList/AppListItemAction.vue';

export default {
  components: {
    AppListItemAction,
    AppList,
  },
  computed: {
    ...mapState({ members: state => state.activeProject.data.members || [] }),
  },
};
</script>

<style></style>
