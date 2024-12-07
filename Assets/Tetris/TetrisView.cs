using System;
using System.Collections.Generic;
using UnityEngine;

public class TetrisView : MonoBehaviour
{
    public GameObject tetrominoUnit;
    public Tetris model;
    public int previewOpacity = 127;
    public float sizeWidth = 5.12f;
    public List<TShape> NextQueueStr = new List<TShape>();
    public List<GameObject> NextQueueView = new List<GameObject>();

    private Queue<Tetromino> _nextQueue = new Queue<Tetromino>();
    private GameObject[][] viewBoard;
    [SerializeField] private float previewScale;
    private void Awake()
    {
        model.BoardUpdated += OnBoardUpdate;
        model.NextQueueUpdated += OnNextQueueUpdate;

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
            GameObject temp = Instantiate(tetrominos[i].gameObject, NextQueueView[i].transform);
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
        int[][] previewBoard = new int[board.Length][];
        for (int i = 0; i < board.Length; i++)
        {
            previewBoard[i] = new int[board[i].Length];
            Array.Copy(board[i], previewBoard[i], board[i].Length);
        }
        for (int y = 0; y < handlingTetromino.Shape.GetLength(0); y++)
        {
            for (int x = 0; x < handlingTetromino.Shape.GetLength(1); x++)
            {
                if (handlingTetromino.Shape[y, x] != 0)
                {
                    int nx = handlingTetromino.Position.x + x;
                    int ny = handlingTetromino.Position.y + y;
                    if (nx < 0 || nx >= previewBoard[0].Length) continue;
                    if (ny < 0 || ny >= previewBoard.Length) continue;
                    previewBoard[ny][nx] = handlingTetromino.Shape[y, x];
                }
            }
        }

        Tetromino dropPreviewTetromino = new Tetromino(handlingTetromino);
        while (dropPreviewTetromino.TryMove(board, Vector2Int.down)) { }

        for (int y = 0; y < dropPreviewTetromino.Shape.GetLength(0); y++)
        {
            for (int x = 0; x < dropPreviewTetromino.Shape.GetLength(1); x++)
            {
                int previewX = dropPreviewTetromino.Position.x + x;
                int previewY = dropPreviewTetromino.Position.y + y;
                if (previewX < 0 || previewX >= previewBoard[0].Length) continue;
                if (previewY < 0 || previewY >= previewBoard.Length) continue;

                if (dropPreviewTetromino.Shape[y, x] != 0 && previewBoard[previewY][previewX] == 0)
                {
                    previewBoard[previewY][previewX] = -1;
                }
            }
        }

        return previewBoard;
    }

    void OnDestroy()
    {
        model.NextQueueUpdated -= OnNextQueueUpdate;
        model.BoardUpdated -= OnBoardUpdate;
    }
}
