using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class TetrisView : MonoBehaviour
{
    public GameObject tetrominoUnit;
    public Tetris model;
    public int previewOpacity = 127;
    public float sizeWidth = 5.12f;
    public List<TShape> NextQueueStr = new List<TShape>();
    public List<GameObject> NextQueueView = new List<GameObject>();
    public Image LockDelayTimerBar;
    private Queue<Tetromino> _nextQueue = new Queue<Tetromino>();
    private GameObject[][] viewBoard;
    [SerializeField] private float previewScale;
    private void Awake()
    {
        model.BoardUpdated += OnBoardUpdate;
        model.BoardUpdated += OnHandlingTetrominoUpdate;
        model.NextQueueUpdated += OnNextQueueUpdate;
        model.LockDelayUpdated += OnLockDelayTimerUpdate;

    }

    private void OnHandlingTetrominoUpdate(int[][] board, Tetromino tetromino)
    {
        Vector2Int lockDelayShowIndex = new Vector2Int(tetromino.Position.x + 1, tetromino.Position.y + 1);
        LockDelayTimerBar.transform.position = Camera.main.WorldToScreenPoint(viewBoard[lockDelayShowIndex.y][lockDelayShowIndex.x].transform.position);
    }

    private void OnLockDelayTimerUpdate(float timeMax, float timeRemain, bool isDelayLocking)
    {
        LockDelayTimerBar.fillAmount = timeRemain / timeMax;
        // LockDelayTimerBar.gameObject.SetActive(isDelayLocking);
    }

    void Start()
    {
        _nextQueue = model.NextQueue;
        InitializeViewBoard();
    }

    private void OnNextQueueUpdate(List<Tetromino> tetrominos)
    {
        for (int i = 0; i < NextQueueView.Count; i++)
        {
            if (NextQueueView[i].transform.childCount > 0)
                Destroy(NextQueueView[i].transform.GetChild(0).gameObject);
            Vector3 newPosition = new Vector3(NextQueueView[i].transform.position.x, NextQueueView[i].transform.position.y, 2);
            GameObject temp = Instantiate(tetrominos[i].gameObject, newPosition, Quaternion.identity);
            temp.transform.localScale = temp.transform.localScale * previewScale;
            temp.transform.SetParent(NextQueueView[i].transform);
        }
    }

    void InitializeViewBoard()
    {
        viewBoard = new GameObject[model.size.y][];
        float totalWidth = model.size.x * sizeWidth;
        float paddingX = -totalWidth / 2 + sizeWidth / 2;
        float paddingY = -model.size.y * sizeWidth / 2 + sizeWidth / 2;
        for (int y = 0; y < model.size.y; y++)
        {
            viewBoard[y] = new GameObject[model.size.x];
            for (int x = 0; x < model.size.x; x++)
            {
                float positionX = paddingX + x * sizeWidth;
                float positionY = paddingY + y * sizeWidth;

                viewBoard[y][x] = Instantiate(tetrominoUnit, transform);
                viewBoard[y][x].transform.localPosition = new Vector3(positionX, positionY, 0);
                viewBoard[y][x].SetActive(false);
            }
        }
    }

    void Update()
    {
        // 若有需要每幀更新的內容，可以在這裡添加
    }

    void OnBoardUpdate(int[][] board, Tetromino handlingTetromino)
    {

        int[][] previewBoardArr = PreviewBoard(board, handlingTetromino);
        for (int y = 0; y < previewBoardArr.Length; y++)
        {
            for (int x = 0; x < previewBoardArr[y].Length; x++)
            {
                if (previewBoardArr[y][x] == 0)
                {
                    viewBoard[y][x].SetActive(false);
                }
                else
                {
                    viewBoard[y][x].SetActive(true);
                    var opacity = viewBoard[y][x].GetComponent<SpriteRenderer>().color;
                    opacity.a = previewBoardArr[y][x] < 0 ? previewOpacity / 255f : 1f;
                    viewBoard[y][x].GetComponent<SpriteRenderer>().color = opacity;
                }
            }
        }
    }

    int[][] PreviewBoard(int[][] board, Tetromino handlingTetromino)
    {
        // var flipTetromino = new Tetromino(handlingTetromino);
        // int len = flipTetromino.Shape.Length - 1;
        // int halfLen = len / 2;
        // for (int i = 0; i <= halfLen; i++)
        // {
        //     (flipTetromino.Shape[len - i], flipTetromino.Shape[i]) = (flipTetromino.Shape[i], flipTetromino.Shape[len - i]);
        // }
        // handlingTetromino = flipTetromino;
        var newBoard = ProjectOnBoard(board, handlingTetromino, false);

        Tetromino dropPreviewTetromino = new(handlingTetromino);

        dropPreviewTetromino.HardDrop(board);
        return ProjectOnBoard(newBoard, dropPreviewTetromino, true);
    }

    private int[][] ProjectOnBoard(int[][] board, Tetromino tetromino, bool isPreview)
    {
        int[][] projected = new int[board.Length][];
        for (int i = 0; i < board.Length; i++)
        {
            projected[i] = new int[board[i].Length];
            Array.Copy(board[i], projected[i], board[i].Length);
        }
        for (int y = 0; y < tetromino.Shape.Length; y++)
        {
            for (int x = 0; x < tetromino.Shape[0].Length; x++)
            {
                if (tetromino.Shape[y][x] == 0) continue;
                int previewX = tetromino.Position.x + x;
                int previewY = tetromino.Position.y + y;
                if (previewX < 0 || previewX >= projected[0].Length) continue;
                if (previewY < 0 || previewY >= projected.Length) continue;
                if (isPreview)
                    projected[previewY][previewX] = -1;
                else
                    projected[previewY][previewX] = tetromino.Shape[y][x];
            }
        }
        return projected;
    }

    void OnDestroy()
    {
        model.NextQueueUpdated -= OnNextQueueUpdate;
        model.BoardUpdated -= OnBoardUpdate;
    }
}
