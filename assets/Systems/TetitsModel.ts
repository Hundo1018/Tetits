import { _decorator, CCFloat, Component, Size, Vec2, EventTarget } from 'cc';
import { IntentEnum, Intents } from '../Intents/Intents';
import { Tetromino } from '../Entity/Tetromino/Tetromino';
const { ccclass, property } = _decorator;

export enum UpdateEnum {
    BoardUpdate,
    ClearLines,
    PlaceTetromino,
    GameOver,
}

@ccclass('TetitsModel')
export class TetitsModel extends Component {
    public Updated: EventTarget = new EventTarget();

    @property(Intents)
    private intent: Intents;

    //LockDelay的計時器，單位為秒
    @property(CCFloat)
    public lockDelayTimerMax: number = 1;
    public lockDelayTimer: number = this.lockDelayTimerMax;
    private isDelayLocking = false;

    //下落的週期，單位為秒
    @property(CCFloat)
    public gravityPeriod: number = 1;
    private gravityCounter: number = 0;

    //遊戲棋盤大小
    @property(Size)
    public size: Size = new Size(10, 20);
    //邏輯相關
    //遊戲棋盤放置已成定局的盤面
    private board: number[][] = [];

    //接下來的方塊
    private TetrominoBag: Tetromino[] = [];


    //目前正在操作的方塊
    private handlingTetromino: Tetromino;
    
    onLoad(): void {
        this.lockDelayTimer = this.lockDelayTimerMax;
        this.board = new Array(this.size.height).fill(0).map(() => new Array(this.size.width).fill(0));


        this.shuffleBag();
        this.handlingTetromino = this.getNextTetromino();
    }

