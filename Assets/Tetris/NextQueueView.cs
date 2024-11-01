using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class NextQueueView : MonoBehaviour
{
    public Tetris model;
    public List<string> NextQueueStr = new List<string>();
    private Queue<Tetromino> _nextQueue = new Queue<Tetromino>();
    // Start is called before the first frame update
    void Start()
    {
        _nextQueue = model.NextQueue;
        
    }

    // Update is called once per frame
    void Update()
    {
        NextQueueStr = new List<string>();
        foreach (var item in _nextQueue)
        {
            NextQueueStr.Add(item.Alias);
        }
    }
}
