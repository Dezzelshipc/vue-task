<template>
  <div class="mt-2 row">
    <div class="d-inline-flex">
      <button
        type="button"
        class="clickable btn btn-outline-secondary m-1 ms-0 mt-0 col-md-auto"
        @click="typingName = !typingName"
      >
        <svg class="bi" width="24" height="24" fill="currentColor">
          <use xlink:href="../assets/bootstrap-icons.svg#folder-plus"/>
        </svg>
        <span v-if="!typingName" class="ms-1 mt-0">Create Folder</span>
        <span v-else class="ms-1">Close Input</span>
      </button>

      <input
        type="text"
        class="form-control m-1 mt-0 col-md-auto"
        v-if="typingName"
        style="width: 200px"
        @keypress.enter="createDir"
        v-model="folderName"
      />

      <button
        type="button"
        class="clickable btn btn-outline-secondary m-1 ms-0 mt-0 col-md-auto"
        @click="typingDelete = !typingDelete"
      >
        <svg class="bi" width="24" height="24" fill="currentColor">
          <use xlink:href="../assets/bootstrap-icons.svg#folder-x"/>
        </svg>
        <span v-if="!typingDelete" class="ms-1 mt-0">Delete Folder</span>
        <span v-else class="ms-1">Close Input</span>
      </button>

      <input
        type="text"
        class="form-control m-1 mt-0 col-md-auto"
        v-if="typingDelete"
        style="width: 200px"
        @keypress.enter="deleteDir"
        v-model="deleteFolder"
      />
    </div>
  </div>
  <div class="row">
    <div class="d-inline-flex">
      <button
        type="button" 
        class="clickable btn btn-outline-secondary m-1 ms-0 mt-0 col-md-auto"
        @click="typingFile = !typingFile"
      >
        <svg class="bi" width="24" height="24" fill="currentColor">
          <use xlink:href="../assets/bootstrap-icons.svg#file-earmark-plus"/>
        </svg>
        Create File
      </button>

      <input
        type="text"
        class="form-control m-1 mt-0 col-md-auto"
        v-if="typingFile"
        style="width: 200px"
        @keypress.enter="createFile"
        v-model="fileName"
      />

      <button
        type="button" 
        class="clickable btn btn-outline-secondary m-1 ms-0 mt-0 col-md-auto"
        @click="typingDelFile = !typingDelFile"
      >
        <svg class="bi" width="24" height="24" fill="currentColor">
          <use xlink:href="../assets/bootstrap-icons.svg#file-earmark-x"/>
        </svg>
        Delete File
      </button>

      <input
        type="text"
        class="form-control m-1 mt-0 col-md-auto"
        v-if="typingDelFile"
        style="width: 200px"
        @keypress.enter="deleteFile"
        v-model="fileDelName"
      />
    </div>
  </div>
</template>

<script>
import fs from 'fs'

import { ref } from 'vue'
import { dialog } from '@electron/remote'

export default {
  emits: ["changed"],
  data() {
    return {
      folderName: ref(''),
      typingName: ref(false),
      deleteFolder: ref(''),
      typingDelete: ref(false),
      fileName: ref(''),
      typingFile: ref(false),
      fileDelName: ref(''),
      typingDelFile: ref(false),
    }
  },
  props: {
    path: String,
    autoClose: Boolean,
  },
  methods: {
    createDir() {
      try {
        if (this.folderName === "")
          return
        
        let slashes = ''
        if (!this.path.endsWith('\\')) {
          slashes = '\\'
        }
        if(!fs.existsSync(this.path + slashes + this.folderName)) {
          fs.mkdirSync(this.path + slashes + this.folderName)
          this.typingName = !this.autoClose
          this.$emit('changed')
        } else {
          dialog.showMessageBox({ title: "Error", message: "Folder already exists!"})
        }
      } catch (err) {
        console.log(err)
        dialog.showErrorBox("Error", "Folder creating error!")
      }
    },
    deleteDir() {
      try {
        if (this.deleteFolder === "")
          return
        
        let slashes = ''
        if (!this.path.endsWith('\\')) {
          slashes = '\\'
        }
        if(fs.existsSync(this.path + slashes + this.deleteFolder)) {
          const conf = dialog.showMessageBoxSync({
            message: `Are you sure you want to delete this folder and files in it? (${this.path + slashes + this.deleteFolder})`,
            buttons: [ "&OK", "&Cancel"],
            normalizeAccessKeys: true,
            title: "Delete folder?"
          }) // ok - 0; cancel - 1
          if (conf) {
            return
          }
          fs.rmdirSync(this.path + slashes + this.deleteFolder, { recursive: true })
          this.typingDelete = !this.autoClose
          this.$emit('changed')
        } else {
          console.log(this.path + slashes + this.deleteFolder)
          dialog.showMessageBox({ title: "Error", message: "Folder not exists!" })
        }
      } catch (err) {
        console.log(err)
        dialog.showErrorBox("Error", "Folder deletiting error!\n" + err)
      }
    },
    createFile() {
      try {
        if (this.fileName === "")
          return

        let slashes = ''
        if (!this.path.endsWith('\\')) {
          slashes = '\\'
        }

        fs.appendFileSync(this.path + slashes + this.fileName, "")
        this.typingFile = !this.autoClose
        this.$emit('changed')
      } catch (err) {
        console.log(err)
        dialog.showErrorBox("Error", "File creating error!\n" + err)
      }
    },
    deleteFile() {
      try {
        if (this.fileDelName === "")
          return

        let slashes = ''
        if (!this.path.endsWith('\\')) {
          slashes = '\\'
        }

        if(fs.existsSync(this.path + slashes + this.deleteFolder)) {
          const conf = dialog.showMessageBoxSync({
            message: `Are you sure you want to delete this file? (${this.path + slashes + this.fileDelName})`,
            buttons: [ "&OK", "&Cancel"],
            normalizeAccessKeys: true,
            title: "Delete file?"
          }) // ok - 0; cancel - 1
          if (conf) {
            return
          }
          fs.unlinkSync(this.path + slashes + this.fileDelName)
          this.typingDelFile = !this.autoClose
          this.$emit('changed')
        }
      } catch (err) {
        console.log(err)
        dialog.showErrorBox("Error", "File deleting error!\n" + err)
      }
    }
  }
}
</script>