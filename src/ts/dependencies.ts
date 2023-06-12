export interface DepGraphJson {
  id: string
  fileName: string
  filePath: string
  dependencies: string[]
}

export interface DepGraph {
  id: string
  fileName: string
  filePath: string
  dependencies: DepGraph[]
}

export class Dependencies {
  dependencies: Record<string, DepGraph> = {}

  constructor(dependenciesJson: Record<string, DepGraphJson>) {
    for (let key in dependenciesJson) {
      const jsonDep = dependenciesJson[key]
      const newDep: DepGraph = {
        id: jsonDep.id,
        fileName: jsonDep.fileName,
        filePath: jsonDep.filePath,
        dependencies: []
      }
      this.dependencies[jsonDep.id] = newDep
    }

    for (let key in dependenciesJson) {
      const jsonDep = dependenciesJson[key]
      const dep = this.dependencies[key]

      for (let id of jsonDep.dependencies) {
        dep.dependencies.push(this.dependencies[id])
      }
    }
  }

  allNodes() {
    return Object.values(this.dependencies)
  }

  getAllDependencies(g: DepGraph) {
    const res: DepGraph[] = []
    function getAllDependencies(
      g: DepGraph,
      res: DepGraph[],
      visited: Record<string, boolean>
    ): void {
      res.push(...g.dependencies)
      for (let dep of g.dependencies) {
        if (!visited[dep.id]) {
          visited[dep.id] = true
          getAllDependencies(dep, res, visited)
        }
      }
    }
    getAllDependencies(g, res, {})
    return res
  }

  shortestPath(startNode: DepGraph, end: DepGraph): DepGraph[] | null {
    const graph: DepGraph[] = Object.values(this.dependencies)

    // Create a queue for BFS traversal
    const queue: { node: DepGraph; path: DepGraph[] }[] = []

    // Create a set to keep track of visited nodes
    const visited = new Set<string>()

    // Find the starting node in the graph
    // const startNode = graph.find((node) => node.fileName === startFileName)

    // If the startNode doesn't exist, return null
    if (!startNode) {
      return null
    }

    // Enqueue the start node with an empty path
    queue.push({ node: startNode, path: [] })
    visited.add(startNode.id)

    while (queue.length > 0) {
      const { node, path } = queue.shift()!

      // Add the current node to the path
      const newPath = [...path, node]

      // If the current node's fileName matches the endFileName, return the path
      if (node === end) {
        return newPath
      }

      // Enqueue the unvisited dependencies
      for (const dependency of node.dependencies) {
        if (!visited.has(dependency.id)) {
          queue.push({ node: dependency, path: newPath })
          visited.add(dependency.id)
        }
      }
    }

    // If no path is found, return null
    return null
  }
}
