<template>
  <div class="m-auto" v-if="project" ref="component">
    <ul class="col" v-for="list in filteredLists" :key="list.name" ref="list">
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

<style></style>
