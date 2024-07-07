import { _decorator, Button, Component, director, Node } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('MenuController')
@menu('Scene-MainMenu')
export class MenuController extends Component {
    // page nodes
    @property(Node) private newGamePage?: Node;
    @property(Node) private cgPage?: Node;
    @property(Node) private setPage?: Node;
    @property(Node) private mainPage?: Node;

    // main page buttons
    @property(Button) private newGameBTN?: Button;
    @property(Button) private cgBTN?: Button;
    @property(Button) private setBTN?: Button;
    @property(Button) private exitBTN?: Button;

    // pages back buttons
    @property([Button]) private backBTN: Button[] = [];

    // new game page button
    @property(Button) private startBTN?: Button;

    start() {
        // main page
        this.setupButton(this.newGameBTN, () => this._showPage(this.newGamePage));
        this.setupButton(this.setBTN, () => this._showPage(this.setPage));
        this.setupButton(this.cgBTN, () => this._showPage(this.cgPage));
        this.setupButton(this.exitBTN, this.onQuitGame);
        this.backBTN.forEach((btn) =>
            this.setupButton(btn, () => this._showPage(this.mainPage))
        );

        // new game page
        this.setupButton(this.startBTN, () => {
            director.loadScene('scene-dialogue');
        });
    }

    setupButton(button: Button | undefined, callback: () => void) {
        button?.node.on('click', callback, this);
    }

    private _showPage(page?: Node) {
        if (page) {
            this.newGamePage!.active = false;
            this.cgPage!.active = false;
            this.setPage!.active = false;
            this.mainPage!.active = false;
            page.active = true;
        }
    }

    onQuitGame() {
        console.log('退出遊戲');
    }
}
