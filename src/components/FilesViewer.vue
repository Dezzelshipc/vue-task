<template>
  <table class="table" v-if="!squareIcons">
    <tbody>
      <tr class="clickable open" @click="$emit('back')">
        <td class="icon-row align-middle text-center">
          <IconFolderOpen class="icon-folder" />
        </td>
        <td class="w-100">...</td>
        <td></td>
      </tr>
      <tr
        class="open clickable"
        v-for="file in files"
        :key="file.name"
        @click="onFileClick(file)"
        :title="file.name"
      >
        <td class="icon-row p-1 text-center">
          <IconFolder v-if="file.directory" class="icon-folder" />
          <IconFile v-else-if="!file.error" class="icon-file" :extension="getExt(file)" />
          <IconFileError v-else class="icon-file" />
        </td>
        <td class="w-100 align-middle">{{ file.name }}</td>
        <td class="align-middle">
          <span class="float-end" style="white-space: nowrap">{{ fileSize(file, checked) }}</span>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-else>
    <div
      class="clickable d-inline-flex btn btn-outline-secondary m-1 p-0"
      @click="$emit('back')"
      style="width: 100px; height: 100px"
    >
      <table class="w-100 h-100">
        <tr>
          <td>
            <IconFolderOpen class="icon-folder" :fontsize="40" />
          </td>
        </tr>
        <tr>
          <td>
            ...
          </td>
        </tr>
      </table>
    </div>
    <div
      class="clickable d-inline-flex btn btn-outline-secondary m-1 p-0"
      :class="{ 'btn-outline-secondary' : !file.error, 'btn-outline-danger' : file.error }"
      v-for="file in files"
      :key="file.name"
      @click="onFileClick(file)"
      style="width: 100px; height: 100px;"
      :title="title(file, file.size)"
    >
      <table class="w-100 h-100 align-middle text-center">
        <tr>
          <td>
            <IconFolder v-if="file.directory" class="icon-folder" :fontsize="40" />
            <IconFile v-else-if="!file.error" class="icon-file" :extension="getExt(file)" :fontsize="40" />
            <IconFileError v-else class="icon-file" :fontsize="40" />
          </td>
        </tr>
        <tr>
          <td class="text-truncate" style="max-width: 100px">
            {{ file.name }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import pathModule from 'path'
import { shell } from 'electron';

import IconFile from './IconFile.vue'
import IconFolder from './IconFolder.vue'
import IconFolderOpen from './IconFolderOpen.vue'
import IconFileError from './IconFileError.vue'

export default {
  props: {
      files: {
          type: Array,
          default: () => []
      },
      checked:  Boolean,
      squareIcons: Boolean,
  },
  data() {
    return {
      hoverFile: null,
    }
  },
  components: {
      IconFile,
      IconFolder,
      IconFolderOpen,
      IconFileError
  },
  methods: {
    fileSize({size}, checked) {
      if (!size) {
        return
      }
      let i
      if (!checked) {
        i = size ? Math.floor(Math.log(size) / Math.log(1024)) : size 
      } else {
        i = 0
      }
      
      return (
        (size / Math.pow(1024, i)).toFixed(2) * 1 + 
        " " +
        ['B', 'kB', 'MB', 'GB', 'TB'][i]
      )
    },
    onFileClick(file) {
      if (file.directory) this.$emit('folderclick', file)
      else {
        try {
          shell.openPath(pathModule.join(file.path, file.name))
        } catch (e) {
          console.log(e)
        }
      }
    },
    getExt(file) {
      return pathModule.extname(file.name)
    },
    title(file, size) {
      if (size) {
        return `${file.name}\n${this.fileSize(file, this.checked)}`
      }
      return file.name
    }
  }
}
</script>

<style scoped>
  .open {
    cursor: pointer;
    transition: transform .3s;
  }
  .open:hover {
    transform: scale(1.01, 1.01);
  }
</style>