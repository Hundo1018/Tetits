import { _decorator, CCFloat, CCInteger, Component, ProgressBar, EventTarget } from 'cc';
import { TetitsModel, UpdateEnum } from './TetitsModel';
const { ccclass, property } = _decorator;

@ccclass('StageController')
export class StageController extends Component {
    public StageChanged: EventTarget = new EventTarget();
    @property(TetitsModel)
    public model: TetitsModel = null!;

    //Combo的計時器，單位為秒
    @property(CCFloat)
    public comboTimerMax: number = 1;
    private comboTimer: number = this.comboTimerMax;
    private isComboing = false;
    private comboCounter: number = 0;

    // TODO: 加入Timer顯示Combo剩餘時間
    // @property(TimerBar)
    // public timer = null!;

    @property([CCInteger])
    public stageRequireLines = [];
    private stageRequireTotal = 0;


    @property([ProgressBar])
    public progressBars: ProgressBar[] = [];

    private currentStage = 0;
    start() {
        this.stageRequireLines.forEach((x) => { this.stageRequireTotal += x; });

        this.model.Updated.on(UpdateEnum.ClearLines, this.onClearLines, this);
        this.model.Updated.on(UpdateEnum.PlaceTetromino, this.onPlaceTetromino, this);
    }

    //進行連擊結算
    private comboEnded(combo: number) {
        console.log(combo + ' 發射!!');
        this.stageRequireLines[this.currentStage] -= combo;
        if (this.stageRequireLines[this.currentStage] <= 0) {
            this.stageRequireLines[this.currentStage] = 0;
            this.progressBars[this.currentStage].progress = 0;
            this.currentStage += 1;
            let isGmaeStageDone: boolean = this.currentStage > this.stageRequireLines.length;
            this.StageChanged.emit(this.currentStage,isGmaeStageDone);
        }
        let subtotal = 0;
        this.stageRequireLines.forEach((x) => { subtotal += x; });

        //TODO: 使用Tween漸變
        this.progressBars[this.currentStage].progress = (subtotal / this.stageRequireTotal);

    }


    private comboTick(deltaTime: number) {
        if (!this.isComboing) {
            this.comboTimer = this.comboTimerMax;
            return;
        }
        this.comboTimer -= deltaTime;
        if (this.comboTimer <= 0) {
            this.comboEnded(this.comboCounter);
            this.isComboing = false;
            this.comboTimer = 0;
            this.comboCounter = 0;
        }
        console.log('combo 剩餘 ' + this.comboTimer);
    }

    private onClearLines(clearLines: number) {
        //根據消行數提供額外的combo緩衝時間
        let bonusTime = 0.25 * clearLines;

        //Combo後續
        if (this.isComboing) {
            this.comboCounter += clearLines;
            //增加緩衝時間, TODO:或許可以使用重置時間，但必須考慮原本的起始時間就已經大於Max，會導致重置後反而時間更少 
            this.comboTimer += bonusTime;
            console.log('combo 累積 ' + this.comboCounter)
        }
        //Combo第一下
        else {
            this.comboTimer = this.comboTimerMax + bonusTime;

            this.isComboing = true;
            this.comboCounter = clearLines;
            console.log('combo 啟動! ' + this.comboCounter + ' 下 ' + this.comboTimer + '秒');
        }
    }

    private onPlaceTetromino() {
        //TODO: TetitsModel.ts可能未emit, 如果有需要再補齊
    }
    update(deltaTime: number) {
        this.comboTick(deltaTime);
    }

    protected onDestroy(): void {
        this.model.Updated.off(UpdateEnum.ClearLines, this.onClearLines, this);
        this.model.Updated.off(UpdateEnum.PlaceTetromino, this.onPlaceTetromino, this);
    }
}


