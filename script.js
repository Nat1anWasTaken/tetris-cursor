// 遊戲常數設定
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

// 俄羅斯方塊形狀定義 (使用 SRS 標準旋轉系統)
const SHAPES = {
    I: {
        shape: [
            [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
            [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
            [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
            [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
        ],
        color: '#00FFFF'
    },
    O: {
        shape: [
            [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]]
        ],
        color: '#FFFF00'
    },
    T: {
        shape: [
            [[0,1,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,0,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
            [[0,0,0,0], [1,1,1,0], [0,1,0,0], [0,0,0,0]],
            [[0,1,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]]
        ],
        color: '#800080'
    },
    S: {
        shape: [
            [[0,1,1,0], [1,1,0,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,0,0], [0,1,1,0], [0,0,1,0], [0,0,0,0]],
            [[0,0,0,0], [0,1,1,0], [1,1,0,0], [0,0,0,0]],
            [[1,0,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]]
        ],
        color: '#00FF00'
    },
    Z: {
        shape: [
            [[1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,0,1,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
            [[0,0,0,0], [1,1,0,0], [0,1,1,0], [0,0,0,0]],
            [[0,1,0,0], [1,1,0,0], [1,0,0,0], [0,0,0,0]]
        ],
        color: '#FF0000'
    },
    J: {
        shape: [
            [[1,0,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,1,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]],
            [[0,0,0,0], [1,1,1,0], [0,0,1,0], [0,0,0,0]],
            [[0,1,0,0], [0,1,0,0], [1,1,0,0], [0,0,0,0]]
        ],
        color: '#0000FF'
    },
    L: {
        shape: [
            [[0,0,1,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
            [[0,1,0,0], [0,1,0,0], [0,1,1,0], [0,0,0,0]],
            [[0,0,0,0], [1,1,1,0], [1,0,0,0], [0,0,0,0]],
            [[1,1,0,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]]
        ],
        color: '#FFA500'
    }
};

// 遊戲狀態
class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.currentPiece = null;
        this.nextPiece = null;
        this.ghostPiece = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.spawnPiece();
        this.spawnNextPiece();
        this.updateGhostPiece();
        this.updateDisplay();
        this.gameLoop();
    }
    
    bindEvents() {
        // 鍵盤事件
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            switch(e.code) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case 'Space':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
        
        // 按鈕事件
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
    }
    
    spawnPiece() {
        if (this.nextPiece) {
            this.currentPiece = this.nextPiece;
        } else {
            const shapes = Object.keys(SHAPES);
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            this.currentPiece = this.createPiece(randomShape);
        }
        
        this.currentPiece.x = Math.floor(BOARD_WIDTH / 2) - 2;
        this.currentPiece.y = 0;
        
        // 檢查遊戲結束
        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.gameOver();
            return;
        }
        
        this.gameRunning = true;
        this.spawnNextPiece();
        this.updateGhostPiece();
    }
    
    spawnNextPiece() {
        const shapes = Object.keys(SHAPES);
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        this.nextPiece = this.createPiece(randomShape);
        this.drawNextPiece();
    }
    
    createPiece(type) {
        return {
            type: type,
            shape: SHAPES[type].shape[0],
            color: SHAPES[type].color,
            x: 0,
            y: 0,
            rotation: 0
        };
    }
    
    movePiece(dx, dy) {
        if (this.checkCollision(this.currentPiece, dx, dy)) {
            if (dy > 0) {
                this.placePiece();
            }
            return false;
        }
        
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        this.updateGhostPiece();
        return true;
    }
    
    rotatePiece() {
        const piece = this.currentPiece;
        const newRotation = (piece.rotation + 1) % SHAPES[piece.type].shape.length;
        const newShape = SHAPES[piece.type].shape[newRotation];
        
        // 嘗試旋轉
        const oldShape = piece.shape;
        const oldRotation = piece.rotation;
        
        piece.shape = newShape;
        piece.rotation = newRotation;
        
        // 檢查碰撞，如果碰撞則嘗試牆踢
        if (this.checkCollision(piece, 0, 0)) {
            const wallKicks = this.getWallKicks(piece.type, oldRotation, newRotation);
            let rotated = false;
            
            for (let kick of wallKicks) {
                if (!this.checkCollision(piece, kick[0], kick[1])) {
                    piece.x += kick[0];
                    piece.y += kick[1];
                    rotated = true;
                    break;
                }
            }
            
            if (!rotated) {
                piece.shape = oldShape;
                piece.rotation = oldRotation;
                return false;
            }
        }
        
        this.updateGhostPiece();
        return true;
    }
    
    getWallKicks(type, oldRotation, newRotation) {
        // 簡化的牆踢數據
        if (type === 'I') {
            return [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]];
        } else {
            return [[0, 0], [-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1]];
        }
    }
    
    checkCollision(piece, dx, dy) {
        const newX = piece.x + dx;
        const newY = piece.y + dy;
        
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (piece.shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;
                    
                    if (boardX < 0 || boardX >= BOARD_WIDTH || 
                        boardY >= BOARD_HEIGHT || 
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    placePiece() {
        // 將方塊放置到遊戲板上
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        // 檢查消除行數
        this.clearLines();
        
        // 生成新方塊
        this.spawnPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                // 移除滿行
                this.board.splice(y, 1);
                this.board.unshift(Array(BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // 重新檢查同一行
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            
            // 計算分數 (俄羅斯方塊標準計分)
            const scoreMultiplier = [0, 40, 100, 300, 1200];
            this.score += scoreMultiplier[linesCleared] * this.level;
            
            // 升級
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
            
            this.updateDisplay();
        }
    }
    
    updateGhostPiece() {
        if (!this.currentPiece) return;
        
        this.ghostPiece = {
            ...this.currentPiece,
            shape: [...this.currentPiece.shape]
        };
        
        // 找到最低位置
        while (!this.checkCollision(this.ghostPiece, 0, 1)) {
            this.ghostPiece.y++;
        }
    }
    
    drawNextPiece() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!this.nextPiece) return;
        
        const size = 20;
        const offsetX = (this.nextCanvas.width - 4 * size) / 2;
        const offsetY = (this.nextCanvas.height - 4 * size) / 2;
        
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (this.nextPiece.shape[y][x]) {
                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(offsetX + x * size, offsetY + y * size, size - 1, size - 1);
                    
                    // 添加光澤效果
                    this.nextCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.nextCtx.fillRect(offsetX + x * size, offsetY + y * size, size - 1, 3);
                }
            }
        }
    }
    
    draw() {
        // 清空畫布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 繪製網格
        this.drawGrid();
        
        // 繪製已放置的方塊
        this.drawBoard();
        
        // 繪製幽靈方塊
        if (this.ghostPiece && this.gameRunning) {
            this.drawPiece(this.ghostPiece, true);
        }
        
        // 繪製當前方塊
        if (this.currentPiece && this.gameRunning) {
            this.drawPiece(this.currentPiece, false);
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= BOARD_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * BLOCK_SIZE, 0);
            this.ctx.lineTo(x * BLOCK_SIZE, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= BOARD_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * BLOCK_SIZE);
            this.ctx.lineTo(this.canvas.width, y * BLOCK_SIZE);
            this.ctx.stroke();
        }
    }
    
    drawBoard() {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                    
                    // 添加光澤效果
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, 3);
                }
            }
        }
    }
    
    drawPiece(piece, isGhost) {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (piece.shape[y][x]) {
                    const drawX = (piece.x + x) * BLOCK_SIZE;
                    const drawY = (piece.y + y) * BLOCK_SIZE;
                    
                    if (isGhost) {
                        // 幽靈方塊樣式
                        this.ctx.strokeStyle = piece.color;
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeRect(drawX + 1, drawY + 1, BLOCK_SIZE - 3, BLOCK_SIZE - 3);
                    } else {
                        // 正常方塊
                        this.ctx.fillStyle = piece.color;
                        this.ctx.fillRect(drawX, drawY, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                        
                        // 光澤效果
                        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        this.ctx.fillRect(drawX, drawY, BLOCK_SIZE - 1, 3);
                    }
                }
            }
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score.toLocaleString();
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }
    
    gameLoop(currentTime = 0) {
        if (!this.gameRunning || this.gamePaused) {
            requestAnimationFrame((time) => this.gameLoop(time));
            return;
        }
        
        if (currentTime - this.dropTime > this.dropInterval) {
            this.movePiece(0, 1);
            this.dropTime = currentTime;
        }
        
        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.gamePaused ? '繼續' : '暫停';
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score.toLocaleString();
        document.getElementById('gameOver').classList.add('show');
    }
    
    restart() {
        this.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.gameRunning = false;
        this.gamePaused = false;
        
        document.getElementById('gameOver').classList.remove('show');
        document.getElementById('pauseBtn').textContent = '暫停';
        
        this.spawnPiece();
        this.spawnNextPiece();
        this.updateGhostPiece();
        this.updateDisplay();
    }
}

// 初始化遊戲
window.addEventListener('DOMContentLoaded', () => {
    new TetrisGame();
});
