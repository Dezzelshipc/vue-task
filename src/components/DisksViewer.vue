<template>
  <table class="table" v-if="!squareIcons">
    <tbody>
      <tr
        class="open clickable"
        v-for="disc in discs"
        :key="disc"
        @click="onFileClick(disc)"
      >
        <td class="icon-row">
            <IconDisc class="icon-folder" />
        </td>
        <td class="w-100  align-middle">{{ disc }}</td>
      </tr>
    </tbody>
  </table>
  <div v-else
      class="clickable d-inline-flex btn btn-outline-secondary m-1 p-0"
      v-for="disc in discs"
      :key="disc"
      @click="onFileClick(disc)"
      style="width: 100px; height: 100px;"
      :title="disc"
    >
      <table class="w-100 h-100 align-middle text-center">
        <tr>
          <td>
            <IconDisc class="icon-folder" :fontsize="40" />
          </td>
        </tr>
        <tr>
          <td class="text-truncate" style="max-width: 100px">
            {{ disc }}
          </td>
        </tr>
      </table>
    </div>
</template>

<script>
import IconDisc from './IconDisc.vue'

export default {
    components: {
      IconDisc,
    },
    props: {
        discs: {
            type: Array,
            default: () => []
        },
        squareIcons: Boolean,
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