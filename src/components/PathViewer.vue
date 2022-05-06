<template>
  <h4 style="min-height: 40px">
    <div class="overflow-auto" v-if="!showPath">
          <div
            class="d-inline-flex me-1 mt-1"
            v-for="p, index in customPath"
            :key="p"
          >
            <div
              class="d-flex align-middle btn-secondary btn"
              style="white-space: nowrap"
              @click="goPath(index)"
            >
              {{ p }}
              <svg class="bi" width="16" height="16" fill="currentColor"  v-if="index !== customPath.length - 1">
                <use xlink:href="../assets/bootstrap-icons.svg#caret-right-fill"/>
              </svg>
            </div>
          </div>
    </div>
    <div v-else class="p-2 ps-0">
      {{ discsfolder ? path : "This PC" }}
    </div>
  </h4>
</template>

<script>
export default {
  props: {
    path: String,
    discsfolder: Boolean,
    showPath: Boolean
  },
  methods: {
    goPath(index) {
      if (this.path.includes('\\'))
        this.$emit('applyPath', this.path.split('\\').slice(0,index).join('\\')+'\\')
      else 
        this.$emit('applyPath', this.path.split('/').slice(0,index).join('/')+'/')
    }
  },
  computed: {
    customPath() {
      if (!this.discsfolder) {
        return ['This PC']
      }

      if (this.path.includes('\\')) {
        const newPath = "This PC\\"+this.path
        return newPath.split('\\').filter(x => x !== "");
      } else {
        const newPath = "This PC/"+this.path
        return newPath.split('/').filter(x => x !== "");
      }
    }
  }
}
</script>

<style scoped>
  .bi {
    position: relative;
    font-size: calc(1rem + .3vw);
    top: 5px
  }
</style>