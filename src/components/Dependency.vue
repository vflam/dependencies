<template>
  <div class="dep" :class="{ child: child, path: path }">
    {{ dep.fileName }}
  </div>
</template>

<script lang="ts">
import type { DepGraph } from '@/ts/dependencies'
import type { PropType } from 'vue'

export default {
  props: {
    dep: {
      type: Object as PropType<DepGraph>,
      required: true
    },

    child: {
      type: Boolean,
      default: false
    },

    path: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.dep {
  border: 1px gray solid;
  padding: 10px;
  background-color: rgb(231, 238, 140);
  border-radius: 40px;
  margin: 5px;
  cursor: pointer;
}

.path {
  background-color: rgb(140, 255, 136);
}

.child {
  background-color: rgb(132, 190, 238);
}
</style>
