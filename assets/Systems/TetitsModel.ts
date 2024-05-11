import { _decorator, Canvas, CCFloat, CCInteger, Component, debug, director, EventInfo, instantiate, log, math, Node, Prefab, Size, Sprite, v3, Vec2, Vec3, EventTarget, Quat } from 'cc';
import { IntentEnum, Intents } from '../Intents/Intents';
const { ccclass, property } = _decorator;
@ccclass('TetitsModel')
export class TetitsModel extends Component {
    public Update: EventTarget = new EventTarget();

    @property(Intents)
    private intent: Intents;

    //LockDelay的計時器
    @property(CCInteger)
    public lockDelayTimerMax: number = 0;
    public lockDelayTimer: number = this.lockDelayTimerMax;

    //下落的週期，單位為秒
    @property(CCFloat)
    public gravityPeriod: number = 3;

    //下落的時間計數器，到達gravityPeriod時會下落，並歸零
    private gravityCounter: number = 0;

    //遊戲棋盤大小
    @property(Size)
    public size: Size = new Size(10, 20);
    //邏輯相關
    //遊戲棋盤放置已成定局的盤面
    board: number[][] = [];


    //目前正在操作的方塊
    handlingTetromino: Tetromino;

    onLoad(): void {
        this.lockDelayTimer = this.lockDelayTimerMax;
        this.board = new Array(this.size.height).fill(0).map(() => new Array(this.size.width).fill(0));
        this.handlingTetromino = new Tetromino([
            [0, 0, 0, 0,],
            [1, 1, 1, 0,],
            [0, 1, 0, 0,],
            [0, 0, 0, 0,],]
            , this.board);
        this.start();
    }
    start() {
        this.intent.PlayerIntent.on(IntentEnum.MoveLeft, this.onMoveLeft, this);
        this.intent.PlayerIntent.on(IntentEnum.MoveRight, this.onMoveRight, this);
        this.intent.PlayerIntent.on(IntentEnum.RotateL, this.onRotateL, this);
        this.intent.PlayerIntent.on(IntentEnum.RotateR, this.onRotateR, this);
        this.intent.PlayerIntent.on(IntentEnum.SoftDrop, this.onSoftDrop, this);
        this.intent.PlayerIntent.on(IntentEnum.HardDrop, this.onHardDrop, this);
        this.intent.PlayerIntent.on(IntentEnum.Hold, this.onHold, this);
    }
    onHold(Hold: IntentEnum, onHold: any, arg2: this) {
    }
    onHardDrop(HardDrop: IntentEnum, onHardDrop: any, arg2: this) {
        this.handlingTetromino.hardDrop();
    }
    onSoftDrop(SoftDrop: IntentEnum, onSoftDrop: any, arg2: this) {
        this.handlingTetromino.tryMove(new Vec2(0, 1));
    }
    onRotateR(RotateR: IntentEnum, onRotateR: any, arg2: this) {
        this.handlingTetromino.tryRotateR();
    }
    onRotateL(RotateL: IntentEnum, onRotateL: any, arg2: this) {
        this.handlingTetromino.tryRotateL();
    }
    onMoveRight(MoveRight: IntentEnum, onMoveRight: any, arg2: this) {
        this.handlingTetromino.tryMove(new Vec2(1, 0));
    }
    onMoveLeft(MoveLeft: IntentEnum, onMoveLeft: any, arg2: this) {
        this.handlingTetromino.tryMove(new Vec2(-1, 0));
    }


    
    update(deltaTime: number) {
        //依照時間更新
        this.gravityCounter += deltaTime;
        if (this.gravityCounter >= this.gravityPeriod) {
            this.gravityCounter = 0;
            this.gravityDrop();
        }
        this.debugLog();
    }


