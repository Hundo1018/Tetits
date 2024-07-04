import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StageBar')
export class StageBar extends Component {
    @property(ProgressBar)
    public progressBar:ProgressBar = null!;

    start() {

    }

    update(deltaTime: number) {
        
    }

    public changeProgress(progress:number){
        //TODO: 使用tween漸變
        this.progressBar.progress = progress;
    }
}


