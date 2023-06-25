enum NEIGHBOR {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
    TOP_RIGHT = 'TOP_RIGHT',
    TOP_LEFT = 'TOP_LEFT',
    BOTTOM_RIGHT = 'BOTTOM_RIGHT',
    BOTTOM_LEFT = 'BOTTOM_LEFT',
}

const generateNextGeneration = (prevGeneration: number[][]): number[][] | [] => {
    const nextGenerationGrid: number[][] | [] = []
    for (let i = 0; i < prevGeneration.length; i++ ) {
        nextGenerationGrid[i] = []
        for (let j = 0; j < prevGeneration[i].length; j++) {
            nextGenerationGrid[i][j] = 0
            let neighbors = getNeighbors(i, j, prevGeneration)
            if (prevGeneration[i][j] === 0) {
                nextGenerationGrid[i][j] = neighbors === 3 ? 1 : 0
            } else {
                nextGenerationGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0
            }
        }
    }
    return nextGenerationGrid
}

const getNeighbors = (i: number, j: number, prevGeneration: number[][] ): number => {
    let neighbors = 0
    Object.keys(NEIGHBOR).forEach((neighbor: string) => {
        if (getNeighbor(i, j, prevGeneration, neighbor as NEIGHBOR)) neighbors++
    })
    return neighbors
}

const minEdgeIndex = (index: number, length: number): number => {
    if (index === 0) return length
    return index
}
const maxEdgeIndex = (index: number, length: number): number => {
    if (index === length - 1) return -1
    return index
}

const getNeighbor = (i: number, j: number, prevGeneration: number[][], neighbor: NEIGHBOR): boolean => {
    switch (neighbor) {
        case NEIGHBOR.TOP:
            return prevGeneration[minEdgeIndex(i, prevGeneration.length) - 1][j] === 1
        case NEIGHBOR.TOP_RIGHT:
            return prevGeneration[minEdgeIndex(i, prevGeneration.length) - 1][maxEdgeIndex(j, prevGeneration.length) + 1] === 1
        case NEIGHBOR.RIGHT:
            return prevGeneration[i][maxEdgeIndex(j, prevGeneration.length) + 1] === 1
        case NEIGHBOR.BOTTOM_RIGHT:
            return prevGeneration[maxEdgeIndex(i, prevGeneration.length) + 1][maxEdgeIndex(j, prevGeneration.length) + 1] === 1
        case NEIGHBOR.BOTTOM:
            return prevGeneration[maxEdgeIndex(i, prevGeneration.length) + 1][j] === 1
        case NEIGHBOR.BOTTOM_LEFT:
            return prevGeneration[maxEdgeIndex(i, prevGeneration.length) + 1][minEdgeIndex(j, prevGeneration.length) - 1] === 1
        case NEIGHBOR.LEFT:
            return prevGeneration[i][minEdgeIndex(j, prevGeneration.length) - 1] === 1
        case NEIGHBOR.TOP_LEFT:
            return prevGeneration[minEdgeIndex(i, prevGeneration.length) - 1][minEdgeIndex(j, prevGeneration.length) - 1] === 1
        default:
            return false
    }
}

export default generateNextGeneration