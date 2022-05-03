<template>
  <i class="bi bi-file-earmark" :class="extType" style="font-size:24px" ></i>
</template>

<script>
export default {
  props: {
    extension: String
  },
  computed: {
    extType() {
      return `bi-filetype-${this.extension.substr(1)}`
    }
  }
}
</script>