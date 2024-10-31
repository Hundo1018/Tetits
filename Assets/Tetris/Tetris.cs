using System;
using System.Linq;
using UnityEngine;
using UnityEngine.InputSystem;



public class Tetris : MonoBehaviour, Intents.ITetrisControlsActions
{
    public event Action<int[][], Tetromino> BoardUpdated = delegate { };
    public event Action<int> LineCleared = delegate { };
    public event Action<int[][], Tetromino> TetrominoPlaced = delegate { };
    public event Action<int[][]> GameOver = delegate { };
    // public event Action<int> T = delegate { };
    private Intents _controls;

    public float lockDelayTimerMax = 1f;
    public float lockDelayTimer;
    public bool isDelayLocking = false;

    public float gravityPeriod = 1f;
    public float gravityTimer = 0f;

    public Vector2Int size = new(10, 20);

    /// <summary>
    /// 棋盤只放已固定的形狀
    /// </summary>
    public int[][] matrix = new int[20][];

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
        matrix = new int[size.y][];
        for (int i = 0; i < size.y; i++)
        {
            matrix[i] = new int[size.x];
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

    private void Start()
    {
    }

    void Update()
    {

        //更新棋盤
        BoardUpdated.Invoke(matrix, HandlingTetromino);

        //時間到了就進行重力下落
        if (CheckGravityDrop(Time.deltaTime))
            //移動失敗就進行延遲鎖定計時
            isDelayLocking = !HandlingTetromino.TryMove(matrix, Vector2Int.down);

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
                TetrominoPlaced.Invoke(matrix, HandlingTetromino);
            else
                GameOver.Invoke(matrix);
        }

        if (CheckClearLines(out int clearLines))
        {
            LineCleared.Invoke(clearLines);
        }

        BoardUpdated.Invoke(matrix, HandlingTetromino);
    }



    private bool TryPlaceTetromino(Tetromino tetromino)
    {
        //判斷是否可以放在該處
        if (tetromino.IsLegal(matrix, tetromino.Position))
        {
            //設定數值
            for (int y = 0; y < tetromino.Shape.GetLength(0); y++)
            {
                for (int x = 0; x < tetromino.Shape.GetLength(1); x++)
                {
                    if (tetromino.Shape[y, x] != 0)
                    {
                        matrix[tetromino.Position.y + y][tetromino.Position.x + x] = tetromino.Shape[y, x];
                    }
                }
            }
            return true;
        }
        return false;
    }

    private bool CheckGravityDrop(float deltaTime)
    {
        gravityTimer += deltaTime;
        if (gravityTimer < gravityPeriod) return false;
        gravityTimer = 0;
        return true;
    }

    //清行
    private bool CheckClearLines(out int clearLines)
    {
        clearLines = 0;
        //從最上方往下掃
        for (int y = matrix.Length - 1; y >= 0; y--)
        {
            //某一行非0
            if (matrix[y].All(cell => cell != 0))
            {
                //該行以上全部往下移動一行
                for (int i = y; i < matrix.Length - 1; i++)
                {
                    matrix[i] = (int[])matrix[i + 1].Clone();
                }
                matrix[^1] = new int[size.x];
                clearLines++;
            }
        }
        return clearLines > 0;
    }

    private Tetromino GetNextTetromino()
    {
        if (_tetrominoBag.Length == 0)
        {
            ShuffleBag();
        }
        Tetromino nextTetromino = _tetrominoBag.Last();
        _tetrominoBag = _tetrominoBag.Take(_tetrominoBag.Length - 1).ToArray();
        nextTetromino.Position = new Vector2Int(matrix[0].Length / 2 - 1, matrix.Length - 3);
        return nextTetromino;
    }

    public void OnMove(InputAction.CallbackContext context)
    {
        if (context.phase != InputActionPhase.Performed)
            return;
        float axis = context.ReadValue<float>();
        if (axis > 0) HandlingTetromino.TryMove(matrix, Vector2Int.right);
        else if (axis < 0) HandlingTetromino.TryMove(matrix, Vector2Int.left);
        else return;
    }

    public void OnRotate(InputAction.CallbackContext context)
    {
        if (context.phase != InputActionPhase.Performed)
            return;
        float axis = context.ReadValue<float>();
        if (axis > 0) HandlingTetromino.TryRotate(matrix, true);
        else if (axis < 0) HandlingTetromino.TryRotate(matrix, false);
        else return;
    }

    public void OnHold(InputAction.CallbackContext context)
    {
        throw new NotImplementedException();
    }

    public void OnHardDrop(InputAction.CallbackContext context)
    {
        HandlingTetromino.HardDrop(matrix);
    }

    public void OnSoftDrop(InputAction.CallbackContext context)
    {
        HandlingTetromino.TryMove(matrix, Vector2Int.down);
    }
}
