import { _decorator, Canvas, CCFloat, CCInteger, Component, debug, director, EventInfo, instantiate, log, math, Node, Prefab, Size, Sprite, v3, Vec2, Vec3, EventTarget, Quat } from 'cc';
import { IntentEnum, Intents } from '../Intents/Intents';
import { Tetromino } from '../Entity/Tetromino/Tetromino';
const { ccclass, property } = _decorator;

export enum UpdateEnum {
    BoardUpdate,
}

@ccclass('TetitsModel')
export class TetitsModel extends Component {
    public Updated: EventTarget = new EventTarget();

    @property(Intents)
    private intent: Intents;

    //LockDelay的計時器
    @property(CCFloat)
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
        this.handlingTetromino = this.getNextTetromino();
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
    onHold(Hold: IntentEnum, onHold: any, thisArgs: this) {
    }
    onHardDrop(HardDrop: IntentEnum, onHardDrop: any, thisArgs: this) {
        this.handlingTetromino.hardDrop();
    }
    onSoftDrop(SoftDrop: IntentEnum, onSoftDrop: any, thisArgs: this) {
        this.handlingTetromino.tryMove(new Vec2(0, 1));
    }
    onRotateR(RotateR: IntentEnum, onRotateR: any, thisArgs: this) {
        this.handlingTetromino.tryRotateR();
    }
    onRotateL(RotateL: IntentEnum, onRotateL: any, thisArgs: this) {
        this.handlingTetromino.tryRotateL();
    }
    onMoveRight(MoveRight: IntentEnum, onMoveRight: any, thisArgs: this) {
        this.handlingTetromino.tryMove(new Vec2(1, 0));
    }
    onMoveLeft(MoveLeft: IntentEnum, onMoveLeft: any, thisArgs: this) {
        this.handlingTetromino.tryMove(new Vec2(-1, 0));
    }



    update(deltaTime: number) {
        //依照時間更新
        this.gravityCounter += deltaTime;
        if (this.gravityCounter >= this.gravityPeriod) {
            this.gravityCounter = 0;
            this.gravityDrop();
        }
        this.Updated.emit(UpdateEnum.BoardUpdate, this.board, this.handlingTetromino);
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
            [0, 0, 0, 0,],],
            new Vec2(1, 1),
            this.board);
    }
}


