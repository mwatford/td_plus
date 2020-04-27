<template>
  <div class="task box__item row">
    <button class="task__button task__button--left">
      <app-icon type="arrow-left" class="m-auto"></app-icon>
    </button>
    <h4>{{ snippet(task.name, 16) }}</h4>
    <button
      class="task__button task__button--right"
      @click="complete(listIndex, taskIndex)"
    >
      <app-icon type="arrow-right" class="m-auto"></app-icon>
    </button>
  </div>
</template>

<script>
import snippet from '../../mixins/snippet';

export default {
  props: ['task', 'listIndex', 'taskIndex'],
  mixins: [snippet],
  methods: {
    complete(listIndex, taskIndex) {
      this.$store.commit('activeProject/COMPLETE_TASK', {
        listIndex,
        taskIndex,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
