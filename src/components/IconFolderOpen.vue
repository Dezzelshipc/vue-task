<template>
  <i class="bi bi-folder-symlink" :style="'font-size:'+fontsize+'px'"></i>
</template>

<script>
export default {
  props: {
    fontsize: {
      type: Number,
      default: () => 24,
    }
  },
}
</script>