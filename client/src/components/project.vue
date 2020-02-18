<template>
  <div class="project">
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
      if (text.length > 16) {
        text = text.slice(0, 15) + "...";
      }
      return text;
    }
  }
};
</script>

<style lang="scss" scoped>
.project {
  cursor: pointer;
  background: #ffffff;
  width: 250px;
  height: 250px;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 2px solid #888888;
  box-shadow: 0 0 15px 2px #0000006e;
  display: flex;
  flex-direction: column;

  &:hover {
    border: 2px solid #71c441;
    box-shadow: 0 0 15px 4px #000000b0;
  }

  &__name {
    display: flex;
    margin: 10px auto;
    width: 80%;
    padding-bottom: 5px;
    border-bottom: 1px solid #cccccc;
    color: #000;
  }
}
</style>
