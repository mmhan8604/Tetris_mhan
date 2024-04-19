const view = {
    creatGirds() {
        const grid = document.querySelector(".grid");
        let girds = "";
        
        for (let i = 0; i < 210; i++) {
            // 200 個空格子 + 10 個taken 類別(已佔據)的格子
            if (i < 200) {
                girds += "<div></div>";
            } else {
                girds += '<div class="taken"></div>';
            }
        }   
        grid.innerHTML = girds;
        // 右側迷你遊戲板     
        const miniGrid = document.querySelector(".mini-grid");
        miniGrids = "";
        for (let j = 0; j < 16; j++) {
            miniGrids += '<div class=""></div>';
        }
        //插入到.mini-grid中
        miniGrid.innerHTML = miniGrids;
    },


    // 顯示正在移動的方塊
    draw() {
        // currentTetromino(當前的方塊) 
        model.currentTetromino.forEach((index) =>
        model.squares[model.currentPosition + index].classList.add("tetromino")
        );
        //方塊的顏色
        model.currentTetromino.forEach(
        (index) =>
        (model.squares[model.currentPosition + index].style.backgroundColor =
        model.colors[model.index])
        );
    },
    
    // 清除移動的方塊軌跡
    undraw() {
        // 清除先前的方塊顯示。
        model.currentTetromino.forEach((index) =>
        model.squares[model.currentPosition + index].classList.remove("tetromino")
        );
        //清除先前的方塊顏色。
        model.currentTetromino.forEach(
        (index) =>
        (model.squares[model.currentPosition + index].style.backgroundColor =
        "")
        );
    },
    
    // 下一個方塊
    displayNextTetromino() {
        const displaySquares = document.querySelectorAll(".mini-grid div");
        // 清除先前顯示的下一個方塊
        displaySquares.forEach((square) => {
            square.classList.remove("tetromino");
            square.style.backgroundColor = "";
        });
        //顯示新的下個一個方塊。
        model.nextTetromino.forEach((index) => {
            displaySquares[1 + index].classList.add("tetromino");
            displaySquares[1 + index].style.backgroundColor =
            model.colors[model.nextIndex];
        });
    },

    // 移除滿行的方塊
    checkAndRemoveGrids() {
        for (let i = 0; i < 200; i += model.width) {
            const row = [
            i,
            i + 1,
            i + 2,
            i + 3,
            i + 4,
            i + 5,
            i + 6,
            i + 7,
            i + 8,
            i + 9
            ];
            // 檢查這一行的方塊是否已被占滿 ("taken")
            const isARowTetrominoes = row.every((index) =>
            model.squares[index].classList.contains("taken")
            );
           //滿行時方塊清除，並更新計數器。
            if (isARowTetrominoes) {
            model.numOfRemovedRow++;
            
            const grid = document.querySelector(".grid");
            row.forEach((index) => {
                model.squares[index].classList.remove("tetromino", "taken");
                // 清空方塊的背景顏色
                model.squares[index].style.backgroundColor = "";
            });
            const squaresRemoved = model.squares.splice(i, model.width);
            // 移除滿行的方塊
            model.squares = squaresRemoved.concat(model.squares);
            model.squares.forEach((cell) => grid.appendChild(cell));
          }
        }
    }
}

// --------------------------------------------------------------

