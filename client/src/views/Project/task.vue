<template>
  <div
    :class="[
      'task',
      { 'task--green': !task.member && this.auth },
      'box__item',
      'row',
    ]"
  >
    <button
      class="task__button task__button--left"
      v-if="displayButton"
      @click="move(listIndex, taskIndex, -1)"
    >
      <app-icon type="arrow-left" class="m-auto"></app-icon>
    </button>
    <div class="task__text" @click="descriptionOpen = true">
      <h4>{{ snippet(task.name, 16) }}</h4>
    </div>
    <button
      class="task__button task__button--right"
      @click="move(listIndex, taskIndex, 1)"
      v-if="displayButton"
    >
      <app-icon type="arrow-right" class="m-auto"></app-icon>
    </button>
    <form
      class="box box--inverted task__descriptionOpen"
      v-if="descriptionOpen"
    >
      <textarea v-model="description" class="input"> </textarea>
      <div class="row">
        <button
          class="button button--inverted m-auto"
          @click="updateDescription"
        >
          Update
        </button>
        <button
          class="button button--inverted m-auto"
          @click="descriptionOpen = false"
        >
          Close
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import snippet from '../../mixins/snippet';
import { mapState } from 'vuex';
import cloneDeep from '../../utils/cloneDeep';

export default {
  props: ['task', 'listIndex', 'taskIndex', 'user'],
  mixins: [snippet],
  data() {
    return {
      descriptionOpen: false,
      description: this.task.description,
    };
  },
  computed: {
    ...mapState({
      auth: state => state.auth.status,
      project: state => state.activeProject,
    }),
    displayButton() {
      if (!this.auth) return true;
      if (this.user === this.task.member) return true;
      return false;
    },
  },
  methods: {
    move(listIndex, taskIndex, value) {
      this.$store
        .dispatch('activeProject/moveTask', {
          listIndex,
          taskIndex,
          value,
        })
        .then(this.triggerUpdate);
    },
    updateDescription() {
      const changes = cloneDeep(this.task);

      changes.description = this.description;

      this.$store
        .dispatch('activeProject/updateTask', {
          listIndex: this.listIndex,
          taskIndex: this.taskIndex,
          changes,
        })
        .then(this.triggerUpdate);

      this.descriptionOpen = false;
    },
    triggerUpdate() {
      if (!this.auth) {
        return this.$store.dispatch(
          'activeProject/saveLocally',
          this.project.name
        );
      }
      this.$eventBus.$emit('project updated');
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
    align-items: center;
    padding: 0 5px;

    &:hover {
      background: #fff;
      color: #000;
    }
  }

  &__descriptionOpen {
    cursor: default;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;

    &::before {
      content: '';
      z-index: -1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      position: absolute;
      height: 100vh;
      width: 100vw;
      background: transparent;
    }
  }
}
.box {
  padding: 30px 50px;
  height: 500px;
  width: 420px;
}
textarea {
  border: 1px dashed #fff;
  border-bottom: 2px solid #fff;
  max-height: 100%;
  height: 100%;
  max-width: 100%;
  min-width: 100%;
}
</style>
