const GRID_SIZE = 20;
const TILE_NUM = 30;

const EMPTY = 0;
const SNAKE = 1;
const FRUIT = 2;

let GAME_TICK = 50;

const TEXT_HEIGHT = 20;

const [UP, LEFT, DOWN, RIGHT] = [0, 1, 2, 3];

const insane = () => GAME_TICK = 25;
const normal = () => GAME_TICK = 50;
const easy = () => GAME_TICK = 75;

$(document.body).ready(() => {

    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById("canvas");

    let ctx = canvas.getContext("2d");

    canvas.height = GRID_SIZE * TILE_NUM + TEXT_HEIGHT;
    canvas.width = GRID_SIZE * TILE_NUM;

    canvas.style.width = GRID_SIZE * TILE_NUM;
    canvas.style.height = GRID_SIZE * TILE_NUM + TEXT_HEIGHT;

    let snake = [];
    let grid;

    let currentDirection = UP;
    let nextDirection = UP;

    let gameloop;
    let skip = false;
    let currentScore = 0
    let maxScore = 0;
    
    const reset = () => {
        grid = Array.from({ length: TILE_NUM }, 
        () => new Array(TILE_NUM).fill(EMPTY));

        snake = [];
    };

    const getEmptyPos = () => {
        let x, y;

        do {
            x = Math.floor(Math.random() * TILE_NUM);
            y = Math.floor(Math.random() * TILE_NUM);
        } while (grid[x][y] != EMPTY);

        return [x, y];
    }

    const drawGrid = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < TILE_NUM; y++) {
            for (let x = 0; x < TILE_NUM; x++) {
                ctx.fillStyle = ["black", "blue", "red"][get(x, y)];
                ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
        ctx.font ="20px Arial";
        ctx.strokeStyle="black";
        ctx.fillStyle='black';
        ctx.strokeText(`Current Score: ${currentScore}          Highest Score: ${maxScore}`, 0, (TILE_NUM + 1) * GRID_SIZE);
    }

    const get = (x, y) => grid[x][y];
    const set = (x, y, value) => grid[x][y] = value;

    const inBound = (x, y) => x >= 0 && y >= 0 && x < TILE_NUM && y < TILE_NUM;

    const addSnake = (x, y) => {
        if (!inBound(x, y) || get(x, y) === SNAKE) {
            gameover();
            return;
        };
        snake.unshift([x, y]);
        skip = get(x, y) === FRUIT;
        set(x, y, SNAKE);
    }

    const removeTail = () => set(...snake.pop(), EMPTY);

    const placeFruit = () => set(...getEmptyPos(), FRUIT);
    
    const startGame = () => {
        if (!gameloop) {
            reset();
            placeFruit();
            addSnake(~~(TILE_NUM / 2), ~~(TILE_NUM / 2));
            drawGrid();
            gameloop = setInterval(update, GAME_TICK);
        }
    }

    const isOpposite = (dir1, dir2) => Math.abs(dir1 - dir2) === 2;

    const pressWSAD = dir => {
        if (gameloop && snake.length === 1 || !isOpposite(dir, currentDirection)) nextDirection = dir;
    }
    
    const events = {
        82: startGame,
        68: () => pressWSAD(RIGHT), 65: () => pressWSAD(LEFT), 
        83: () => pressWSAD(DOWN), 87: () => pressWSAD(UP),
        38: () => pressWSAD(UP), 37: () => pressWSAD(LEFT),
        40: () => pressWSAD(DOWN), 39: () => pressWSAD(RIGHT),
    };


    const update = () => {
        currentDirection = nextDirection;
        let [x, y] = snake[0];
        switch (currentDirection) {
            case UP:
                addSnake(x, y - 1);
                break;
            case DOWN:
                addSnake(x, y + 1);
                break;
            case RIGHT:
                addSnake(x + 1, y);
                break;
            case LEFT:
                addSnake(x - 1, y);
                break;
            default:
                console.error("Unknown Direction");
        }
        skip ? placeFruit() : removeTail();
        drawGrid();
        if (gameloop && snake.length - 1 >= maxScore) {
            maxScore = snake.length - 1;
        }
        if (gameloop){
            currentScore = snake.length - 1
        }
    }

    const gameover = () => {
        clearInterval(gameloop);
        gameloop = 0;
    }

    $(window).keydown(e => events[e.keyCode] && events[e.keyCode]());
    reset();
    drawGrid();
});