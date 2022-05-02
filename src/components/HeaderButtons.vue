<template>
<div class="content p-1">
  <label class="btn btn-primary" for="inp1">Открыть файл</label>
  <input type="file" class="invisible" id="inp1" @change="newFile()" accept=".txt"/>
</div>
</template>

<script>
const $ = window.$ = require("jquery");

// import fs from 'fs'
// import pathModule from 'path'
// import { computed, ref } from 'vue'

export default {
  methods: {
    newFile() {
      let file = $('#inp1')[0].files[0]
      if (!file) return
      let reader = new FileReader()
      reader.onload = (e) => {
        let text = e.target.result
        this.$emit('newFile', text)
      }
      reader.readAsText(file)
    }
  }
}
</script>