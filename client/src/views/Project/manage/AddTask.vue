<template>
  <form @submit.prevent class="box col">
    <h3>Add task</h3>
    <input
      type="text"
      class="input"
      placeholder="name"
      v-model="task.name"
      required
    />
    <textarea
      class="input"
      placeholder="description"
      v-model="task.description"
    />
    <div class="col" v-if="auth">
      <label> Select member </label>
      <BaseSelect
        :options="members"
        :selected="task.member"
        @change="onChange"
      ></BaseSelect>
    </div>
    <button class="button" @click="addTask">
      <app-icon class="m-auto" type="plus" size="19" color="inherit"></app-icon>
    </button>
  </form>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      task: this.createEmptyTask(),
    };
  },
  computed: {
    ...mapState({
      members: state =>
        state.activeProject.data.members.map(el => ({
          text: el.name,
          value: el.id,
        })),
      auth: state => state.auth.status,
    }),
  },
  methods: {
    onChange() {

    },
    addTask() {
      this.$store.commit('activeProject/ADD_TASK', this.task);

      this.$eventBus.$emit('save-project');

      this.task = this.createEmptyTask();
    },
    createEmptyTask() {
      return {
        name: '',
        description: '',
        member: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  margin-right: 3px;

  input {
    outline: none;
  }
}
form {
  height: 457px;
  max-height: 100%;
  justify-content: flex-start;

  .button {
    margin: 20px 0 0 0;
  }
}
label {
  margin: 5px 0;
}
.button {
  margin: 0 0 0 auto;
}
textarea {
  max-width: 100%;
  min-width: 100%;
  max-height: 100%;
  height: 100%;
  border: 1px dashed #fff;
  border-bottom: 2px solid #fff;
}
</style>
