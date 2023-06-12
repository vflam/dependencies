<template>
  <fieldset>
    <legend>Filters</legend>
    <input v-model="filter" type="text" placehold="Filter..." />
  </fieldset>
  <div>
    <div class="deps" v-if="!selected && !target">
      <Dependency
        :dep="node"
        v-for="node of filtered(dependencies.allNodes())"
        @click="select(node)"
      ></Dependency>
    </div>

    <div class="deps" v-if="selected && !target">
      <Dependency :dep="selected" @click="unselect"></Dependency>
      <Dependency @click="findPaths(node)" :dep="node" v-for="node of filtered(children)" child />
    </div>

    <template v-if="selected && target">
      <div class="deps">
        <Dependency :dep="selected" @click="unselect"></Dependency>

        <Dependency
          @click="findPaths(node)"
          :dep="node"
          v-for="node of filtered(path)"
          path
          :child="node == target"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import deps from '@/assets/dependencies.json'
import { Dependencies, type DepGraph } from './ts/dependencies'
import Dependency from './components/Dependency.vue'

export default {
  created() {
    this.filter = localStorage.getItem('filter') || ''
  },

  data() {
    return {
      selected: null as DepGraph | null,
      target: null as DepGraph | null,
      dependencies: new Dependencies(deps as any),
      children: [] as DepGraph[],
      path: [] as DepGraph[],
      filter: ''
    }
  },

  methods: {
    select(dep: DepGraph) {
      this.selected = dep
      this.children = this.dependencies.getAllDependencies(this.selected)
      this.filter = ''
    },

    unselect() {
      if (!this.target) {
        this.selected = null
        this.children = []
        this.target = null
        this.path = []
      } else {
        this.target = null
        this.path = []
      }
    },

    filtered(deps: DepGraph[]) {
      return deps.filter((elt) =>
        elt.fileName.toLocaleLowerCase().includes(this.filter.toLowerCase())
      )
    },

    findPaths(target: DepGraph) {
      this.filter = ''
      if (this.selected) {
        this.target = target
        this.path = this.dependencies.shortestPath(this.selected, target) || []
        this.path.splice(0, 1)
      }
    }
  },

  components: { Dependency },

  watch: {
    filter() {
      localStorage.setItem('filter', this.filter)
    }
  }
}
</script>

<style scoped>
.deps {
  display: flex;
  flex-wrap: wrap;
}
</style>