const controller = {
    //顯示遊戲
    displayGame() {
        // 遊戲初始化
        model.initiGame();
        view.draw();
        // 預覽下下個方塊
        model.createNextNextTetromino();
        // 顯示下下個方塊
        view.displayNextTetromino();        
        document.addEventListener("keyup", controller.control);        
        document.addEventListener("keydown", controller.rush);
        model.timerId = setInterval(this.moveDown, model.speed);
        //暫停/繼續
        this.pause();
        //滑鼠控制。
        this.mouseControl();
    },

    
    moveDown() {
        // 取得目前方塊的位置
        const currentPosition = model.currentPosition;
        // 取得目前的方塊形狀
        const current = model.currentTetromino;
        // 取得遊戲板上的所有方塊行形狀
        const squares = model.squares;
        // 取得遊戲板的寬度
        const width = model.width;
        //檢查是否有碰撞 "taken"
        const isCollision = current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
        );
        // freeze() 凍結方塊位子。
        if (isCollision) {
            controller.freeze();
        } 
        else {
            view.undraw();
            model.currentPosition += model.width;
            view.draw();
        }
    },

    // 按下鍵盤鍵 下箭頭 ↓
    rush(event) {
        switch (event.keyCode) {
           
            case 40:
                
                controller.moveDown();
            break;
        }
    },

    // 方塊(凍結)
    freeze() {
        const currentPosition = model.currentPosition;
        const width = model.width;
        const current = model.currentTetromino;
        const squares = model.squares;
        const isCollision = current.some((index) =>
            squares[currentPosition + index + width].classList.contains("taken")
        );
        if (isCollision) {
            current.forEach((index) =>
                squares[currentPosition + index].classList.add("taken")
            );
            model.renewTetromino();
            model.createNextNextTetromino();
            view.displayNextTetromino();
            view.checkAndRemoveGrids();
            view.draw();
            //  處理分數的計算
            model.addScore();
            //  判定是否遊戲結束。
            this.gameOver();
        }
    },

    // 方塊向左移動
    moveLeft() {
        
        const current = model.currentTetromino;       
        const width = model.width;       
        const squares = model.squares;       
        const currentPosition = model.currentPosition;
        // 檢查方塊是否位在最左邊
        const isAtLeftEdge = current.some(
            (index) => (currentPosition + index) % width === 0
        );
        // index - 1 : 左邊
        // 檢查方塊左側是否有障礙物是否碰撞（"taken" ）。
        const isCollision = current.some((index) =>
            squares[currentPosition + index - 1].classList.contains("taken")
        );
        if (!isAtLeftEdge && !isCollision) {
            view.undraw();
            model.currentPosition--;
            view.draw();
        }
    },

    // 處理方塊向右移動的邏輯
    moveRight() {
       
        const current = model.currentTetromino;        
        const width = model.width;      
        const squares = model.squares;      
        const currentPosition = model.currentPosition;
        // 檢查方塊是否位於最右邊的邊緣。
        const isAtRightEdge = current.some(
            (index) => (currentPosition + index) % width === width - 1
        );
        const isCollision = current.some((index) =>
            squares[currentPosition + index + 1].classList.contains("taken")
        );
        if (!isAtRightEdge && !isCollision) {
            view.undraw();
            model.currentPosition++;
            view.draw();
        }
    },

    // 方塊旋轉
    rotate() {
        const width = model.width;
        const squares = model.squares;
        const currentPosition = model.currentPosition;
        // 計算下一個旋轉的角度。如果目前的旋轉角度加一等於方塊形狀的長度，則下一個角度設為 0；否則，下一個角度為目前角度加一。
        const nextRotation =
          model.currentRotation + 1 === model.currentTetromino.length
            ? 0
            : model.currentRotation + 1;
        const nextTetromino = model.createTetromino(nextRotation);
        // 檢查下一個旋轉後方塊形狀是否位於最左邊的邊緣。
        const nextIsAtLeftEdge = nextTetromino.some(
          (index) => (currentPosition + index) % width === 0
        );
        // 檢查下一個旋轉後方塊形狀是否位於最右邊的邊緣。
        const nextIsAtRightEdge = nextTetromino.some(
          (index) => (currentPosition + index) % width === width - 1
        );
        // 取得目前形狀
        const current = model.currentTetromino;
        const isAtLeftEdge = current.some(
          (index) => (currentPosition + index) % width === 0
        );
        const isAtRightEdge = current.some(
          (index) =>
            (currentPosition + index) % width === width - 1 ||
            (currentPosition + index) % width === width - 2
        );
        const backWard = nextTetromino.filter(
          (index) =>
            (currentPosition + index) % width === 0 ||
            (currentPosition + index) % width === 1
        );
        // 檢查下一個方塊形狀是否和已佔據的格子發生碰撞
        const isCollision = nextTetromino.some((index) =>
          squares[currentPosition + index].classList.contains("taken")
        );
        // 如果發生碰撞，結束旋轉操作。
        if (isCollision) {
            return;
        } else {
          view.undraw();
        if (nextIsAtLeftEdge & isAtRightEdge) {
            model.currentPosition -= backWard.length;
        } else if (nextIsAtRightEdge & isAtLeftEdge) {
            model.currentPosition++;
        }
        // 增加目前方塊的旋轉角度
        model.currentRotation++;
        // 如果目前的旋轉角度等於方塊形狀的長度，將旋轉角度重置為 0
        if (model.currentRotation === model.currentTetromino.length) {
            model.currentRotation = 0;
        }
        // 更新目前方塊的形狀
        model.currentTetromino = model.createTetromino();
        view.draw();
        }
    },

    // 按下鍵盤觸發事件
    control(event) {
        switch (event.keyCode) {
            case 37:
                controller.moveLeft();
            break;
            case 38:
                controller.rotate();
            break;
            case 17:
                controller.rotate();
            break;
            case 39:
                controller.moveRight();
            break;
            case 40:
                controller.moveDown();
            break;
        }
    },

    // 經由滑鼠控制遊戲
    mouseControl() {
        // 滑鼠操作
        const control = {
            rotate: controller.rotate,
            up: controller.rotate,
            down: controller.moveDown,
            right: controller.moveRight,
            left: controller.moveLeft
        };

        const controlForMobile = {
            upForMobile: controller.rotate,
            downForMobile: controller.moveDown,
            rightForMobile: controller.moveRight,
            leftForMobile: controller.moveLeft
        };
        const arr = Object.keys(control);
        const arrForMobile = Object.keys(controlForMobile);
        arr.forEach((name) => {
            utility.addController(name, control);
        });
        arrForMobile.forEach((name) => {
            utility.addController(name, controlForMobile);
        });
    },

    // 遊戲暫停、繼續
    pause() {
        const startBtn = document.getElementById("start-button");
        //按鈕被點擊時，執行函式。
        startBtn.addEventListener("click", () => {
            // 如果計時器已啟動，則使用 clearInterval 停止計時器，並將 model.timerId 設為 null，暫停遊戲。
            // 如果計時器未啟動，則使用 setInterval 啟動計時器，執行 this.moveDown 函式，即繼續遊戲。
            if (model.timerId) {
                clearInterval(model.timerId);
                model.timerId = null;
            } else {
            model.timerId = setInterval(this.moveDown, model.speed);
            }
        });
        const startBtn1 = document.getElementById("start-button1");

        startBtn1.addEventListener("click", () => {

            if (model.timerId) {
                clearInterval(model.timerId);
                model.timerId = null;
            } else {
            model.timerId = setInterval(this.moveDown, model.speed);
            }
        });
    },

    // 遊戲結束
    gameOver() {
        // 檢查目前 控制的方塊是否有碰撞，使用 some 函式檢查 model.currentTetromino 陣列中的每個方塊
        const isCollision = model.currentTetromino.some((index) =>
            // 如果其中任何一個方塊碰到已經佔據的格子（"taken" ）
            model.squares[model.currentPosition + index].classList.contains("taken")
        );
        // 碰撞發生時
        if (isCollision) {
            clearInterval(model.timerId);
        model.timerId = null;

        // 更新分數
        const scoreDisplay = document.getElementById("score");

        scoreDisplay.innerText = ` ${model.score}`;

        // 顯示遊戲結束的提示和重新開始按鈕
        let gameOverContainer = document.querySelector(".game-over-container");
            if (!gameOverContainer) {
                gameOverContainer = document.createElement("div");
                gameOverContainer.className = "game-over-container";
                gameOverContainer.innerHTML = `
                <p>遊戲結束</p>
                <button class="restart-button" id="restart-button">Restart</button>`;
                document.body.appendChild(gameOverContainer);
                document.getElementById("restart-button").addEventListener("click", this.restartGame.bind(this));
            }
        }    
    },
    
    // 重新開始
    restartGame() {
        const gameOverContainer = document.querySelector(".game-over-container");
        if (gameOverContainer) gameOverContainer.remove();
        model.initiGame();
        model.score = 0;
        model.speed = 1000;
        model.numOfRemovedRow = 0;
        document.getElementById("score").innerText = model.score;

    if (!model.timerId) {      //( 0 ,false, "" ...)
        model.timerId = setInterval(controller.moveDown, model.speed);
    }
    }
}
    
    
//--------------------------------------------------------------------------------------------------------

