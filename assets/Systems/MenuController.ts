import { _decorator, Button, Component, Node,  } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('MenuController')
@menu('Sence-MainMenu')
export class MenuController extends Component {

    @property([Node])
    newGamePage = null;

    @property([Node])
    cgGalleryPage = null;

    @property([Node])
    settingPage = null;

    @property([Node])
    mainPage = null;

    @property([Button])
    newGameBTN = null;

    @property([Button])
    cgGalleryBTN = null;

    @property([Button])
    settingBTN = null;

    @property([Button])
    exitGameBTN = null;

    start() {

    }

    protected onLoad(): void {
        this.newGameBTN.on('')
    }

    update(deltaTime: number) {
        
    }
}


