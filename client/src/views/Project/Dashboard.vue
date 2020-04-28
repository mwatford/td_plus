<template>
  <div class="m-auto dashboard view row" v-if="project" ref="component">
    <ul
      class="col box list"
      v-for="(list, listIndex) in lists"
      :key="listIndex"
      ref="list"
    >
      <h3>
        {{ list.name }}
      </h3>
      <app-task
        v-for="(task, taskIndex) in list.data"
        :key="auth ? task._id + task.description : taskIndex"
        :task="task"
        :listIndex="listIndex"
        :taskIndex="taskIndex"
        :user="user._id"
      >
      </app-task>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import cloneDeep from '../../utils/cloneDeep';
import task from './task.vue';

export default {
  components: {
    'app-task': task,
  },
  computed: {
    ...mapState({
      project: state => state.activeProject.data,
      user: state => state.user,
      unfilteredLists: state => state.activeProject.data.lists,
      filter: state => state.activeProject.filter,
      auth: state => state.auth.status,
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
};
</script>

<style lang="scss" scoped>
.dashboard {
  flex-wrap: wrap;
}
.box {
  width: 240px;
  padding: 20px;
  margin-right: 3px;
  margin-bottom: 3px;
  min-height: 240px;

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
.list {
  height: min-content;
  max-height: 600px;
  overflow-y: auto;
  width: 280px;
}
</style>
