// view物件
const view = {
    creatGirds() {
        // 選擇具有 『.grid 類別 』 的 HTML 元素，為主要的遊戲板
        const grid = document.querySelector(".grid");
        let girds = "";
        // 迴圈 
        for (let i = 0; i < 210; i++) {
            // 當 i 小於 200 時，生成一個空格子，並添加到girds字串中
            // 當 i 大於等於 200 時，生成一個已佔據的格子，帶有 taken 類別，並添加到 girds 字串中
            // 200 個空格子 + 10 個已佔據的格子
            if (i < 200) {
                girds += "<div></div>";
            } else {
                girds += '<div class="taken"></div>';
            }
        }
        // 將生成的格子 HTML 插入到主遊戲板（.grid）中 
        grid.innerHTML = girds;
        // 右側迷你遊戲板  
        // 選擇具有 『.mini-grid 類別的 』HTML 元素，表示迷你遊戲板。
        const miniGrid = document.querySelector(".mini-grid");
        miniGrids = "";
        // 16 個迷你格子  顯示於迷你遊戲板
        for (let j = 0; j < 16; j++) {
            miniGrids += '<div class=""></div>';
        }
        // 生成的迷你格子 HTML 插入到迷你遊戲板（.mini-grid）中
        miniGrid.innerHTML = miniGrids;
    },
    // 顯示正在移動的方塊
    // draw() 方法
    draw() {
        // currentTetromino 搜尋對應的 squares元素 並加上 "tetromino"類別，顯示正在移動的方塊。
        model.currentTetromino.forEach((index) =>
        model.squares[model.currentPosition + index].classList.add("tetromino")
        );
        // currentTetromino 搜尋對應的 squares元素 的背景顏色為 model.colors[model.index]，這使用在方塊的顏色
        model.currentTetromino.forEach(
        (index) =>
        (model.squares[model.currentPosition + index].style.backgroundColor =
        model.colors[model.index])
        );
    },
    // 清除正在移動的方塊
    // undraw() 方法
    undraw() {
        // currentTetromino 搜尋對應的 squares元素 並移除 tetromino 類別，用於清除遊戲板上先前的方塊顯示。
        model.currentTetromino.forEach((index) =>
        model.squares[model.currentPosition + index].classList.remove("tetromino")
        );
        // currentTetromino 搜尋對應的 squares元素 將元素的背景顏色設為空字串，用於清除先前的方塊顏色。
        model.currentTetromino.forEach(
        (index) =>
        (model.squares[model.currentPosition + index].style.backgroundColor =
        "")
        );
    },
    // 迷你遊戲板顯示下一個方塊
    // 先清除迷你遊戲板上一個的顯示，然後根據 nextTetromino 的內容，將下一個方塊格子設置為對應的顏色和樣式，以呈現下一個方塊的預覽
    // displayNextTetromino()方法
    displayNextTetromino() {
        // 選擇所有擁有 (".mini-grid div") 類別的 HTML 元素，表示迷你遊戲板中的每個格子
        const displaySquares = document.querySelectorAll(".mini-grid div");
        // displaySquares 元素中的每個格子，移除 tetromino 類別，並將背景顏色設置為空。這會清除先前顯示的下一個方塊
        displaySquares.forEach((square) => {
            square.classList.remove("tetromino");
            square.style.backgroundColor = "";
        });
        // nextTetromino 搜尋對應的 displaySquares 元素並加上 tetromino類別，並將背景顏色設置為 model.colors[model.nextIndex]，用於迷你遊戲板顯示下個一個方塊。
        model.nextTetromino.forEach((index) => {
            displaySquares[1 + index].classList.add("tetromino");
            displaySquares[1 + index].style.backgroundColor =
            model.colors[model.nextIndex];
        });
    },
    // 檢查並移除滿行的方塊
    // checkAndRemoveGrids() 方法
    checkAndRemoveGrids() {
        // model.width（遊戲板的寬度）
        for (let i = 0; i < 200; i += model.width) {
            // 一行方塊索引的陣列
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
            // 如果這一行的方塊都被占滿，表示滿行
            // 當檢測到一滿行時，會將該行的方塊清除，並更新計數器反映已被移除的行數。
            if (isARowTetrominoes) {
            // 新增 此model中的計數器  追蹤已被移除的行數    
            model.numOfRemovedRow++;
            // 取得遊戲板的 HTML 元素，使用 .grid 這個 CSS 類別選擇器。
            const grid = document.querySelector(".grid");
            row.forEach((index) => {
                // 移除 tetromino 和 taken 兩個類別
                model.squares[index].classList.remove("tetromino", "taken");
                // 清空方塊的背景顏色，變為空白。
                model.squares[index].style.backgroundColor = "";
            });
            // 移除滿行的方塊，將其保存在 squaresRemoved 變數中。
            const squaresRemoved = model.squares.splice(i, model.width);
            // 移除滿行的方塊重新加入遊戲板的頂部。
            model.squares = squaresRemoved.concat(model.squares);
            // 重新渲染
            model.squares.forEach((cell) => grid.appendChild(cell));
          }
        }
    }
}

