const generateFirstGeneration = (isEmpty: boolean, length: number): number[][] | [] => {
    const rows = [];
    for (let i = 0; i < length; i++) {
        const generateCurrentRow = Array.from({ length }, () => (
            isEmpty ? 0 : Math.round(Math.random())))
        rows.push(generateCurrentRow)
    }
    return rows
}

export default generateFirstGeneration