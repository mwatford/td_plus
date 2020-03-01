<template>
  <div class="m-auto">
    <ul class="col">
      <li>
        dashboard
      </li>
      <li v-for="task in project.toDo" :key="task._id"></li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      project: state => state.activeProject
    })
  },
  methods: {}
};
</script>

<style></style>
