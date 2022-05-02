<template>
  <header>
    <HeaderButtons @newFile="file.text = $event" />
  </header>
  <TextArea :text="file.text" />
</template>

<script>
import TextArea from './components/TextArea.vue'
import HeaderButtons from './components/HeaderButtons.vue'

// import fs from 'fs'
// import pathModule from 'path'
// import { computed, ref } from 'vue'

export default {
  components: {
    TextArea,
    HeaderButtons
  },
  data() {
    return {
      file: {
        text: ""
      }
    }
 }
}
</script>

<style scoped>

</style>