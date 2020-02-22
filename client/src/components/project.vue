<template>
  <div class="box project">
    <h3 class="project__name">
      {{ snippet(project.name) || "not set" }}
    </h3>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      required: true,
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    snippet(text) {
      if (text.length > 17) {
        text = text.slice(0, 16) + "...";
      }
      return text;
    }
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
