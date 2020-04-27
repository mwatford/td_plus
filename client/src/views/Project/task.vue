<template>
  <div :class="['task', { 'task--green': !task.member }, 'box__item', 'row']">
    <button class="task__button task__button--left" v-if="displayButton">
      <app-icon type="arrow-left" class="m-auto"></app-icon>
    </button>
    <div class="task__text" @click="description = true">
      <h4 class="m-auto">{{ snippet(task.name, 16) }}</h4>
    </div>
    <button
      class="task__button task__button--right"
      @click="complete(listIndex, taskIndex)"
      v-if="displayButton"
    >
      <app-icon type="arrow-right" class="m-auto"></app-icon>
    </button>
  </div>
</template>

<script>
import snippet from '../../mixins/snippet';
import { mapState } from 'vuex';

export default {
  props: ['task', 'listIndex', 'taskIndex', 'user'],
  mixins: [snippet],
  data() {
    return {
      description: false,
    };
  },
  computed: {
    ...mapState({
      auth: state => state.auth.status,
    }),
    displayButton() {
      if (!this.auth) return true;
      if (this.user === this.task.member) return true;
      return false;
    },
  },
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

<style lang="scss" scoped>
.task {
  justify-content: space-between;
  align-items: center;
  height: 35px;
  padding: 0;
  overflow: hidden;

  &--green {
    background: #5dd964;
  }

  &__button {
    height: 35px;
    min-width: 35px;
    cursor: pointer;
    background: transparent;
    border: none;
    display: flex;
    outline: none;

    &--left {
      &:hover {
        background: #2c76ff;
      }
    }
    &--right {
      &:hover {
        background: #5dd964;
      }
    }
  }

  &__text {
    height: 100%;
    width: 100%;
    display: flex;

    &:hover {
      background: #fff;
      color: #000;
    }
  }
}
</style>
