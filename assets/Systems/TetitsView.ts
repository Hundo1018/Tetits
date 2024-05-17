import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { TetitsModel, UpdateEnum,Tetromino } from './TetitsModel';
const { ccclass, property } = _decorator;

@ccclass('TetitsView')
export class TetitsView extends Component {

    @property(Prefab)
    tetrominoPrefab: Prefab = null!;

    @property(TetitsModel)
    model: TetitsModel = null!;
    
    ViewBoard: Node[][] = [];

    start() {
        this.model.Updated.on(UpdateEnum.BoardUpdate,this.onBoardUpdate, this);

        for (let y = 0; y < this.model.size.height; y++) {
            for (let x = 0; x < this.model.size.width; x++) {
                if (this.ViewBoard[y] == undefined) {
                    this.ViewBoard[y] = [];
                }
                if (this.ViewBoard[y][x] == undefined) {
                    this.ViewBoard[y][x] = instantiate(this.tetrominoPrefab);
                    this.ViewBoard[y][x].setParent(this.node);
                    this.ViewBoard[y][x].setPosition(x * 32, -y * 32);
                    this.ViewBoard[y][x].active = false;
                }
            }
        }
    }

    update(deltaTime: number) {

    }
    private onBoardUpdate(board: number[][], handlingTetromino: Tetromino,  thisArg: this): void {
        
        let previewBoardArr = this.previewBoard(board, handlingTetromino);
        for (let y = 0; y < previewBoardArr.length; y++) {
            for (let x = 0; x < previewBoardArr[y].length; x++) {
                if (previewBoardArr[y][x] == 0) {
                    this.ViewBoard[y][x].active = false;
                } else {
                    this.ViewBoard[y][x].active = true;
                }
            }
        }
    }

    private previewBoard(board:number[][], handlingTetromino:Tetromino):number[][] {
        let boardOutPut: String = "";
        let previewBoard = board.map(innerboard => [...innerboard]);
        handlingTetromino.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell != 0) {
                    previewBoard
                    [handlingTetromino.position.y + y]
                    [handlingTetromino.position.x + x] = cell;
                }
            }, this);
        });
        console.log(boardOutPut);
        return previewBoard;
    }

    protected onDestroy(): void {
        this.model.Updated.off(UpdateEnum.BoardUpdate,this.onBoardUpdate,this);
    }
}


