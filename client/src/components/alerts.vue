<template>
  <div class="alerts">
    <div
      v-for="(alert, index) in alerts"
      :key="index"
      :class="['alert', `alert--${alert.type}`]"
    >
      <p>
        {{ alert.message }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      alerts: state => state.alerts.content
    })
  }
};
</script>

<style lang="scss" scoped>
.alerts {
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 20px;
  right: 20px;
}
.alert {
  height: 120px;
  width: 220px;
  margin-top: 20px;
  background: #000000a2;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  padding: 0 10px;

  p {
    text-align: center;
  }

  &--error {
    background: #ff00008a;
  }
  &--success {
    background: #0080008a;
  }
  &--warning {
    background: #ffa6008a;
  }
  &--info {
    background: #35aeffa2;
  }
}
</style>
