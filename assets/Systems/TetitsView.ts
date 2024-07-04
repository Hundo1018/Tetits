import { _decorator, CCInteger, color, Color, Component, instantiate, Node, Prefab, Sprite, UIOpacity, Vec2 } from 'cc';
import { TetitsModel, UpdateEnum, Tetromino } from './TetitsModel';
const { ccclass, property } = _decorator;

@ccclass('TetitsView')
export class TetitsView extends Component {

    @property(Prefab)
    tetrominoPrefab: Prefab = null!;

    @property(TetitsModel)
    model: TetitsModel = null!;

    ViewBoard: Node[][] = [];

    @property(CCInteger)
    previewOpacity: Number = 127;

    start() {
        this.model.Updated.on(UpdateEnum.BoardUpdate, this.onBoardUpdate, this);

        for (let y = 0; y < this.model.size.height; y++) {
            for (let x = 0; x < this.model.size.width; x++) {
                if (this.ViewBoard[y] == undefined) {
                    this.ViewBoard[y] = [];
                }

                if (this.ViewBoard[y][x] == undefined) {
                    let positionX: number = x * 32;
                    let positionY: number = -y * 32;

                    this.ViewBoard[y][x] = instantiate(this.tetrominoPrefab);
                    this.ViewBoard[y][x].setParent(this.node);
                    this.ViewBoard[y][x].setPosition(positionX, positionY);
                    this.ViewBoard[y][x].active = false;
                }
            }
        }
    }

    update(deltaTime: number) {

    }
    private onBoardUpdate(board: number[][], handlingTetromino: Tetromino, thisArg: this): void {
        let previewBoardArr = this.previewBoard(board, handlingTetromino);
        for (let y = 0; y < previewBoardArr.length; y++) {
            for (let x = 0; x < previewBoardArr[y].length; x++) {
                if (previewBoardArr[y][x] == 0) {
                    this.ViewBoard[y][x].active = false;
                }
                else {
                    this.ViewBoard[y][x].active = true;
                    if (previewBoardArr[y][x] < 0)
                        this.ViewBoard[y][x].getComponent(UIOpacity).opacity = 127
                    else
                        this.ViewBoard[y][x].getComponent(UIOpacity).opacity = 255
                }
            }
        }
    }

    private previewBoard(board: number[][], handlingTetromino: Tetromino): number[][] {
        
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

        let dropPreviewTetromino = Tetromino.createByCopy(handlingTetromino);
        while (dropPreviewTetromino.tryMove(new Vec2(0,1)));
        dropPreviewTetromino.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                let previewX = dropPreviewTetromino.position.x + x;
                let previewY = dropPreviewTetromino.position.y + y;
                if (cell != 0 && previewBoard[previewY][previewX] == 0) {
                    previewBoard
                    [previewY]
                    [previewX] = -1;
                }
            }, this);
        });

        let str:string = '';
        previewBoard.forEach((row,y)=>{
            str += row + '\n';
        });
        console.log(str);
        return previewBoard;
    }

    protected onDestroy(): void {
        this.model.Updated.off(UpdateEnum.BoardUpdate, this.onBoardUpdate, this);
    }
}


