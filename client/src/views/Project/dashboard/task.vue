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
      class="task__button task__button--blue"
      v-if="displayButton"
      @click="move(-1)"
    >
      <app-icon type="arrow-left" class="m-auto"></app-icon>
    </button>
    <div
      class="task__text"
      @click="descriptionOpen = true"
      :title="this.task._id"
    >
      <h4>{{ snippet(task.name, 16) }}</h4>
    </div>
    <button
      class="task__button task__button--green"
      @click="move(1)"
      v-if="displayButton"
    >
      <app-icon type="arrow-right" class="m-auto"></app-icon>
    </button>
    <button
      class="task__button task__button--blue"
      v-if="auth && !task.member"
      @click="grabTask"
    >
      <app-icon type="hand" class="m-auto"></app-icon>
    </button>
    <form
      class="box box--inverted task__description"
      v-if="descriptionOpen"
      @submit.prevent
    >
      <h4>{{ snippet(task.name, 16) }}</h4>
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
import snippet from 'Mixins/snippet'
import { mapState, mapMutations } from 'vuex'
import { manageProject } from 'Services/LocalDbManager'

export default {
  props: ['task', 'listIndex', 'taskIndex', 'user'],
  mixins: [snippet],
  data() {
    return {
      descriptionOpen: false,
      description: this.task.description,
    }
  },
  computed: {
    ...mapState({
      auth: state => state.auth.status,
      project: state => state.activeProject.data,
    }),
    displayButton() {
      return !this.auth || this.user === this.task.member || false
      if (!this.auth) return true
      if (this.user === this.task.member) return true
      return false
    },
  },
  methods: {
    ...mapMutations({ update: 'activeProject/UPDATE' }),
    move(val) {
      this.update({
        fn: this.project.moveTask,
        data: {
          id: this.task._id,
          from: this.listIndex,
          to: this.listIndex + val,
          timestamp: this.task.timestamp,
        },
      })

      this.triggerUpdate()
    },
    updateDescription() {
      this.update({
        fn: this.project.updateTask,
        data: {
          id: this.task._id,
          listIndex: this.listIndex,
          changes: { description: this.description },
        },
      })

      this.triggerUpdate()
    },
    grabTask() {
      this.update({
        fn: this.project.updateTask,
        data: {
          id: this.task._id,
          listIndex: this.listIndex,
          changes: { member: this.user },
        },
      })

      this.triggerUpdate()
    },
    async triggerUpdate() {
      if (!this.auth) {
        return await manageProject('add', this.project)
      }

      this.$eventBus.$emit('project-updated')
    },
  },
}
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

    &--blue {
      &:hover {
        background: #2c76ff;
      }
    }
    &--green {
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

  &__description {
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
