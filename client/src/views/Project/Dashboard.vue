<template>
  <div class="m-auto dashboard view row" v-if="project" ref="component">
    <ul
      class="col box"
      v-for="list in filteredLists"
      :key="list.name"
      ref="list"
    >
      <h3>
        {{ list.name }}
      </h3>
      <li v-for="task in list.data" :key="task._id">{{ task.name }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      project: state => state.activeProject,
      user: state => state.user
    }),
    filteredLists() {
      return this.project.lists.map(el => {
        el.data = el.data.filter(task => task.member === this.user._id);
        return el;
      });
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.dashboard {
}
.box {
  width: 200px;
  padding: 20px;
  margin-right: 4px;

  h3 {
    border-bottom: 1px solid #fff;
    padding-bottom: 2px;
  }
}
</style>
