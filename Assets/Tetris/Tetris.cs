using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using Unity.VisualScripting.Dependencies.NCalc;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.TextCore;


public class Tetris : MonoBehaviour, Intents.ITetrisControlsActions
{
    public event Action<int[][], Tetromino> BoardUpdated = delegate { };
    public event Action<int> LineCleared = delegate { };
    public event Action<int[][], Tetromino> TetrominoPlaced = delegate { };
    public event Action<int[][]> GameOver = delegate { };

    private Intents _controls;

    public float lockDelayTimerMax = 1f;
    public float lockDelayTimer;
    public bool isDelayLocking = false;

    public float gravityPeriod = 1f;
    public float gravityCounter = 0f;

    public Vector2Int size = new(10, 20);

    /// <summary>
    /// 棋盤只放已固定的形狀
    /// </summary>
    public int[][] board = new int[20][];
    public string DebugBoard = "00000\r\n000000";

    private Tetromino[] _tetrominoBag = new Tetromino[7];

    public Tetromino HandlingTetromino;

    private void OnDisable()
    {
        _controls.Disable();
    }

    private void OnEnable()
    {
        _controls.Enable();
    }

    void Awake()
    {
        _controls = new Intents();
        _controls.TetrisControls.SetCallbacks(this);
        lockDelayTimer = lockDelayTimerMax;
        board = new int[size.y][];
        for (int i = 0; i < size.y; i++)
        {
            board[i] = new int[size.x];
        }
        TetrominoPlaced += (board, tetromino) =>
        {
            HandlingTetromino = GetNextTetromino();
        };

        ShuffleBag();
        HandlingTetromino = GetNextTetromino();
    }

    private void ShuffleBag()
    {
        Tetromino T = new(new int[,] {
            {0, 1, 0},
            {1, 1, 1},
            {0, 0, 0},
        });
        Tetromino I = new(new int[,] {
            {0, 0, 0, 0},
            {1, 1, 1, 1},
            {0, 0, 0, 0},
            {0, 0, 0, 0},
        });
        Tetromino O = new(new int[,] {
            {1, 1},
            {1, 1},
        });
        Tetromino L = new(new int[,] {
            {0, 0, 0},
            {1, 1, 1},
            {1, 0, 0},
        });
        Tetromino J = new(new int[,] {
            {0, 0, 0},
            {1, 1, 1},
            {0, 0, 1},
        });
        Tetromino S = new(new int[,] {
            {0, 0, 0},
            {0, 1, 1},
            {1, 1, 0},
        });
        Tetromino Z = new(new int[,] {
            {0, 0, 0},
            {1, 1, 0},
            {0, 1, 1},
        });
        _tetrominoBag = new Tetromino[] { T, I, O, L, J, S, Z };
        System.Random rng = new();
        _tetrominoBag = _tetrominoBag.OrderBy(x => rng.Next()).ToArray();
    }

    void Update()
    {
        //更新棋盤
        BoardUpdated.Invoke(board, HandlingTetromino);

        //時間到了就進行重力下落
        if (CheckGravityDrop(Time.deltaTime))
            //移動失敗就進行延遲鎖定計時
            isDelayLocking = !HandlingTetromino.TryMove(board, Vector2Int.down);

        //不需要延遲鎖定就提前結束
        if (isDelayLocking)
            lockDelayTimer -= Time.deltaTime;
        else
            lockDelayTimer = lockDelayTimerMax;

        if (isDelayLocking && lockDelayTimer <= 0)
        {
            isDelayLocking = false;
            lockDelayTimer = lockDelayTimerMax;
            // 置放
            if (TryPlaceTetromino(HandlingTetromino))
                TetrominoPlaced.Invoke(board, HandlingTetromino);
            else
                GameOver.Invoke(board);
        }

        int clearLines = CheckClearLines();
        if (clearLines > 0)
        {
            LineCleared.Invoke(clearLines);
        }

        BoardUpdated.Invoke(board, HandlingTetromino);
    }



    private bool TryPlaceTetromino(Tetromino tetromino)
    {
        //判斷是否可以放在該處
        if (tetromino.IsLegal(board, tetromino.Position))
        {
            //設定數值
            for (int y = 0; y < tetromino.Shape.GetLength(0); y++)
            {
                for (int x = 0; x < tetromino.Shape.GetLength(1); x++)
                {
                    if (tetromino.Shape[y, x] != 0)
                    {
                        board[tetromino.Position.y + y][tetromino.Position.x + x] = tetromino.Shape[y, x];
                    }
                }
            }
            return true;
        }
        return false;
    }

    private bool CheckGravityDrop(float deltaTime)
    {
        gravityCounter += deltaTime;
        if (gravityCounter < gravityPeriod) return false;
        gravityCounter = 0;
        return true;
    }

    private int CheckClearLines()
    {
        int clearLines = 0;
        for (int y = 0; y < board.Length; y++)
        {
            if (board[y].All(cell => cell != 0))
            {
                for (int i = y; i > 0; i--)
                {
                    board[i] = (int[])board[i - 1].Clone();
                }
                board[0] = new int[size.x];
                clearLines++;
            }
        }
        return clearLines;
    }

    private Tetromino GetNextTetromino()
    {
        if (_tetrominoBag.Length == 0)
        {
            ShuffleBag();
        }
        Tetromino nextTetromino = _tetrominoBag.Last();
        _tetrominoBag = _tetrominoBag.Take(_tetrominoBag.Length - 1).ToArray();
        nextTetromino.Position = new Vector2Int(board[0].Length / 2 - 1, board.Length - 3);
        return nextTetromino;
    }

    public void OnMove(InputAction.CallbackContext context)
    {
        if (context.phase != InputActionPhase.Performed)
            return;
        float axis = context.ReadValue<float>();
        if (axis > 0) HandlingTetromino.TryMove(board, Vector2Int.right);
        else if (axis < 0) HandlingTetromino.TryMove(board, Vector2Int.left);
        else return;
    }

    public void OnRotate(InputAction.CallbackContext context)
    {
        print(context);
        if (context.phase != InputActionPhase.Performed)
            return;
        float axis = context.ReadValue<float>();
        if (axis > 0) HandlingTetromino.TryRotate(board, true);
        else if (axis < 0) HandlingTetromino.TryRotate(board, false);
        else return;
    }

    public void OnHold(InputAction.CallbackContext context)
    {
        throw new NotImplementedException();
    }

    public void OnHardDrop(InputAction.CallbackContext context)
    {
        HandlingTetromino.HardDrop(board);
    }

    public void OnSoftDrop(InputAction.CallbackContext context)
    {
        HandlingTetromino.TryMove(board, Vector2Int.down);
    }
}