    private debugLog() {
        let boardOutPut: String = "";
        let previewBoard = this.board.map(innerboard => [...innerboard]);
        this.handlingTetromino.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell != 0) {
                    previewBoard
                    [this.handlingTetromino.position.y + y]
                    [this.handlingTetromino.position.x + x] = cell;
                }
            }, this);
        });
        previewBoard.forEach(element => {
            boardOutPut += element.toString() + "\n";
        });
        console.log(boardOutPut);

    }


    //檢查是否可以放置到棋盤上
    //如果可以放置，則放置並回傳true，否則回傳false
    private tryPlaceTetromino(tetromino: Tetromino): boolean {
        if (tetromino.isLegal(tetromino.shape, tetromino.position)) {
            tetromino.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell != 0) {
                        this.board[tetromino.position.y + y][tetromino.position.x + x] = cell;
                    }
                }, this);
            });
            return true;
        }
        return false;
    }


    //將方塊放置在棋盤上
    private placeTetromino(tetromino: Tetromino): void {
        if (!this.tryPlaceTetromino(tetromino)) {
            throw new Error("Cannot place tetromino");
        }
    }
    
    //重力下落，如果無法下落則放置，在放置前會檢查是否有LockDelay
    private gravityDrop(): void {
        if (!this.handlingTetromino.tryMove(new Vec2(0, 1))) {
            if (this.lockDelayTimer <= 0) {
                this.placeTetromino(this.handlingTetromino);
                this.checkClearLines();
                this.lockDelayTimer = this.lockDelayTimerMax;
                this.handlingTetromino = this.getNextTetromino();
            } else {
                this.lockDelayTimer--;
            }
        }
    }

    //在新放置的方塊區域，檢查是否有滿行，並消除，上方的方塊下降，並回傳消除的行數
    private checkClearLines(): number {
        let clearLines = 0;
        for (let y = 0; y < this.board.length; y++) {
            if (this.board[y].every(cell => cell != 0)) {
                this.board.splice(y, 1);
                this.board.unshift(new Array(10).fill(0));
                clearLines++;
            }
        }
        return clearLines;
    }

    //得到下一個方塊
    private getNextTetromino(): Tetromino {
        return new Tetromino([
            [0, 0, 0, 0,],
            [1, 1, 1, 0,],
            [0, 1, 0, 0,],
            [0, 0, 0, 0,],]
            , this.board);
    }
}


class Tetromino {
    public constructor(shape: number[][], board: number[][]) {
        if (shape.length != 4 || shape.some(row => row.length != 4)) {
            throw new Error("Shape must be 4x4");
        }
        if (board.length < 10 || board[0].length < 10) {
            throw new Error("Board must be at least 10x10");
        }
        this.shape = shape;
        this.board = board;
    }
    //方塊的盤面，0為空
    private board: number[][] = [];
    //4x4的方塊，0為空
    public shape: number[][] = []



    //方塊的位置，LeftTop為(0,0)
    public position: Vec2 = new Vec2(0, 0);

    //嘗試旋轉方塊，如果成功則旋轉並回傳true，否則回傳false
    public tryRotateL(): boolean {
        return this.tryRotate(-1);
    }

    //嘗試旋轉方塊，如果成功則旋轉並回傳true，否則回傳false
    public tryRotateR(): boolean {
        return this.tryRotate(1);
    }

    //嘗試移動方塊，如果成功則移動並回傳true，否則回傳false
    public tryMove(vec: Vec2): boolean {
        let nextPosition = this.position.clone().add(vec);
        if (this.isLegal(this.shape, nextPosition)) {
            this.position = nextPosition;
            return true;
        }
        return false;
    }

    //嘗試旋轉方塊，如果失敗則進行WallKick檢查，如果還是失敗則不旋轉
    private tryRotate(direction: number): boolean {
        let nextShape = this.shape.map((row, y) =>
            row.map((cell, x) => this.shape[direction === 1 ? (this.shape.length - 1 - x) : x][direction === 1 ? y : (this.shape.length - 1 - y)]));
        if (this.isLegal(nextShape, this.position)) {
            this.shape = nextShape;
            return true;
        } else {
            if (this.wallKick(nextShape)) {
                return true;
            }
        }
        return false;
    }

    //WallKick檢查，如果可以則進行WallKick，規則為最寬鬆且最符合直覺的規則
    private wallKick(nextShape: number[][]): boolean {
        let wallKickData = [
            [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
            [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
            [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        ];
        for (let i = 0; i < wallKickData.length; i++) {
            let wallKick = wallKickData[i];
            let nextPosition = this.position.clone().add(new Vec2(wallKick[0][0], wallKick[0][1]));
            if (this.isLegal(nextShape, nextPosition)) {
                this.position = nextPosition;
                this.shape = nextShape;
                return true;
            }
        }
        return false;
    }





    //檢查移動是否合法(沒有與其他方塊重疊，沒有超出邊界)
    public isLegal(shape: number[][], position: Vec2): boolean {
        const boardWidth = this.board[0].length;
        const boardHeight = this.board.length;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] == 0)
                    continue;
                const newX = position.x + x;
                const newY = position.y + y;
                if (newX < 0 || newX >= boardWidth || newY < 0 || newY >= boardHeight)
                    return false;
                if (this.board[newY][newX] !== 0)
                    return false;
            }
        }

        return true;
    }




    //快速掉落方塊
    public hardDrop(): void {
        while (this.tryMove(new Vec2(0, 1))) {
        }
    }




}