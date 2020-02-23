<template>
  <div class="box project">
    <h3 class="project__name">
      {{ snippet(project.name, 16) || "not set" }}
    </h3>
  </div>
</template>

<script>
import snippet from "../mixins/snippet";
export default {
  mixins: [snippet],
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.box {
  cursor: pointer;
  width: 250px;
  height: 250px;
  flex-direction: column;
  padding: 0;
  padding-top: 10px;
  justify-content: flex-start;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #000;
  }
}

.project {
  &__name {
    display: flex;
    margin: 10px auto;
    width: 80%;
    padding-bottom: 5px;
    border-bottom: 1px solid #cccccc;
  }
}
</style>
