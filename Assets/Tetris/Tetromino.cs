using UnityEngine;

public class Tetromino
{
    public int[,] Shape;
    public Vector2Int Position = Vector2Int.zero;
    public string Alias = "";

    public Tetromino(int[,] shape, string Alias = "")
    {
        this.Alias = Alias;
        Shape = new int[shape.GetLength(0), shape.GetLength(1)];
        for (int i = 0; i < shape.GetLength(0); i++)
        {
            for (int j = 0; j < shape.GetLength(1); j++)
            {
                Shape[i, j] = shape[i, j];
            }
        }
    }

    public Tetromino(Tetromino clone) : this(clone.Shape)
    {
        Position = new Vector2Int(clone.Position.x, clone.Position.y);
        Alias = clone.Alias;
    }


    /// <summary>
    /// 嘗試旋轉, 成功則回傳True, 失敗回傳False
    /// </summary>
    /// <param name="matrix">棋盤</param>
    /// <param name="clockwise">True -> 順時針旋轉, False 逆時針旋轉</param>
    /// <returns></returns>
    public bool TryRotate(in int[][] matrix, bool clockwise)
    {
        //複製一個暫時性的方塊用來測試旋轉是否合法
        Tetromino nextShape = new Tetromino(Shape);
        nextShape.Shape = Rotate(nextShape.Shape, clockwise);

        if (nextShape.IsLegal(matrix, Position))
        {
            Shape = nextShape.Shape;
            return true;
        }
        //TODO: 待驗證
        else if (WallKick(matrix, nextShape.Shape))
        {
            return true;
        }
        return false;
    }

    /// <summary>
    /// 嘗試移動, 如果有移動成功回傳True
    /// </summary>
    /// <param name="matrix"></param>
    /// <param name="vec"></param>
    /// <returns></returns>
    public bool TryMove(in int[][] matrix, Vector2Int vec)
    {
        Vector2Int nextPosition = Position + vec;
        if (IsLegal(matrix, nextPosition))
        {
            Position = nextPosition;
            return true;
        }
        return false;
    }

    /// <summary>
    /// 旋轉並回傳新的矩陣
    /// </summary>
    /// <param name="shape">傳入形狀矩陣</param>
    /// <param name="clockwise">T -> 順時針, F -> 逆時針</param>
    /// <returns></returns>
    private int[,] Rotate(int[,] shape, bool clockwise)
    {
        int[,] newMatrix = (int[,])shape.Clone();
        int n = newMatrix.GetLength(0);
        for (int i = 0; i < n / 2; i++)
        {
            for (int j = i; j < n - i - 1; j++)
            {
                if (clockwise)
                {
                    int temp = newMatrix[i, j];
                    newMatrix[i, j] = newMatrix[n - j - 1, i];
                    newMatrix[n - j - 1, i] = newMatrix[n - i - 1, n - j - 1];
                    newMatrix[n - i - 1, n - j - 1] = newMatrix[j, n - i - 1];
                    newMatrix[j, n - i - 1] = temp;
                }
                else
                {
                    int temp = newMatrix[i, j];
                    newMatrix[i, j] = newMatrix[j, n - i - 1];
                    newMatrix[j, n - i - 1] = newMatrix[n - i - 1, n - j - 1];
                    newMatrix[n - i - 1, n - j - 1] = newMatrix[n - j - 1, i];
                    newMatrix[n - j - 1, i] = temp;
                }
            }
        }
        return newMatrix;
    }

    /// <summary>
    /// 快速下落
    /// </summary>
    /// <param name="board"></param>
    public void HardDrop(in int[][] board)
    {
        while (IsLegal(board, Position + Vector2Int.down))
        {
            Position += Vector2Int.down;
        }
    }

    /// <summary>
    /// 牆踢(直接編輯)
    /// </summary>
    /// <param name="board"></param>
    /// <param name="nextShape">形狀</param>
    /// <returns>成功與否</returns>
    private bool WallKick(in int[][] board, int[,] nextShape)
    {
        Vector2Int[] wallKickTests = {
            new Vector2Int(-1, 0),
            new Vector2Int(1, 0),
            new Vector2Int(0, -1),
            new Vector2Int(0, 1),
            new Vector2Int(-1, -1),
            new Vector2Int(1, -1),
            new Vector2Int(-1, 1),
            new Vector2Int(1, 1)
        };

        foreach (var test in wallKickTests)
        {
            if (IsLegal(board, Position + test))
            {
                Shape = nextShape;
                Position += test;
                return true;
            }
        }
        return false;
    }

    /// <summary>
    /// 判斷這個方塊是否可以放在特定位置
    /// </summary>
    /// <param name="board"></param>
    /// <param name="position"></param>
    /// <returns></returns>
    public bool IsLegal(in int[][] board, Vector2Int position)
    {
        for (int y = 0; y < Shape.GetLength(0); y++)
        {
            for (int x = 0; x < Shape.GetLength(1); x++)
            {
                if (Shape[y, x] != 0)
                {
                    int boardX = position.x + x;
                    int boardY = position.y + y;
                    if (boardX < 0 || boardX >= board[0].Length
                     || boardY < 0 || boardY >= board.Length
                     || board[boardY][boardX] != 0)
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
