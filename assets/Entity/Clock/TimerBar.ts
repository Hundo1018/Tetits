import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimerBar')
export class TimerBar extends Component {
    @property(ProgressBar)
    public bar:ProgressBar = null!;

    public set(progress:number){
        this.bar.progress = progress;
    }
}