// model 物件
const model = {
    
    tetrominoes(width = this.width) {
        // 俄羅斯方塊 J
        //    口口
        //    口
        //    口
        const tetrominoJ = [
            [1, width + 1, width * 2 + 1, 2],
            [width, width + 1, width + 2, width * 2 + 2],
            [1, width + 1, width * 2 + 1, width * 2],
            [width, width * 2, width * 2 + 1, width * 2 + 2]
        ];
        // 俄羅斯方塊 L
        //    口口
        //      口
        //      口
        const tetrominoL = [
            [0, 1, width + 1, width * 2 + 1],
            [width, width + 1, width + 2, 2],
            [1, width + 1, width * 2 + 1, width * 2 + 2],
            [width, width + 1, width + 2, width * 2]
        ];
        // 俄羅斯方塊 S
        //    口
        //    口口
        //      口
        const tetrominoS = [
            [0, width, width + 1, width * 2 + 1],
            [width + 1, width + 2, width * 2, width * 2 + 1],
            [0, width, width + 1, width * 2 + 1],
            [width + 1, width + 2, width * 2, width * 2 + 1]
        ];
        // 俄羅斯方塊 Z
        //      口
        //    口口
        //    口  
        const tetrominoZ = [
            [1, width, width + 1, width * 2],
            [width, width + 1, width * 2 + 1, width * 2 + 2],
            [1, width, width + 1, width * 2],
            [width, width + 1, width * 2 + 1, width * 2 + 2]
        ];
        // 俄羅斯方塊 T
        //      口
        //    口口口      
        const tetrominoT = [
            [1, width, width + 1, width + 2],
            [1, width + 1, width + 2, width * 2 + 1],
            [width, width + 1, width + 2, width * 2 + 1],
            [1, width, width + 1, width * 2 + 1]
        ];
        // 俄羅斯方塊 O
        //    口口
        //    口口 
        const tetrominoO = [
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1]
        ];
        // 俄羅斯方塊 I
        //    口
        //    口 
        //    口
        //    口
        const tetrominoI = [
            [1, width + 1, width * 2 + 1, width * 3 + 1],
            [width, width + 1, width + 2, width + 3],
            [1, width + 1, width * 2 + 1, width * 3 + 1],
            [width, width + 1, width + 2, width + 3]
        ];
        // 俄羅斯方塊 +
        //     口
        //   口口口
        //     口
        const tetrominoX = [
            [1, width, width + 1, width + 2, width * 2 +1],
            [1, width, width + 1, width + 2, width * 2 +1],
            [1, width, width + 1, width + 2, width * 2 +1],
            [1, width, width + 1, width + 2, width * 2 +1]
        ];
        // 俄羅斯方塊 Snake
        //     口
        //     口口
        //       口口
        const tetrominoSnake = [
            [0,width, width+1, width*2+1, width *2 +2],
            [1,2,width,width+1,width *2],
            [0,1,width +1, width+2,width*2+2],
            [2,width+1,width+2,width*2, width*2+1],
            [0,width, width+1, width*2+1, width *2 +2],
            [1,2,width,width+1,width *2],
            [0,1,width +1, width+2,width*2+2],
            [2,width+1,width+2,width*2, width*2+1]
        ];
        // 俄羅斯方塊 Badd
        //   口  口
        //     口 
        //   口  口
        const tetrominoBadd = [
            [0,2, width+1, width*2, width *2 +2],
            [0,2, width+1, width*2, width *2 +2],
            [0,2, width+1, width*2, width *2 +2],
            [0,2, width+1, width*2, width *2 +2],
        ];
        // 俄羅斯方塊 Bad
        //     口
        //   口  口
        //     口
        const tetrominoBad = [
            [1,width, width+2, width*2+1],
            [1,width, width+2, width*2+1],
            [1,width, width+2, width*2+1],
            [1,width, width+2, width*2+1]
            
        ];
        // 返回陣列
        return [
            tetrominoJ,tetrominoJ,tetrominoJ,tetrominoJ,tetrominoJ,tetrominoJ,tetrominoJ,tetrominoJ,
            tetrominoL,tetrominoL,tetrominoL,tetrominoL,tetrominoL,tetrominoL,tetrominoL,tetrominoL,
            tetrominoS,tetrominoS,tetrominoS,tetrominoS,tetrominoS,tetrominoS,tetrominoS,tetrominoS,
            tetrominoZ,tetrominoZ,tetrominoZ,tetrominoZ,tetrominoZ,tetrominoZ,tetrominoZ,tetrominoZ,
            tetrominoT,tetrominoT,tetrominoT,tetrominoT,tetrominoT,tetrominoT,tetrominoT,tetrominoT,
            tetrominoO,tetrominoO,tetrominoO,tetrominoO,tetrominoO,tetrominoO,tetrominoO,tetrominoO,
            tetrominoI,tetrominoI,tetrominoI,tetrominoI,tetrominoI,tetrominoI,tetrominoI,tetrominoI,tetrominoI,tetrominoI,
            tetrominoX,tetrominoX,tetrominoX,
            tetrominoSnake,tetrominoSnake,tetrominoSnake,
            tetrominoBadd,
            tetrominoBad
        ];
    },
    
    // 俄羅斯方塊的寬度
    width: 10,
    // 目前俄羅斯方塊的位置
    currentPosition: 4,
    // 目前俄羅斯方塊的旋轉狀態
    currentRotation: 0,
    // 目前正在控制的俄羅斯方塊的形狀。
    currentTetromino: [],
    // 下一個將要出現的俄羅斯方塊的形狀
    nextTetromino: [],
    // 目前俄羅斯方塊的索引
    index: -1,
    // 下一個俄羅斯方塊的索引
    nextIndex: -1,
    // 遊戲分數
    score: 0,
    // 方塊下降的速度
    speed: 500,
    // 移除的行數
    numOfRemovedRow: 0,
    // 控制遊戲循環的計時器
    timerId: null,
    // 每種俄羅斯方塊的顏色
    colors: [
      "yellow","yellow","yellow","yellow","yellow","yellow","yellow","yellow",
      "greenyellow","greenyellow","greenyellow","greenyellow","greenyellow","greenyellow","greenyellow","greenyellow",
      "orange","orange","orange","orange","orange","orange","orange","orange",
      "pink","pink","pink","pink","pink","pink","pink","pink",
      "cyan","cyan","cyan","cyan","cyan","cyan","cyan","cyan",
      "darksalmon","darksalmon","darksalmon","darksalmon","darksalmon","darksalmon","darksalmon","darksalmon",
      "cornflowerblue","cornflowerblue","cornflowerblue","cornflowerblue","cornflowerblue","cornflowerblue","cornflowerblue","cornflowerblue","cornflowerblue","cornflowerblue",
      "peru","peru","peru",
      "SteelBlue","SteelBlue","SteelBlue",
      "black",
      "black"

    ],
    
    //  獲取參數取得俄羅斯方塊的旋轉狀態及形狀
    createTetromino(
        currentRotation = this.currentRotation,
        index = this.index,
        width
    ) {
        return this.tetrominoes(width)[index][currentRotation];
    },

    

    // 更新下一個俄羅斯方塊的相關屬性 
    renewTetromino() {
        
        model.currentTetromino = model.createTetromino(
            0,
            model.nextIndex,
            model.width
        );
        model.currentPosition = 4;
        model.index = model.nextIndex;
        model.nextIndex = utility.randomIndex(model.tetrominoes());
    },

    // 遊戲初始化
    initiGame() {
        // 建立遊戲主畫面的網格
        view.creatGirds();
        // 選擇一個隨機形狀的俄羅斯方塊
        model.index = utility.randomIndex(model.tetrominoes());
        model.currentTetromino = model.createTetromino();
        model.squares = Array.from(document.querySelectorAll(".grid div"));
    },
    // 建立下一個和下下一個俄羅斯方塊的形狀。
    createNextNextTetromino() {
        model.nextIndex = utility.randomIndex(model.tetrominoes());
        model.nextTetromino = model.createTetromino(0, model.nextIndex, 4);
    },

    // 更新遊戲分數、遊戲速度 
    addScore() {
        const score = document.getElementById("score");
        switch (model.numOfRemovedRow) {
            // numOfRemovedRow 的值為 0，表示沒有消除行數。
            case 0:
                break;
            // numOfRemovedRow 的值為 1，表示消除了一行，則將 model.score 加 2 分，並提升難度
            case 1:
                model.score += 2;
                model.speed = model.speed < 100 ? 100 : model.speed - 20;
                break;
            case 2:
                model.score += 4;
                model.speed = model.speed < 100 ? 100 : model.speed - 20;
                break;
            case 3:
                model.score += 8;
                model.speed = model.speed < 100 ? 100 : model.speed - 20;
                break;
            case 4:
                model.score += 16;
                model.speed = model.speed < 100 ? 100 : model.speed - 20;
                break;
        }
        
        clearInterval(model.timerId);
        model.timerId = null;
        model.timerId = setInterval(controller.moveDown, model.speed);
        model.numOfRemovedRow = 0;
        // 更新 HTML 中顯示分數的元素的文字內容。
        score.innerText = model.score;
    }
};

const utility = {
    // 隨機方塊形狀
    randomIndex(array) {
      return Math.floor(Math.random() * array.length);
    },
    
    addController(name, movement) {
      const site = document.querySelector(`.${name}`);
      site.addEventListener("click", () => {
        movement[name]();
      });
    }
};


// 遊戲初始化，啟動並顯示遊戲
controller.displayGame();

    


      