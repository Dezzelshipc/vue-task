<template>
   <table class="table">
    <tbody>
      <tr
        class="open"
        v-for="disc in discs"
        :key="disc"
        :class="{ clickable: disc }"
        @click="onFileClick(disc)"
      >
        <td class="icon-row">
          <IconFolderOpen class="icon-folder" />
        </td>
        <td class="w-100  align-middle">{{ disc }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import IconFolderOpen from './IconFolderOpen.vue'

export default {
    components: {
      IconFolderOpen
    },
    props: {
        discs: {
            type: Array,
            default: () => []
        }
    },
    methods: {
      onFileClick(disc) {
        this.$emit('folderclick', disc)
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