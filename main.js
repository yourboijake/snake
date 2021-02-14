const GRID_SIZE = 30;

//initialize back end grid
var grid = [];
for (let i = 0; i < GRID_SIZE; i++) {
    var row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
        row.push(0);
    }
    grid.push(row);
}
//in backend grid, 0 = black space, 1 = body, 2 = head,
//3 = tail, and 4 = apple


//initialize HTML board
var table = document.createElement("table");
for (var i = 0; i < GRID_SIZE; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < GRID_SIZE; j++) {
        var td = document.createElement('td');
        td.className = "black";
        td.id = i + '-' + j;
        tr.appendChild(td);
    }
    table.appendChild(tr);
}
table.id = "board";
document.body.appendChild(table);

//initialize snake movement direction and placement
var del_y = 0;
var del_x = 1;
var snake = [[9, 9], [9, 8], [9, 7]];
grid[9][9] = 2;
grid[9][8] = 1;
grid[9][7] = 1;

//spawn new food
function newFood() {
    var coordinates = [];
    coordinates.push(Math.floor(Math.random() * (GRID_SIZE)));
    while (coordinates[0] < GRID_SIZE/2 + 1 && coordinates[0] > GRID_SIZE/2 - 1) {
        coordinates[0] = Math.floor(Math.random() * (GRID_SIZE));
    }
    coordinates.push(Math.floor(Math.random() * (GRID_SIZE)));
    while (coordinates[1] < GRID_SIZE/2 + 1 && coordinates[1] > GRID_SIZE/2 - 1) {
        coordinates[1] = Math.floor(Math.random() * (GRID_SIZE));
    }
    //ensure food doesn't spawn in the center
    return coordinates;
}

function updateHTML() {
    for (var i = 0; i < GRID_SIZE; i++) {
        for (var j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] == 0) {
                document.getElementById(i + '-' + j).className = 'black';
            }
            else if (grid[i][j] == 1 || grid[i][j] == 3) {
                document.getElementById(i + '-' + j).className = 'green';
            }
            else if (grid[i][j] == 2) {
                document.getElementById(i + '-' + j).className = 'head';
            }
            else {
                document.getElementById(i + '-' + j).className = 'red';
            }
        }
    }
}


function moveBoard() {
    
    //initialize new board
    let newGrid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        let row = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            row.push(0);
        }
        newGrid.push(row);
    }

    //move snake
    let newSnake = [];
    newSnake.push([snake[0][0] + del_y, snake[0][1] + del_x]);
    for (let i = 0; i < snake.length - 1; i++) {
        newSnake.push(snake[i]);
    }
    snake = newSnake;

    //put values into newGrid

    for (let i = 0; i < newSnake.length; i++) {
        if (i == 0) { //make new head
            let y = newSnake[i][0];
            let x = newSnake[i][1];
            newGrid[y][x] = 2;
        }
        else if (i == newSnake.length - 1) { //make tail
            let y = newSnake[i][0];
            let x = newSnake[i][1];
            newGrid[y][x] = 3;
        }
        else { //make body
            let y = newSnake[i][0];
            let x = newSnake[i][1];
            newGrid[y][x] = 1;
        }
    }

    //assign newGrid to grid
    grid = newGrid;
    updateHTML();
}

function checkSnakeOverlap() {
    let headX = snake[0][1];
    let headY = snake[0][0];
    for (let i = 1; i < snake.length; i++) {
        if (snake[i][0] == headY && snake[i][1] == headX) {
            return true;
        }
    }
    return false;
}

var x; //declare variable to store setInterval
function runGame() {
    if (snake[0][0] == GRID_SIZE || snake[0][0] < 0 || snake[0][1] < 0 || snake[0][1] == GRID_SIZE) {
        clearInterval(x); //cancel if the snake is out of bounds
        console.log('game over: out of bounds');
    }
    else if (checkSnakeOverlap()) { //cancel if the snake runs over its tail
        clearInterval(x);
        console.log('you hit your tail');
    }
    else {
        moveBoard();
    }
}

function startRunningGame() {
    document.addEventListener('keydown', (event) => {
        if (event.key == 'ArrowUp') {
            del_x = 0;
            del_y = -1;
        }
        else if (event.key == 'ArrowDown') {
            del_x = 0;
            del_y = 1;
        }
        else if (event.key == 'ArrowRight') {
            del_x = 1;
            del_y = 0;
        }
        else if (event.key == 'ArrowLeft') {
            del_x = -1;
            del_y = 0;
        }
    })
    x = setInterval(runGame, 150);
}

//start main runGame function on click of start button
document.getElementById('start-button').addEventListener('click', startRunningGame);
