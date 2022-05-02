<template>
  <div class="w-100 h-75 text-center p-3 position-relative">
    <div class="w-100 h-100 border text-start p-1 border-secondary overflow-auto"
      contenteditable="true"
      v-text="text"
      style="white-space: pre"
      >
    </div>
  </div>
</template>

<script>
// import fs from 'fs'
// import pathModule from 'path'
// import { computed, ref } from 'vue'

export default {
  props: {
    text: String
  }
}
</script>