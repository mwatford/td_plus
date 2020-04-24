<template>
  <div class="m-auto dashboard view row" v-if="project" ref="component">
    <ul class="col box" v-for="list in lists" :key="list.name" ref="list">
      <h3>
        {{ list.name }}
      </h3>
      <li v-for="task in list.data" :key="task._id">
        {{ task.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import cloneDeep from '../../utils/cloneDeep';

export default {
  computed: {
    ...mapState({
      project: state => state.activeProject.data,
      user: state => state.user,
      unfilteredLists: state => state.activeProject.data.lists,
      filter: state => state.activeProject.filter,
    }),
    filteredLists() {
      return cloneDeep(this.project.lists).map(list => {
        list.data = list.data.filter(task => task.member === this.user._id);
        return list;
      });
    },
    lists() {
      return this.filter ? this.filteredLists : this.unfilteredLists;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.dashboard {
  flex-wrap: wrap;
}
.box {
  width: 240px;
  padding: 20px;
  margin-right: 4px;
  margin-bottom: 4px;
  min-width: 240px;

  &:last-child {
    margin-right: 0;
  }

  h3 {
    border-bottom: 1px solid #fff;
    padding-bottom: 2px;
    margin-bottom: 3px;
  }
}
ul {
  list-style-type: none;
}
</style>
