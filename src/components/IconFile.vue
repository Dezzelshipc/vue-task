<template>
  <i class="bi bi-file-earmark" :class="extType" :style="'font-size:'+fontsize+'px'" ></i>
</template>

<script>
export default {
  props: {
    extension: String,
    fontsize: {
      type: Number,
      default: () => 24,
    }
  },
  computed: {
    extType() {
      return `bi-filetype-${this.extension.substr(1)}`
    }
  }
}
</script>