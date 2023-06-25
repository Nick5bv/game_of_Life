import React, {useState, useEffect, FC, useRef, CanvasHTMLAttributes} from 'react';
import useInterval from "./hooks/useInterval";
import './App.scss';
import Button from "./components/Button/Button";
import {ButtonTypes} from "./components/Button/ButtonTypes";
import Header from "./components/Header/Header";

const SIDE_OF_GRID = 800;
const TILE_SIZE = 20;
const initialCanvasProperties: CanvasHTMLAttributes<HTMLCanvasElement> = {
    height: SIDE_OF_GRID,
    width: SIDE_OF_GRID
}

const generateTiles = (isRandom: boolean): number[][] | [] => {
    const rows = [];
    for (let i = 0; i < SIDE_OF_GRID / TILE_SIZE; i++) {
        const generateCurrentRow = Array.from({ length: SIDE_OF_GRID / TILE_SIZE }, () => (
            isRandom ? Math.round(Math.random()) : 0))
        rows.push(generateCurrentRow)
    }
    return rows
}

const App: FC = () => {
    const [grid, setGrid] = useState<number[][] | []>(() => generateTiles(false))
    const [running, setRunning] = useState<boolean>(false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const draw = (): void => {
        clearCanvas(false);
        for (let i = 0; i < grid.length; i++ ) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] && ctx) {
                    ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE)
                }
            }
        }
    }

    useEffect(draw, [grid]);

    const generateRandomTiles = (): void => {
        const randomArray = generateTiles(true)
        if (randomArray.length) {
            setGrid(randomArray)
        }
    }

    const runGame = (): void => {
        const nextGenerationGrid: number[][] | [] = []
        for (let i = 0; i < grid.length; i++ ) {
            nextGenerationGrid[i] = []
            for (let j = 0; j < grid[i].length; j++) {
                nextGenerationGrid[i][j] = 0
                let neighbors = 0
                if (grid[minEdgeIndex(i) - 1][j] === 1) neighbors++ //up
                if (grid[maxEdgeIndex(i) + 1][j] === 1) neighbors++ //bottom
                if (grid[i][minEdgeIndex(j) - 1] === 1) neighbors++ //left
                if (grid[i][maxEdgeIndex(j) + 1] === 1) neighbors++ //right
                if (grid[minEdgeIndex(i) - 1][maxEdgeIndex(j) + 1] === 1) neighbors++ //up-right
                if (grid[maxEdgeIndex(i) + 1][maxEdgeIndex(j) + 1] === 1) neighbors++ //bottom-right
                if (grid[minEdgeIndex(i) - 1][minEdgeIndex(j) - 1] === 1) neighbors++ //up-left
                if (grid[maxEdgeIndex(i) + 1][minEdgeIndex(j) - 1] === 1) neighbors++ //bottom-left

                if (grid[i][j] === 0) {
                    nextGenerationGrid[i][j] = neighbors === 3 ? 1 : 0
                } else {
                    nextGenerationGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0
                }
            }
        }
        const isStableConfiguration = JSON.stringify(grid) === JSON.stringify(nextGenerationGrid)
        if (isStableConfiguration) {
            setRunning(false)
            alert('game over')
        }
        setGrid(nextGenerationGrid)
    }

    useInterval(runGame, running ? 100 : null)

    const minEdgeIndex = (index: number): number => {
        if (index === 0) return grid.length
        return index
    }
    const maxEdgeIndex = (index: number): number => {
        if (index === grid.length - 1) return -1
        return index
    }

    const changeTileValue = (x: number, y: number): void => {
        const currentX: number = Math.floor(x / TILE_SIZE)
        const currentY: number = Math.floor(y / TILE_SIZE)
        const currentTileValue: number = grid[currentX][currentY]
        const currentGrid = JSON.parse(JSON.stringify(grid))
        currentGrid[currentX][currentY] = !!currentTileValue ? 0 : 1
        setGrid(currentGrid)
    }

    const onCanvasClick = ({nativeEvent: { offsetX, offsetY }}: React.MouseEvent): void => {
        changeTileValue(offsetX, offsetY)
    }

    const clearCanvas = (isRestart: boolean): void => {
        if (ctx) {
            ctx.clearRect(0, 0, SIDE_OF_GRID, SIDE_OF_GRID);
        }
        if (isRestart) {
            const emptyArray = generateTiles(false)
            setGrid(emptyArray)
        }
    }

    return (
        <div className={'body-wrapper dark-bg'}>
            <Header>
                <Button
                    buttonType={ButtonTypes.PRIMARY}
                    onClick={() => {
                        setRunning(!running);
                    }}
                >
                    {running ? 'Stop' : 'Start'}
                </Button>
                <Button
                    buttonType={ButtonTypes.SECONDARY}
                    onClick={generateRandomTiles}
                >
                    generate random values
                </Button>
                <Button
                    buttonType={ButtonTypes.SECONDARY}
                    onClick={() => clearCanvas(true)}
                >
                    clear field
                </Button>
            </Header>
            <div className={'canvas-wrapper'}>
                <canvas
                    className={'canvas'}
                    ref={canvasRef}
                    {...initialCanvasProperties}
                    onClick={onCanvasClick}
                />
            </div>
        </div>
    );
}

export default App;
