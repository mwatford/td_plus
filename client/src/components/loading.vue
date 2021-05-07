<template>
  <div class="m-auto">
    <div :class="['loading', pulse]">
      <div :class="['circle', rotate]" :style="style">
        <p v-if="state === 'failed'" class="scale">
          <app-icon type="reload" size="22"></app-icon>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  computed: {
    style() {
      const { size } = this
      return {
        width: `${size}px`,
        height: `${size}px`,
        borderColor: this.color,
      }
    },
    display() {
      return this.state !== 'start'
    },
    rotate() {
      if (this.state === 'failed') {
        return 'shake'
      }
      return 'rotate'
    },
    pulse() {
      if (this.state === 'loading') {
        return 'pulse'
      }
      return ''
    },
    color() {
      switch (this.state) {
        case 'failed':
          return 'red'
        case 'success':
          return 'green'
        case 'done':
          return 'green'
        default:
          return '#fff'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.circle {
  border-radius: 50%;
  border-top: 3px solid;
  border-bottom: 3px solid;
  transition: border-color 0.5s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scale {
  animation: scaleUp 0.3s linear;
}
.rotate {
  animation: rotate 0.5s infinite linear;
}
.done {
  animation: scaleDown 0.3s linear forwards;
}
.pulse {
  animation: pulsate 0.5s infinite linear;
}
.shake {
  animation: shake 0.5s linear;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes pulsate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes scaleUp {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes scaleDown {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  12% {
    transform: translateX(-20%);
  }
  37% {
    transform: translateX(20%);
  }
  62% {
    transform: translateX(-20%);
  }
  87% {
    transform: translateX(20%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
