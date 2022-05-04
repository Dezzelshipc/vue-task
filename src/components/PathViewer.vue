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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16" v-if="index !== customPath.length - 1">
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
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