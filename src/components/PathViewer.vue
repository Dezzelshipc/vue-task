<template>
  <h4>
    <table class="overflow-auto">
      <tbody>
        <tr>
          <td
            v-for="p, index in customPath"
            :key="p"
          >
            <div
              class="d-flex align-middle btn-secondary btn"
              style="white-space: nowrap"
              @click="goPath(p, index)"
            >
              {{ p }}
              <i class="bi bi-caret-right-fill" v-if="index !== customPath.length - 1"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </h4>
</template>

<script>
export default {
    props: {
      path: {
        type: String
      },
      discsfolder: {
        type: Boolean
      }
    },
    methods: {
      goPath(index) {
        this.$emit('applyPath', this.path.split('\\').slice(0,index).join('\\')+'\\')
      }
    },
    computed: {
      customPath() {
        if (this.discsfolder) {
          const newPath = "This PC\\"+this.path
          return newPath.split('\\').filter(x => x !== "");
        } else {
          return ['This PC']
        }
      }
    }
}
</script>

<style scoped>
  .bi::before {
    position: relative;
    font-size: calc(1rem + .3vw);
    top: 2px
  }
</style>