// --------------------------------------------------------------

const controller = {
    // displayGame() 方法
    displayGame() {
        // 呼叫 遊戲初始化
        model.initiGame();
        // 呼叫 view 物件的 draw() 方法，將遊戲板上的方塊顯示在畫面上。
        view.draw();
        // 下下個方塊可預覽
        model.createNextNextTetromino();
        // 下下個方塊顯示在畫面上
        view.displayNextTetromino();
        // 監聽鍵盤的 "keyup" 事件，呼叫 controller 物件的 control 方法。
        document.addEventListener("keyup", controller.control);
        // 監聽鍵盤的 "keydown" 事件，，呼叫 controller 物件的 rush 方法。
        document.addEventListener("keydown", controller.rush);
        // 透過 setInterval 啟動定時器，定期呼叫 controller 物件的降落(moveDown) 方法，產生方塊掉落的效果。定時器的間隔為 model.speed。
        model.timerId = setInterval(this.moveDown, model.speed);
        // 呼叫 controller 物件的 pause 方法，遊戲的暫停/繼續功能。
        this.pause();
        // 呼叫 controller 物件的 mouseControl 方法，加入滑鼠控制的功能。
        this.mouseControl();
    },

    // controller 物件中的 moveDown() 方法
    moveDown() {
        // 取得目前方塊的位置
        const currentPosition = model.currentPosition;
        // 取得目前的方塊形狀
        const current = model.currentTetromino;
        // 取得遊戲板上的所有方塊格子
        const squares = model.squares;
        // 取得遊戲板的寬度
        const width = model.width;
        //檢查是否有碰撞，也就是 檢查方塊的下一個位置是否已經被佔據（包含 "taken" 類別）。
        const isCollision = current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
        );
        // 如果有碰撞發生，呼叫 controller 物件的 freeze() 方法，凍結（固定）方塊在當前位置。
        if (isCollision) {
            controller.freeze();
        } 
        // 如果沒有碰撞
        // 呼叫 view 物件的 undraw() 方法，清除當下方塊在畫面上的顯示
        // 將 model.currentPosition（目前方塊的位置）增加一個遊戲板寬度的單位，也就是方塊繼續向下移動。
        // 呼叫 view 物件的 draw() 方法，重新在畫面上顯示移動後的方塊位置
        else {
            view.undraw();
            model.currentPosition += model.width;
            view.draw();
        }
    },

    // 按下鍵盤鍵 下箭頭 ↓ ，快速移動
    rush(event) {
        switch (event.keyCode) {
            // case 37:
            //   controller.moveLeft()
            //   break;
            // case 39:
            //   controller.moveRight()
            //   break;
            //   如果按下的鍵是下箭頭 ↓（keyCode 為 40）
            case 40:
                // 則呼叫 controller 物件的 moveDown() 方法，即方塊向下
                controller.moveDown();
            break;
        }
    },

    // controller 物件中的 freeze() 方法，處理方塊(凍結)的邏輯
    freeze() {
        // 取得目前方塊的位置
        const currentPosition = model.currentPosition;
        // 取得遊戲板的寬度
        const width = model.width;
        // 取得目前的方塊形狀
        const current = model.currentTetromino;
        // 取得遊戲板上的所有方塊格子
        const squares = model.squares;
        // 檢查方塊下方是否有障礙物（是否碰撞），（ "taken" 類別）。
        const isCollision = current.some((index) =>
            squares[currentPosition + index + width].classList.contains("taken")
        );
        // 如果發生碰撞，執行以下操作
        if (isCollision) {
            // 將目前方塊的每一個方塊格子標記為已佔據（"taken" 類別）
            current.forEach((index) =>
                squares[currentPosition + index].classList.add("taken")
            );
            // 使用 model 物件的 renewTetromino() 方法，更新目前方塊
            model.renewTetromino();
            // 使用model 物件的 createNextNextTetromino() 方法，生成下下個方塊
            model.createNextNextTetromino();
            // 呼叫 view 物件的 displayNextTetromino() 方法，顯示下下個方塊。
            view.displayNextTetromino();
            // 呼叫 view 物件的 checkAndRemoveGrids() 方法，檢查是否有滿行，並移除滿行的方塊
            view.checkAndRemoveGrids();
            // 呼叫 view 物件的 draw() 方法，重新在畫面上顯示更新後的方塊。
            view.draw();
            // 呼叫 model 物件的 addScore() 方法，處理分數的計算
            model.addScore();
            // 呼叫 controller 物件的 gameOver() 方法，判定是否遊戲結束的相關邏輯。
            this.gameOver();
        }
    },

    // controller 物件中的 moveLeft() 方法，處理方塊向左移動的邏輯
    moveLeft() {
        // 取得目前方塊的形狀
        const current = model.currentTetromino;
        // 取得遊戲板的寬度
        const width = model.width;
        // 取得遊戲板上的所有方塊格子
        const squares = model.squares;
        // 取得目前方塊的位置
        const currentPosition = model.currentPosition;
        // 檢查方塊是否位於最左邊的邊緣。使用 some 方法檢查方塊形狀中的每一個方塊，
        // 如果方塊的中心點位置加上相較於中心點的相對位置是寬度的倍數(EX : 0,10,20...)，表示方塊在最左邊
        const isAtLeftEdge = current.some(
            (index) => (currentPosition + index) % width === 0
        );
        // index - 1 : 左邊
        // 檢查方塊左側是否有障礙物（是否碰撞）（包含 "taken" 類別）。
        const isCollision = current.some((index) =>
            squares[currentPosition + index - 1].classList.contains("taken")
        );
        // 如果方塊不位於最左邊且左側沒有碰撞，則執行以下操作
            // 呼叫 view 物件的 undraw() 方法，清除當前方塊在畫面上的顯示
            // 將 model.currentPosition（目前方塊的位置）減一，即將方塊向左移動。
            // 呼叫 view 物件的 draw() 方法，重新在畫面上顯示更新後的方塊。
        if (!isAtLeftEdge && !isCollision) {
            view.undraw();
            model.currentPosition--;
            view.draw();
        }
    },

    // controller 物件中的 moveRight() 方法，處理方塊向右移動的邏輯
    moveRight() {
        // 取得目前方塊的形狀
        const current = model.currentTetromino;
        // 取得遊戲板的寬度
        const width = model.width;
        // 取得遊戲板上的所有方塊格子
        const squares = model.squares;
        // 取得目前方塊的位置        
        const currentPosition = model.currentPosition;
        // 檢查方塊是否位於最右邊的邊緣。使用 some 方法檢查方塊形狀中的每一個方塊，
        // 如果方塊的中心點位置加上相較於中心點的相對位置是寬度的倍數(EX : 9,19,29...)，表示方塊在最左邊
        const isAtRightEdge = current.some(
            (index) => (currentPosition + index) % width === width - 1
        );
        const isCollision = current.some((index) =>
            squares[currentPosition + index + 1].classList.contains("taken")
        );
        // 如果方塊不位於最右邊且右側沒有碰撞，則執行以下操作
            // 呼叫 view 物件的 undraw() 方法，清除當前方塊在畫面上的顯示
            // 將 model.currentPosition（目前方塊的位置）加一，即將方塊向左移動。
            // 呼叫 view 物件的 draw() 方法，重新在畫面上顯示更新後的方塊。
        if (!isAtRightEdge && !isCollision) {
            view.undraw();
            model.currentPosition++;
            view.draw();
        }
    },

    // controller 物件中的 rotate() 方法，用於處理方塊旋轉的邏輯
    rotate() {
        const width = model.width;
        // 取得遊戲板上的所有方塊格子
        const squares = model.squares;
        // 取得目前方塊的位置
        const currentPosition = model.currentPosition;
        // 計算下一個旋轉的角度。如果目前的旋轉角度加一等於方塊形狀的長度，則下一個角度設為 0；否則，下一個角度為目前角度加一。
        const nextRotation =
          model.currentRotation + 1 === model.currentTetromino.length
            ? 0
            : model.currentRotation + 1;
        // 下一個旋轉位置
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
        // 檢查目前方塊是否位於最左邊的邊緣
        const isAtLeftEdge = current.some(
          (index) => (currentPosition + index) % width === 0
        );
        // 檢查目前方塊是否位於最右邊的邊緣。
        const isAtRightEdge = current.some(
          (index) =>
            (currentPosition + index) % width === width - 1 ||
            (currentPosition + index) % width === width - 2
        );
        // 選擇下一個方塊的位子是最左邊格、左邊第二格。
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
        // 如果旋轉後會在最左邊，而當前在最右邊，或是  旋轉後會在最右邊，而當前在最左邊，進行位置調整 - 超過格數。
        if (nextIsAtLeftEdge & isAtRightEdge) {
            // 另一種想法，如果有兩格跑到另一側，那就退後兩格
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
        // 在畫面上重新顯示更新後的方塊。
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
        // 手機操作
        const controlForMobile = {
            upForMobile: controller.rotate,
            downForMobile: controller.moveDown,
            rightForMobile: controller.moveRight,
            leftForMobile: controller.moveLeft
        };
        // 透過Object.keys 函式，轉換為 arr 陣列
        const arr = Object.keys(control);
        // 透過Object.keys 函式，轉換為 arrForMobile 陣列
        const arrForMobile = Object.keys(controlForMobile);
        // 迴圈遍歷了 arr 陣列，滑鼠點擊按鍵就會依對應的操作
        arr.forEach((name) => {
            utility.addController(name, control);
        });
        // 迴圈遍歷了 arrForMobile 陣列，手機控制按鍵就會依對應的操作
        arrForMobile.forEach((name) => {
            utility.addController(name, controlForMobile);
        });
    },

    // 遊戲暫停、繼續
    pause() {
        const startBtn = document.getElementById("start-button");
        // 對 startBtn按鈕 添加點擊事件監聽器，按鈕被點擊時，執行後面的箭頭函式。
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
        // 對 start-button1按鈕 添加點擊事件監聽器，按鈕被點擊時，執行後面的箭頭函式。
        startBtn1.addEventListener("click", () => {

            if (model.timerId) {
                clearInterval(model.timerId);
                model.timerId = null;
            } else {
            model.timerId = setInterval(this.moveDown, model.speed);
            }
        });
    },

    // 遊戲結束邏輯
    gameOver() {
        // const score = document.querySelector("h3");
        // 檢查目前 當前控制 的方塊是否有碰撞，使用 some 函式檢查 model.currentTetromino 陣列中的每個方塊
        const isCollision = model.currentTetromino.some((index) =>
            // 如果其中任何一個方塊碰到已經佔據的格子（"taken" ），則回傳 true，表示有碰撞
            model.squares[model.currentPosition + index].classList.contains("taken")
        );
        // 碰撞發生時（ isCollision 為 true），執行括號內的代碼
        if (isCollision) {
            clearInterval(model.timerId);
        model.timerId = null;

        // 更新分數顯示
        const scoreDisplay = document.getElementById("score");
        // gameOver時 更新分數顯示的內容為當前分數。
        scoreDisplay.innerText = ` ${model.score}`;

        // 顯示遊戲結束的提示和重新開始按鈕
        // 獲取遊戲結束提示的容器元素
        let gameOverContainer = document.querySelector(".game-over-container");
            if (!gameOverContainer) {
                gameOverContainer = document.createElement("div");
                gameOverContainer.className = "game-over-container";
                gameOverContainer.innerHTML = `
                <p>遊戲結束</p>
                <button class="restart-button" id="restart-button">Restart</button>`;
                // 將遊戲結束的提示容器添加到 body 元素中
                document.body.appendChild(gameOverContainer);
                document.getElementById("restart-button").addEventListener("click", this.restartGame.bind(this));
            }
        }    
    },
    
    // 重新開始(初始化遊戲狀態)
    restartGame() {
        // 獲取遊戲結束提示的容器元素
        const gameOverContainer = document.querySelector(".game-over-container");
        // 如果遊戲結束的容器存在，則將其從 DOM 中移除。
        if (gameOverContainer) gameOverContainer.remove();
        model.initiGame();
        model.score = 0;
        model.speed = 1000;
        model.numOfRemovedRow = 0;
        document.getElementById("score").innerText = model.score;

    // 確保計時器正確重啟
    if (!model.timerId) {      //( 0 ,false, "" ...)
        model.timerId = setInterval(controller.moveDown, model.speed);
        // 重新初始化遊戲
        
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
        // 俄羅斯方塊 T
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
        // 返回陣列
        return [
            tetrominoJ,
            tetrominoL,
            tetrominoS,
            tetrominoZ,
            tetrominoT,
            tetrominoO,
            tetrominoI
        ];
    },
    // 俄羅斯方塊的寬度，設定為 10
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
    // 方塊下降的速度 1000
    speed: 1000,
    // 移除的行數
    numOfRemovedRow: 0,
    // 控制遊戲循環的計時器
    timerId: null,
    // 每種俄羅斯方塊的顏色
    colors: [
      "yellow",
      "greenyellow",
      "orange",
      "pink",
      "cyan",
      "darksalmon",
      "cornflowerblue"
    ],
    // createTetromino方法 獲取參數取得俄羅斯方塊的旋轉狀態及形狀
    createTetromino(
        currentRotation = this.currentRotation,
        index = this.index,
        width
    ) {
        return this.tetrominoes(width)[index][currentRotation];
    },

    // renewTetromino方法，更新下一個俄羅斯方塊的相關屬性 
    renewTetromino() {
        // 將下一個Tetromino移動到現在的Tetromino，使用nextIndex提取
        model.currentTetromino = model.createTetromino(
            0,
            model.nextIndex,
            model.width
        );
        // 重新建立位置 = 4
        model.currentPosition = 4;
        // 紀錄現在的index，使旋轉時知道是哪種Tetromino在旋轉
        model.index = model.nextIndex;
        // 使用亂數指定下一個Tetromino
        model.nextIndex = utility.randomIndex(model.tetrominoes());
    },

    // 遊戲初始化
    initiGame() {
        // 建立遊戲主畫面的方格網格
        view.creatGirds();
        // 選擇一個隨機形狀的俄羅斯方塊，並將其索引指定給 model.index
        model.index = utility.randomIndex(model.tetrominoes());
        // 建立指定形狀的俄羅斯方塊，並指定給 model.currentTetromino。
        model.currentTetromino = model.createTetromino();
        // model.squares 被初始化為遊戲主畫面中，所有的方格 div 元素的陣列
        model.squares = Array.from(document.querySelectorAll(".grid div"));
    },
    // createNextNextTetromino 方法建立下一個和下下一個俄羅斯方塊的形狀。
    createNextNextTetromino() {
        // 選擇一個隨機形狀的俄羅斯方塊，並將其索引指定給 model.nextIndex
        model.nextIndex = utility.randomIndex(model.tetrominoes());
        // 建立指定形狀的俄羅斯方塊，並指定給 model.nextTetromino。width 被設定為 4，代表下一個俄羅斯方塊的網格寬度。
        model.nextTetromino = model.createTetromino(0, model.nextIndex, 4);
    },

    // 更新遊戲分數 model.score 、調整遊戲速度 model.speed
    // addScore 的函式
    addScore() {
        // HTML 中具有 id 為 "score" 的元素，並將其存放在 score 變數中。
        const score = document.getElementById("score");
        // switch 陳述式，根據 model.numOfRemovedRow 的值進行不同處理
        switch (model.numOfRemovedRow) {
            // numOfRemovedRow 的值為 0，表示沒有消除行數。什麼都不做。沒有加分
            case 0:
                break;
            // numOfRemovedRow 的值為 1，表示消除了一行，則將 model.score 加 2 分，並提升難度，降低遊戲速度。這裡使用了三元運算符來確保速度不會低於 100。
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
        // 使用 clearInterval 清除目前的計時器，改變原有速度的遊戲進行
        clearInterval(model.timerId);
        // model.timerId 設置為 null，以便重新設定計時器
        model.timerId = null;
        // setInterval函式 設定一個計時器，每隔 model.speed 毫秒，就執行 controller.moveDown 函式一次
        // 將 setInterval 返回的 ID 存儲在 model.timerId 中，執行後清除上一個計時器，然後重新設定一個新的計時器，並以新的速度執行 
        model.timerId = setInterval(controller.moveDown, model.speed);
        // model.numOfRemovedRow 重置為 0，以便進行下一輪計算。
        model.numOfRemovedRow = 0;
        // 更新 HTML 中顯示分數的元素的文字內容。
        score.innerText = model.score;
    }
};

// 定義 utility物件
const utility = {
    // 用亂數，從陣列中隨機選擇一個元素 (隨機方塊形狀)
    randomIndex(array) {
      return Math.floor(Math.random() * array.length);
    },
    // 添加監聽器，接受兩個參數，在指定的 DOM 元素上監聽點擊事件，並在點擊時呼叫 movement 物件中對應名稱的方法。
    addController(name, movement) {
      const site = document.querySelector(`.${name}`);
      site.addEventListener("click", () => {
        movement[name]();
      });
    }
};


// 遊戲初始化，啟動並顯示遊戲
controller.displayGame();

    


      