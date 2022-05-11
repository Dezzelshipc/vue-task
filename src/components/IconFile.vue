<template>
  <svg class="bi" :width="fontsize" :height="fontsize" fill="currentColor">
    <use xlink:href="../assets/bootstrap-icons.svg#file-earmark"/>
  </svg>
</template>

<script>
export default {
  props: {
    fontsize: {
      type: Number,
      default: () => 24,
    }
  }
}
</script>