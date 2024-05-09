import { _decorator, Component, Event, EventKeyboard, EventTarget, EventTouch, input, Input, KeyCode, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum IntentEnum {
    RotateL,
    RotateR,
    MoveLeft,
    MoveRight,
    SoftDrop,
    HardDrop,
    Hold,
    Update,
}
@ccclass('Intents')
export class Intents extends Component {
    public PlayerIntent: EventTarget = new EventTarget();

    onLoad(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                this.PlayerIntent.emit(IntentEnum.MoveLeft);
                break;
            case KeyCode.ARROW_RIGHT:
                this.PlayerIntent.emit(IntentEnum.MoveRight);
                break;
            case KeyCode.ARROW_DOWN:
                this.PlayerIntent.emit(IntentEnum.SoftDrop);
                break;
            case KeyCode.SPACE:
                this.PlayerIntent.emit(IntentEnum.HardDrop);
                break;
            case KeyCode.KEY_Z:
                this.PlayerIntent.emit(IntentEnum.RotateL);
                break;
            case KeyCode.KEY_C:
                this.PlayerIntent.emit(IntentEnum.RotateR);
                break;
            case KeyCode.ARROW_UP:
                this.PlayerIntent.emit(IntentEnum.Hold);
                break;
        }
    }
    onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }
}