    //洗牌
    private shuffleBag() {
        let T = new Tetromino([
            [0, 1, 0,],
            [1, 1, 1,],
            [0, 0, 0,],], this.board);
        let I = new Tetromino([
            [0, 0, 0, 0,],
            [1, 1, 1, 1,],
            [0, 0, 0, 0,],
            [0, 0, 0, 0,],], this.board);
        let O = new Tetromino([
            [1, 1,],
            [1, 1,],], this.board);
        let L = new Tetromino([
            [0, 0, 0,],
            [1, 1, 1,],
            [1, 0, 0,],], this.board);
        let J = new Tetromino([
            [0, 0, 0,],
            [1, 1, 1,],
            [0, 0, 1,],], this.board);
        let S = new Tetromino([
            [0, 0, 0,],
            [0, 1, 1,],
            [1, 1, 0,],], this.board);
        let Z = new Tetromino([
            [0, 0, 0,],
            [1, 1, 0,],
            [0, 1, 1,],], this.board);
        this.TetrominoBag.push(T);
        this.TetrominoBag.push(I);
        this.TetrominoBag.push(O);
        this.TetrominoBag.push(L);
        this.TetrominoBag.push(J);
        this.TetrominoBag.push(S);
        this.TetrominoBag.push(Z);
        for (let i = this.TetrominoBag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.TetrominoBag[i], this.TetrominoBag[j]] = [this.TetrominoBag[j], this.TetrominoBag[i]];
        }
    }

    //綁定事件
    start() {
        this.intent.PlayerIntent.on(IntentEnum.MoveLeft, this.onMoveLeft, this);
        this.intent.PlayerIntent.on(IntentEnum.MoveRight, this.onMoveRight, this);
        this.intent.PlayerIntent.on(IntentEnum.RotateL, this.onRotateL, this);
        this.intent.PlayerIntent.on(IntentEnum.RotateR, this.onRotateR, this);
        this.intent.PlayerIntent.on(IntentEnum.SoftDrop, this.onSoftDrop, this);
        this.intent.PlayerIntent.on(IntentEnum.HardDrop, this.onHardDrop, this);
        this.intent.PlayerIntent.on(IntentEnum.Hold, this.onHold, this);
    }
    private onHold(Hold: IntentEnum, onHold: any, thisArgs: this) {
    }
    private onHardDrop(HardDrop: IntentEnum, onHardDrop: any, thisArgs: this) {
        this.handlingTetromino.hardDrop();
    }
    private onSoftDrop(SoftDrop: IntentEnum, onSoftDrop: any, thisArgs: this) {
        this.handlingTetromino.tryMove(new Vec2(0, 1));
    }
    private onRotateR(RotateR: IntentEnum, onRotateR: any, thisArgs: this) {
        this.handlingTetromino.tryRotateR();
    }
    private onRotateL(RotateL: IntentEnum, onRotateL: any, thisArgs: this) {
        this.handlingTetromino.tryRotateL();
    }
    private onMoveRight(MoveRight: IntentEnum, onMoveRight: any, thisArgs: this) {
        this.handlingTetromino.tryMove(new Vec2(1, 0));
    }
    private onMoveLeft(MoveLeft: IntentEnum, onMoveLeft: any, thisArgs: this) {
        this.handlingTetromino.tryMove(new Vec2(-1, 0));
    }



    update(deltaTime: number) {
        //發送更新事件
        this.Updated.emit(UpdateEnum.BoardUpdate, this.board, this.handlingTetromino);
        let isTimeToDrop = this.checkGravityDrop(deltaTime);
        //FIXME:是否需要鎖定不應該受到重力的週期影響
        //如果時間到了，則下落
        if (isTimeToDrop) {
            //如果下落失敗，則鎖定方塊
            this.isDelayLocking = !this.handlingTetromino.tryMove(new Vec2(0, 1));
        }
        if (!this.isDelayLocking) {
            return;
        }

        //如果需要鎖定，則進行鎖定計時
        if (this.lockDelayTimer > 0) {
            this.lockDelayTimer -= deltaTime;
            console.log(this.lockDelayTimer);
            return;
        }

        //放置方塊
        this.placeTetromino(this.handlingTetromino);
        this.Updated.emit(UpdateEnum.PlaceTetromino, this.handlingTetromino);

        //檢查是否有清行，發送事件
        let clearLines = this.checkClearLines();
        if (clearLines > 0) {
            this.Updated.emit(UpdateEnum.ClearLines, clearLines);
        }

        //檢查遊戲是否結束
        if (this.handlingTetromino.position.y == 0 &&
            !this.handlingTetromino.isLegal(this.handlingTetromino.shape, this.handlingTetromino.position)) {
            this.Updated.emit(UpdateEnum.GameOver);
            return;
        }
        //重置LockDelay
        this.lockDelayTimer = this.lockDelayTimerMax;
        this.isDelayLocking = false;

        //取得下一個方塊
        this.handlingTetromino = this.getNextTetromino();

        //發送更新事件
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
            this.Updated.emit(UpdateEnum.GameOver);
        }
    }

    //重力下落
    private checkGravityDrop(deltaTime: number): boolean {

        //重力計時器
        this.gravityCounter += deltaTime;

        //如果重力計時器小於週期，則不進行下落
        if (this.gravityCounter < this.gravityPeriod) {
            return false;
        }

        //重置秒計時器
        this.gravityCounter = 0;
        return true;
    }

    //在新放置的方塊區域，檢查是否有滿行，並消除，上方的方塊下降，並回傳消除的行數
    private checkClearLines(): number {
        let clearLines = 0;
        for (let y = 0; y < this.board.length; y++) {
            if (this.board[y].every(cell => cell != 0)) {
                this.board.splice(y, 1);
                this.board.unshift(new Array(this.board[0].length).fill(0));
                clearLines++;
            }
        }
        return clearLines;
    }

    //得到下一個方塊
    private getNextTetromino(): Tetromino {
        if (this.TetrominoBag.length == 0) {
            this.shuffleBag();
        }
        return this.TetrominoBag.pop();
    }
}


export { Tetromino };

