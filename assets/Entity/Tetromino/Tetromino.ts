import { Vec2 } from "cc";

export class Tetromino {
    //4x4的方塊，0為空
    public shape: number[][] = []
    //方塊的位置，LeftTop為(0,0)
    public position: Vec2 = new Vec2(0, 0);
    //方塊的盤面，0為空
    private board: number[][] = [];


    public constructor(shape: number[][], board: number[][]) {

        if (board.length < 10 || board[0].length < 10) {
            throw new Error("Board must be at least 10x10");
        }
        this.shape = shape;
        this.board = board;
    }



    //嘗試旋轉方塊，如果成功則旋轉並回傳true，否則回傳false
    public tryRotateL(): boolean {
        return this.tryRotate(false);
    }

    //嘗試旋轉方塊，如果成功則旋轉並回傳true，否則回傳false
    public tryRotateR(): boolean {
        return this.tryRotate(true);
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

    private rotate(matrix: number[][],clockwise:boolean): void {
        const n: number = matrix.length;
        let width: number = n - 1;
    
        for (let i = 0; i < Math.floor(n / 2); i++) {
            for (let j = i; j < i + width; j++) {
                if (clockwise) {
                    const temp: number = matrix[i][j];
                    matrix[i][j] = matrix[n - j - 1][i];
                    matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1];
                    matrix[n - i - 1][n - j - 1] = matrix[j][n - i - 1];
                    matrix[j][n - i - 1] = temp;
                } else {
                    const temp: number = matrix[i][j];
                    matrix[i][j] = matrix[j][n - i - 1];
                    matrix[j][n - i - 1] = matrix[n - i - 1][n - j - 1];
                    matrix[n - i - 1][n - j - 1] = matrix[n - j - 1][i];
                    matrix[n - j - 1][i] = temp;
                }
            }
            width -= 2;
        }
    }

    //嘗試旋轉方塊，如果失敗則進行WallKick檢查，如果還是失敗則不旋轉
    private tryRotate(clockwise: boolean): boolean {

        let nextShape = this.shape.map(inner => [...inner]);
        this.rotate(nextShape,clockwise);
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
        let wallKickData: Vec2[][] = [
            [new Vec2(0, 0), new Vec2(-1, 0), new Vec2(-1, 1), new Vec2(0, -2), new Vec2(-1, -2)],
            [new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, -1), new Vec2(0, 2), new Vec2(1, 2)],
            [new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, 1), new Vec2(0, -2), new Vec2(1, -2)],
            [new Vec2(0, 0), new Vec2(-1, 0), new Vec2(-1, -1), new Vec2(0, 2), new Vec2(-1, 2)],
        ];
        for (let i = 0; i < wallKickData.length; i++) {
            for (let j = 0; j < wallKickData[i].length; j++) {
                let wallKick = wallKickData[i][j];
                let nextPosition = this.position.clone().add(wallKick);
                if (this.isLegal(nextShape, nextPosition)) {
                    this.position = nextPosition;
                    this.shape = nextShape;
                    return true;
                }
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