import { useState, useEffect, FC, useRef, CanvasHTMLAttributes, MouseEvent } from 'react';
import useInterval from './hooks/useInterval';
import Button from './components/Button/Button';
import { ButtonTypes } from './components/Button/ButtonTypes';
import Header from './components/Header/Header';
import generateFirstGeneration from './helpers/generateFirstGeneration';
import generateNextGeneration from './helpers/generateNextGeneration';
import './App.scss';

const SIDE_OF_GRID = 800;
const TILE_SIZE = 20;
const GRID_LENGTH = SIDE_OF_GRID / TILE_SIZE;
const initialCanvasProperties: CanvasHTMLAttributes<HTMLCanvasElement> = {
    height: SIDE_OF_GRID,
    width: SIDE_OF_GRID
}

const App: FC = () => {
    const [grid, setGrid] = useState<number[][] | []>(() => generateFirstGeneration(true, GRID_LENGTH))
    const [running, setRunning] = useState<boolean>(false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

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
        const randomArray = generateFirstGeneration(false, GRID_LENGTH)
        if (randomArray.length) {
            setGrid(randomArray)
        }
    }

    const runGame = (): void => {
        const isStableConfiguration = JSON.stringify(grid) === JSON.stringify(generateNextGeneration(grid))
        if (isStableConfiguration) {
            setRunning(false)
            alert('Game over')
        }
        setGrid(generateNextGeneration(grid))
    }

    useInterval(runGame, running ? 100 : null)

    const changeTileValue = (x: number, y: number): void => {
        const currentX: number = Math.floor(x / TILE_SIZE)
        const currentY: number = Math.floor(y / TILE_SIZE)
        const currentTileValue: number = grid[currentX][currentY]
        const currentGrid = JSON.parse(JSON.stringify(grid))
        currentGrid[currentX][currentY] = !!currentTileValue ? 0 : 1
        setGrid(currentGrid)
    }

    const onCanvasClick = ({nativeEvent: { offsetX, offsetY }}: MouseEvent): void => {
        changeTileValue(offsetX, offsetY)
    }

    const clearCanvas = (isRestart: boolean): void => {
        if (ctx) {
            ctx.clearRect(0, 0, SIDE_OF_GRID, SIDE_OF_GRID);
        }
        if (isRestart) {
            const emptyArray = generateFirstGeneration(true, GRID_LENGTH)
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
