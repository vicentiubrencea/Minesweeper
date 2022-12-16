let gameOver = 0;
let flags = 10;
let safeCells = 0;
let nullCellsArray = [];
let seconds = 0;
const interval = setInterval(myTimer, 1000);
let gameMatrix = [];

for (let i = 0; i < 9; ++i) {
    let column = [];
    for (let j = 0; j < 9; ++j) {
        column.push(0);
    }
    gameMatrix.push(column);
}

startGame();

function startGame() {
    bombsGenerator();
    cellHintsGenerator();
    updateFlags();
    document.getElementById("boardGame").appendChild(createBoard());
    document.getElementById("time").innerHTML = "TIME: 000";
    window.addEventListener('contextmenu', (e) => {
        event.preventDefault();
    });
}

function bombsGenerator() {
    let minesPlanted = 0;
    while (minesPlanted < 10) {
        let rowBomb = Math.floor(Math.random() * 9);
        let colBomb = Math.floor(Math.random() * 9);
        if (gameMatrix[rowBomb][colBomb] == 0) {
            gameMatrix[rowBomb][colBomb] = "x";
            ++minesPlanted;
        }
    }  
}

function cellHintsGenerator() {
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            if (gameMatrix[i][j] === "x") {
                for (let n = -1; n < 2; ++n) {
                    for (let m = -1; m < 2; ++m) {
                        if (n + i >= 0 && m + j >= 0 && n + i < 9 && m + j < 9 && gameMatrix[n + i][m + j] !== "x") {
                            ++gameMatrix[n + i][m + j];
                        } 
                    }
                }
            }
        }
    }
}    

function createBoard() {
    let container = document.createElement('div');
    for (let i = 0; i < 9; ++i) {
    let row = document.createElement('div');
        row.className = "row";
        for (let j = 0; j < 9; ++j) {
            let cell = document.createElement('button');
            cell.className = "cell";
            cell.id = [i,j];
            cell.style.backgroundColor = "grey";
            cell.onclick = function() {showCell(i,j)};
            cell.oncontextmenu = function () {flag(i,j)};
            row.appendChild(cell);
        }
      container.appendChild(row);
   }
   return container;
}

function showCell(i,j) {
    if (gameOver == 1 || document.getElementById([i,j]).style.backgroundColor == "green") {
        return;
    }
    if (gameMatrix[i][j] == 0) {
        gameMatrix[i][j] = -1;
        revealArea(i,j);
    } else if (gameMatrix[i][j] > 0) {
        document.getElementById([i,j]).style.backgroundColor = "#B4B4B4";
        document.getElementById([i,j]).innerHTML = gameMatrix[i][j];
        gameMatrix[i][j] = -1;
        ++safeCells;
    } else if (gameMatrix[i][j] === "x") {
        gameOver = 1;
        isGameOver();
    }
    if (safeCells == 71) {
        gameOver = 1;
        isGameOver();
    }
}

function revealArea(i,j) {
    if (gameOver == 1) {
        return;
    }
    document.getElementById([i,j]).style.backgroundColor = "#B4B4B4";   
    gameMatrix[i][j] = -1;
    ++safeCells;
    if (document.getElementById([i,j]).innerHTML == "🚩") {
        document.getElementById([i,j]).innerHTML = "";
        ++flags;
        updateFlags();
    }
    for (let line = -1; line < 2; ++line) {
        for (let col = -1; col < 2; ++col) {
            if (line + i >= 0 && line + i < 9 && col + j >= 0 && col + j < 9) {
                if (gameMatrix[line + i][col + j] == 0) {
                    revealArea(line + i, col + j);
                } else if (gameMatrix[line + i][col + j] > 0) {
                    if (document.getElementById([line + i,col + j]).innerHTML == "🚩") {
                        ++flags;
                        updateFlags();
                    }
                    document.getElementById([line + i,col + j]).innerHTML = gameMatrix[line + i][col + j];
                    document.getElementById([line + i,col + j]).style.backgroundColor = "#B4B4B4"; 
                    gameMatrix[line + i][col + j] = -1;
                    ++safeCells;
                }        
            }
        }
    }
    if (safeCells == 71) {
        gameOver = 1;
        isGameOver();
    }
}

function flag(i,j) {
    if (document.getElementById([i,j]).style.backgroundColor == "grey") {
        document.getElementById([i,j]).style.backgroundColor = "green";
        document.getElementById([i,j]).innerHTML = "🚩";
        --flags;
    } else if (document.getElementById([i,j]).style.backgroundColor == "green") {
        document.getElementById([i,j]).style.backgroundColor = "grey"
        document.getElementById([i,j]).innerHTML = ""; 
        ++flags;
    }
    updateFlags();
}

function updateFlags() {
    document.getElementById("message").innerHTML = "Number of mine flags left: " + flags;
}

function isGameOver() {
    if (safeCells == 71) {
        document.getElementById("message").innerHTML = "GOOD JOB! YOU WON!";
    } else {
        showBombs();
        document.getElementById("message").innerHTML = "THE BOMB EXPLOADED. YOU LOST!";
    }
    clearInterval(interval);
}

function showBombs() {
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            if (gameMatrix[i][j] === "x") {
                document.getElementById([i,j]).style.backgroundColor = "#B4B4B4";
                document.getElementById([i,j]).innerHTML = "💣";
            }
        }
    }
}

function myTimer() {
    let aditional = "00";
    if (seconds > 9 && seconds < 100) {
        aditional = "0"
    } else if (seconds >= 100) {
        aditional = "";    
    } 
    document.getElementById("time").innerHTML = "TIME: " + aditional + seconds;
    ++seconds;
}
