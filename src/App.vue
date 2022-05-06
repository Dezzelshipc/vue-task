<template>
  <div class="container mt-2">

    <PathViewer
      :path="path"
      :discsfolder="discsFolder"
      :showPath="showPath"
      @applyPath="applyPath($event)"
    />

    <div>
      <button type="button" class="btn btn-outline-secondary d-inline-block clickable p-1 me-1" @click="backMemory()" :disabled="!memory.backward">
        <svg class="bi" width="32" height="32" fill="currentColor">
          <use xlink:href="./assets/bootstrap-icons.svg#arrow-left"/>
        </svg>
      </button>
      <button type="button" class="btn btn-outline-secondary d-inline-block clickable p-1 me-1" @click="forwardMemory()" :disabled="!memory.forward">
        <svg class="bi" width="32" height="32" fill="currentColor">
          <use xlink:href="./assets/bootstrap-icons.svg#arrow-right"/>
        </svg>
      </button>
    </div>

    <AddFiles
      :path="path"
      :autoClose="autoClose"
      @changed="updPath"
    />

    <div>
      <div class="form-check m-3 ms-0 d-inline-block">
        <input
          type="checkbox"
          class="form-check-input"
          id="squareIcons"
          v-model="squareIcons"
        />
        <label class="form-chack-label" for="squareIcons">
          Square Icons
        </label>
      </div>

      <div class="form-check m-3 ms-0 d-inline-block">
        <input
          type="checkbox"
          class="form-check-input"
          id="showPath"
          v-model="showPath"
        />
        <label class="form-chack-label" for="showPath">
          Show Path
        </label>
      </div>

      <div class="form-check m-3 ms-0 d-inline-block">
        <input
          type="checkbox"
          class="form-check-input"
          id="checkBytes"
          v-model="checked"
        />
        <label class="form-chack-label" for="checkBytes">
          In Bytes
        </label>
      </div>

      <div class="form-check m-3 ms-0 d-inline-block">
        <input
          type="checkbox"
          class="form-check-input"
          id="autoClear"
          v-model="autoClear"
          checked
        />
        <label class="form-chack-label" for="autoClear">
          Auto Clear
        </label>
      </div>

      <div class="form-check m-3 ms-0 d-inline-block">
        <input
          type="checkbox"
          class="form-check-input"
          id="autoClose"
          v-model="autoClose"
          checked
        />
        <label class="form-chack-label" for="autoClose">
          Auto Close
        </label>
      </div>

    </div>

    <div class="form-group mt-2 mb-2">
      <input
        v-model="searchString"
        class="form-control form-sontrol-sm"
        placeholder="File search"
      />
    </div>
    <FilesViewer
      :files="filteredFiles"
      :checked="checked"
      :squareIcons="squareIcons"
      @back="back"
      @folderclick="open($event.name)"
      v-if="discsFolder"
    />
    <DisksViewer
      v-else
      :discs="filteredDiscs()"
      :squareIcons="squareIcons"
      @folderclick="openNew($event)"
    />
  </div>
</template>

<script>
import fs from 'fs'
import pathModule from 'path'
import child from 'child_process'

import { app } from '@electron/remote'
import { ref } from 'vue'

import FilesViewer from './components/FilesViewer.vue'
import DisksViewer from './components/DisksViewer.vue'
import PathViewer from './components/PathViewer.vue'
import AddFiles from './components/AddFiles.vue'

