<template>
  <div class="container mt-2">
    <PathViewer
      :path="path"
      :discsfolder="discsFolder"
      :showPath="showPath"
      @applyPath="applyPath($event)"
    />

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

    <div class="form-check m-3 d-inline-block">
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

    <div class="form-check m-3 d-inline-block">
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

    <div class="form-check m-3 d-inline-block">
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

export default {
  components: {
    FilesViewer,
    DisksViewer,
    PathViewer,
  },
  data() {
    return {
      discsFolder: true,
      path: ref(pathModule.dirname(pathModule.dirname(app.getAppPath()))),
      searchString: ref(''),
      checked: ref(false),
      autoClear: ref(true),
      loading: ref(false),
      squareIcons: ref(false),
      showPath: ref(false)
    }
  },
  setup() {
    child.exec('wmic logicaldisk get name', (error, stdout) => {
      window.discs = stdout.split('\r\r\n')
          .filter(value => /[A-Za-z]:/.test(value))
          .map(value => (value.trim()+"\\"))
    })
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
      this.path = pathModule.join(folder)
      this.discsFolder = true
    },
    upd() {
      if (this.autoClear) {
        this.searchString = ""
      }
    },
    applyPath(path) {
      if (path !== '\\') {
        this.path = path
      } else {
        this.getDiscs()
        this.discsFolder = false
      }
    },
    getDiscs() {
      child.exec('wmic logicaldisk get name', (error, stdout) => {
        window.discs = stdout.split('\r\r\n')
            .filter(value => /[A-Za-z]:/.test(value))
            .map(value => (value.trim()+"\\"))
        })
    },
    filteredDiscs() {
      const discs = window.discs
      const searchString = this.searchString
      return searchString
        ? discs.filter(s => s.toLowerCase().includes(searchString.toLowerCase()))
        : discs
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