export default {
  components: {
    FilesViewer,
    DisksViewer,
    PathViewer,
    AddFiles,
  },
  data() {
    return {
      discsFolder: ref(true),
      path: ref(pathModule.dirname(pathModule.dirname(app.getAppPath()))),
      searchString: ref(''),
      checked: ref(false),
      autoClear: ref(true),
      autoClose: ref(true),
      loading: ref(false),
      squareIcons: ref(false),
      showPath: ref(false),
      memory: {
        arr: ref([]),
        index: ref(0),
        isBack: ref(false),
        forward: ref(false),
        backward: ref(false)
      },
    }
  },
  setup() {
    const discs = child.execSync('wmic logicaldisk get name').toString('utf8')
      .split('\r\r\n')
      .filter(value => /[A-Za-z]:/.test(value))
      .map(value => (value.trim()+"\\"))

    return {
      discs
    }
  },
  methods: {
    back() {
      this.upd()
      if (this.path == pathModule.dirname(this.path)) {
        this.discsFolder = false
        this.getDiscs()
      }
      this.path = pathModule.dirname(this.path)
      
    },
    open(folder) {
      this.upd()
      this.path = pathModule.join(this.path, folder)
    },
    openNew(folder) {
      this.upd()
      this.getDiscs()
      this.path = ""
      this.path = pathModule.join(folder)
      this.discsFolder = true
    },
    applyPath(path) {
      if (this.autoClear) {
        this.searchString = ""
      }
      if (path !== '\\') {
        this.makeMemory()
        this.path = path
      } else {
        this.getDiscs()
        this.discsFolder = false
      }
    },
    upd() {
      this.makeMemory()
      if (this.autoClear) {
        this.searchString = ""
      }
    },
    updPath() {
      const bufPath = this.path
      this.path = ""
      this.path = bufPath
    },
    getDiscs() {
      this.discs = child.execSync('wmic logicaldisk get name').toString('utf8')
        .split('\r\r\n')
        .filter(value => /[A-Za-z]:/.test(value))
        .map(value => (value.trim()+"\\"))
    },
    filteredDiscs() {
      const discs = this.discs
      const searchString = this.searchString
      return searchString
        ? discs.filter(s => s.toLowerCase().includes(searchString.toLowerCase()))
        : discs
    },
    makeMemory() {
      if (this.memory.isBack) {
        this.memory.arr = this.memory.arr.slice(this.memory.index + 1)
        this.memory.index = 0
        this.memory.isBack = false
        this.memory.forward = false
      }
      this.memory.backward = true
      if (this.memory.arr[0] !== this.path) {
        this.memory.arr.unshift(this.path)
      }
      if (this.memory.arr.length > 10) {
        this.memory.arr.pop()
      }
    },
    backMemory() {
      this.discsFolder = true
      this.memory.isBack = true
      if (this.memory.index === 0 && this.memory.arr[0] !== this.path) {
        this.memory.arr.unshift(this.path)
      }
      this.path = this.memory.arr[++this.memory.index]
      this.memory.forward = true
      if (this.memory.index === this.memory.arr.length - 1) {
        this.memory.backward = false
      }
    },
    forwardMemory() {
      this.discsFolder = true
      this.path = this.memory.arr[--this.memory.index]
      this.memory.backward = true
      if (this.memory.index === 0) {
        this.memory.forward = false
        this.memory.isBack = false
      }
    }
  },
  computed: {
    files() {
      try {
        const fileNames = fs.readdirSync(this.path)
        return fileNames.map(file => {
          try {
            var stats = fs.statSync(pathModule.join(this.path, file))
          } catch (e) {
            return {
              name: null,
              size: null,
              directory: null,
            }
          }
          
          return {
            name: file,
            size: stats.isFile() ? stats.size ?? 0 : null,
            directory: stats.isDirectory(),
            path: this.path
          }
        })
          .filter(x => x.name !== null)
          .sort((a, b) => {
          if (a.directory === b.directory) {
            return a.name.localeCompare(b.name)
          }
          return a.directory ? -1 : 1
        })
      } catch (e) {
        return [{
          name: e?.code + ": Not allowed to read current folder",
          size: 0,
          directory: 0,
          error: 1
        }]
      }
    },
    filteredFiles() {
      const searchString = this.searchString
      const files = this.files
      return searchString
        ? files.filter(s => s.name.toLowerCase().includes(searchString.toLowerCase()))
        : files
    },
    
  }
}
</script>