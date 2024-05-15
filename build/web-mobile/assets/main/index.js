System.register("chunks:///_virtual/debug-view-runtime-control.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Color, Canvas, UITransform, instantiate, Label, RichText, Toggle, Button, director, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Color = module.Color;
      Canvas = module.Canvas;
      UITransform = module.UITransform;
      instantiate = module.instantiate;
      Label = module.Label;
      RichText = module.RichText;
      Toggle = module.Toggle;
      Button = module.Button;
      director = module.director;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "b2bd1+njXxJxaFY3ymm06WU", "debug-view-runtime-control", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var DebugViewRuntimeControl = exports('DebugViewRuntimeControl', (_dec = ccclass('internal.DebugViewRuntimeControl'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(DebugViewRuntimeControl, _Component);
        function DebugViewRuntimeControl() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "compositeModeToggle", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "singleModeToggle", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "EnableAllCompositeModeButton", _descriptor3, _assertThisInitialized(_this));
          _this._single = 0;
          _this.strSingle = ['No Single Debug', 'Vertex Color', 'Vertex Normal', 'Vertex Tangent', 'World Position', 'Vertex Mirror', 'Face Side', 'UV0', 'UV1', 'UV Lightmap', 'Project Depth', 'Linear Depth', 'Fragment Normal', 'Fragment Tangent', 'Fragment Binormal', 'Base Color', 'Diffuse Color', 'Specular Color', 'Transparency', 'Metallic', 'Roughness', 'Specular Intensity', 'IOR', 'Direct Diffuse', 'Direct Specular', 'Direct All', 'Env Diffuse', 'Env Specular', 'Env All', 'Emissive', 'Light Map', 'Shadow', 'AO', 'Fresnel', 'Direct Transmit Diffuse', 'Direct Transmit Specular', 'Env Transmit Diffuse', 'Env Transmit Specular', 'Transmit All', 'Direct Internal Specular', 'Env Internal Specular', 'Internal All', 'Fog'];
          _this.strComposite = ['Direct Diffuse', 'Direct Specular', 'Env Diffuse', 'Env Specular', 'Emissive', 'Light Map', 'Shadow', 'AO', 'Normal Map', 'Fog', 'Tone Mapping', 'Gamma Correction', 'Fresnel', 'Transmit Diffuse', 'Transmit Specular', 'Internal Specular', 'TT'];
          _this.strMisc = ['CSM Layer Coloration', 'Lighting With Albedo'];
          _this.compositeModeToggleList = [];
          _this.singleModeToggleList = [];
          _this.miscModeToggleList = [];
          _this.textComponentList = [];
          _this.labelComponentList = [];
          _this.textContentList = [];
          _this.hideButtonLabel = void 0;
          _this._currentColorIndex = 0;
          _this.strColor = ['<color=#ffffff>', '<color=#000000>', '<color=#ff0000>', '<color=#00ff00>', '<color=#0000ff>'];
          _this.color = [Color.WHITE, Color.BLACK, Color.RED, Color.GREEN, Color.BLUE];
          return _this;
        }
        var _proto = DebugViewRuntimeControl.prototype;
        _proto.start = function start() {
          // get canvas resolution
          var canvas = this.node.parent.getComponent(Canvas);
          if (!canvas) {
            console.error('debug-view-runtime-control should be child of Canvas');
            return;
          }
          var uiTransform = this.node.parent.getComponent(UITransform);
          var halfScreenWidth = uiTransform.width * 0.5;
          var halfScreenHeight = uiTransform.height * 0.5;
          var x = -halfScreenWidth + halfScreenWidth * 0.1,
            y = halfScreenHeight - halfScreenHeight * 0.1;
          var width = 200,
            height = 20;

          // new nodes
          var miscNode = this.node.getChildByName('MiscMode');
          var buttonNode = instantiate(miscNode);
          buttonNode.parent = this.node;
          buttonNode.name = 'Buttons';
          var titleNode = instantiate(miscNode);
          titleNode.parent = this.node;
          titleNode.name = 'Titles';

          // title
          for (var i = 0; i < 2; i++) {
            var newLabel = instantiate(this.EnableAllCompositeModeButton.getChildByName('Label'));
            newLabel.setPosition(x + (i > 0 ? 50 + width * 2 : 150), y, 0.0);
            newLabel.setScale(0.75, 0.75, 0.75);
            newLabel.parent = titleNode;
            var _labelComponent = newLabel.getComponent(Label);
            _labelComponent.string = i ? '----------Composite Mode----------' : '----------Single Mode----------';
            _labelComponent.color = Color.WHITE;
            _labelComponent.overflow = 0;
            this.labelComponentList[this.labelComponentList.length] = _labelComponent;
          }
          y -= height;
          // single
          var currentRow = 0;
          for (var _i = 0; _i < this.strSingle.length; _i++, currentRow++) {
            if (_i === this.strSingle.length >> 1) {
              x += width;
              currentRow = 0;
            }
            var newNode = _i ? instantiate(this.singleModeToggle) : this.singleModeToggle;
            newNode.setPosition(x, y - height * currentRow, 0.0);
            newNode.setScale(0.5, 0.5, 0.5);
            newNode.parent = this.singleModeToggle.parent;
            var textComponent = newNode.getComponentInChildren(RichText);
            textComponent.string = this.strSingle[_i];
            this.textComponentList[this.textComponentList.length] = textComponent;
            this.textContentList[this.textContentList.length] = textComponent.string;
            newNode.on(Toggle.EventType.TOGGLE, this.toggleSingleMode, this);
            this.singleModeToggleList[_i] = newNode;
          }
          x += width;
          // buttons
          this.EnableAllCompositeModeButton.setPosition(x + 15, y, 0.0);
          this.EnableAllCompositeModeButton.setScale(0.5, 0.5, 0.5);
          this.EnableAllCompositeModeButton.on(Button.EventType.CLICK, this.enableAllCompositeMode, this);
          this.EnableAllCompositeModeButton.parent = buttonNode;
          var labelComponent = this.EnableAllCompositeModeButton.getComponentInChildren(Label);
          this.labelComponentList[this.labelComponentList.length] = labelComponent;
          var changeColorButton = instantiate(this.EnableAllCompositeModeButton);
          changeColorButton.setPosition(x + 90, y, 0.0);
          changeColorButton.setScale(0.5, 0.5, 0.5);
          changeColorButton.on(Button.EventType.CLICK, this.changeTextColor, this);
          changeColorButton.parent = buttonNode;
          labelComponent = changeColorButton.getComponentInChildren(Label);
          labelComponent.string = 'TextColor';
          this.labelComponentList[this.labelComponentList.length] = labelComponent;
          var HideButton = instantiate(this.EnableAllCompositeModeButton);
          HideButton.setPosition(x + 200, y, 0.0);
          HideButton.setScale(0.5, 0.5, 0.5);
          HideButton.on(Button.EventType.CLICK, this.hideUI, this);
          HideButton.parent = this.node.parent;
          labelComponent = HideButton.getComponentInChildren(Label);
          labelComponent.string = 'Hide UI';
          this.labelComponentList[this.labelComponentList.length] = labelComponent;
          this.hideButtonLabel = labelComponent;

          // misc
          y -= 40;
          for (var _i2 = 0; _i2 < this.strMisc.length; _i2++) {
            var _newNode = instantiate(this.compositeModeToggle);
            _newNode.setPosition(x, y - height * _i2, 0.0);
            _newNode.setScale(0.5, 0.5, 0.5);
            _newNode.parent = miscNode;
            var _textComponent = _newNode.getComponentInChildren(RichText);
            _textComponent.string = this.strMisc[_i2];
            this.textComponentList[this.textComponentList.length] = _textComponent;
            this.textContentList[this.textContentList.length] = _textComponent.string;
            var toggleComponent = _newNode.getComponent(Toggle);
            toggleComponent.isChecked = _i2 ? true : false;
            _newNode.on(Toggle.EventType.TOGGLE, _i2 ? this.toggleLightingWithAlbedo : this.toggleCSMColoration, this);
            this.miscModeToggleList[_i2] = _newNode;
          }

          // composite
          y -= 150;
          for (var _i3 = 0; _i3 < this.strComposite.length; _i3++) {
            var _newNode2 = _i3 ? instantiate(this.compositeModeToggle) : this.compositeModeToggle;
            _newNode2.setPosition(x, y - height * _i3, 0.0);
            _newNode2.setScale(0.5, 0.5, 0.5);
            _newNode2.parent = this.compositeModeToggle.parent;
            var _textComponent2 = _newNode2.getComponentInChildren(RichText);
            _textComponent2.string = this.strComposite[_i3];
            this.textComponentList[this.textComponentList.length] = _textComponent2;
            this.textContentList[this.textContentList.length] = _textComponent2.string;
            _newNode2.on(Toggle.EventType.TOGGLE, this.toggleCompositeMode, this);
            this.compositeModeToggleList[_i3] = _newNode2;
          }
        };
        _proto.isTextMatched = function isTextMatched(textUI, textDescription) {
          var tempText = new String(textUI);
          var findIndex = tempText.search('>');
          if (findIndex === -1) {
            return textUI === textDescription;
          } else {
            tempText = tempText.substr(findIndex + 1);
            tempText = tempText.substr(0, tempText.search('<'));
            return tempText === textDescription;
          }
        };
        _proto.toggleSingleMode = function toggleSingleMode(toggle) {
          var debugView = director.root.debugView;
          var textComponent = toggle.getComponentInChildren(RichText);
          for (var i = 0; i < this.strSingle.length; i++) {
            if (this.isTextMatched(textComponent.string, this.strSingle[i])) {
              debugView.singleMode = i;
            }
          }
        };
        _proto.toggleCompositeMode = function toggleCompositeMode(toggle) {
          var debugView = director.root.debugView;
          var textComponent = toggle.getComponentInChildren(RichText);
          for (var i = 0; i < this.strComposite.length; i++) {
            if (this.isTextMatched(textComponent.string, this.strComposite[i])) {
              debugView.enableCompositeMode(i, toggle.isChecked);
            }
          }
        };
        _proto.toggleLightingWithAlbedo = function toggleLightingWithAlbedo(toggle) {
          var debugView = director.root.debugView;
          debugView.lightingWithAlbedo = toggle.isChecked;
        };
        _proto.toggleCSMColoration = function toggleCSMColoration(toggle) {
          var debugView = director.root.debugView;
          debugView.csmLayerColoration = toggle.isChecked;
        };
        _proto.enableAllCompositeMode = function enableAllCompositeMode(button) {
          var debugView = director.root.debugView;
          debugView.enableAllCompositeMode(true);
          for (var i = 0; i < this.compositeModeToggleList.length; i++) {
            var _toggleComponent = this.compositeModeToggleList[i].getComponent(Toggle);
            _toggleComponent.isChecked = true;
          }
          var toggleComponent = this.miscModeToggleList[0].getComponent(Toggle);
          toggleComponent.isChecked = false;
          debugView.csmLayerColoration = false;
          toggleComponent = this.miscModeToggleList[1].getComponent(Toggle);
          toggleComponent.isChecked = true;
          debugView.lightingWithAlbedo = true;
        };
        _proto.hideUI = function hideUI(button) {
          var titleNode = this.node.getChildByName('Titles');
          var activeValue = !titleNode.active;
          this.singleModeToggleList[0].parent.active = activeValue;
          this.miscModeToggleList[0].parent.active = activeValue;
          this.compositeModeToggleList[0].parent.active = activeValue;
          this.EnableAllCompositeModeButton.parent.active = activeValue;
          titleNode.active = activeValue;
          this.hideButtonLabel.string = activeValue ? 'Hide UI' : 'Show UI';
        };
        _proto.changeTextColor = function changeTextColor(button) {
          this._currentColorIndex++;
          if (this._currentColorIndex >= this.strColor.length) {
            this._currentColorIndex = 0;
          }
          for (var i = 0; i < this.textComponentList.length; i++) {
            this.textComponentList[i].string = this.strColor[this._currentColorIndex] + this.textContentList[i] + '</color>';
          }
          for (var _i4 = 0; _i4 < this.labelComponentList.length; _i4++) {
            this.labelComponentList[_i4].color = this.color[this._currentColorIndex];
          }
        };
        _proto.onLoad = function onLoad() {};
        _proto.update = function update(deltaTime) {};
        return DebugViewRuntimeControl;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "compositeModeToggle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "singleModeToggle", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "EnableAllCompositeModeButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Intents.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, input, Input, KeyCode, EventTarget, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      input = module.input;
      Input = module.Input;
      KeyCode = module.KeyCode;
      EventTarget = module.EventTarget;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "cc4dcBLn1xMW7p90cB24brx", "Intents", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var IntentEnum = exports('IntentEnum', /*#__PURE__*/function (IntentEnum) {
        IntentEnum[IntentEnum["RotateL"] = 0] = "RotateL";
        IntentEnum[IntentEnum["RotateR"] = 1] = "RotateR";
        IntentEnum[IntentEnum["MoveLeft"] = 2] = "MoveLeft";
        IntentEnum[IntentEnum["MoveRight"] = 3] = "MoveRight";
        IntentEnum[IntentEnum["SoftDrop"] = 4] = "SoftDrop";
        IntentEnum[IntentEnum["HardDrop"] = 5] = "HardDrop";
        IntentEnum[IntentEnum["Hold"] = 6] = "Hold";
        IntentEnum[IntentEnum["Update"] = 7] = "Update";
        return IntentEnum;
      }({}));
      var Intents = exports('Intents', (_dec = ccclass('Intents'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Intents, _Component);
        function Intents() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.PlayerIntent = new EventTarget();
          return _this;
        }
        var _proto = Intents.prototype;
        _proto.onLoad = function onLoad() {
          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        };
        _proto.onKeyDown = function onKeyDown(event) {
          switch (event.keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
              this.PlayerIntent.emit(IntentEnum.MoveLeft);
              break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
              this.PlayerIntent.emit(IntentEnum.MoveRight);
              break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
              this.PlayerIntent.emit(IntentEnum.SoftDrop);
              break;
            case KeyCode.SPACE:
              this.PlayerIntent.emit(IntentEnum.HardDrop);
              break;
            case KeyCode.SHIFT_LEFT:
              this.PlayerIntent.emit(IntentEnum.Hold);
              break;
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_Q:
              this.PlayerIntent.emit(IntentEnum.RotateL);
              break;
            case KeyCode.KEY_E:
              this.PlayerIntent.emit(IntentEnum.RotateR);
              break;
          }
        };
        _proto.onDestroy = function onDestroy() {
          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        };
        return Intents;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./debug-view-runtime-control.ts', './Tetromino.ts', './Intents.ts', './TetitsModel.ts', './TetitsView.ts'], function () {
  return {
    setters: [null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/TetitsModel.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Intents.ts', './Tetromino.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, CCFloat, Size, EventTarget, Vec2, Component, Intents, IntentEnum, Tetromino;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      CCFloat = module.CCFloat;
      Size = module.Size;
      EventTarget = module.EventTarget;
      Vec2 = module.Vec2;
      Component = module.Component;
    }, function (module) {
      Intents = module.Intents;
      IntentEnum = module.IntentEnum;
    }, function (module) {
      Tetromino = module.Tetromino;
      exports('Tetromino', module.Tetromino);
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
      cclegacy._RF.push({}, "cac6aVn84dD47acc0+RKvg1", "TetitsModel", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var UpdateEnum = exports('UpdateEnum', /*#__PURE__*/function (UpdateEnum) {
        UpdateEnum[UpdateEnum["BoardUpdate"] = 0] = "BoardUpdate";
        UpdateEnum[UpdateEnum["GameOver"] = 1] = "GameOver";
        return UpdateEnum;
      }({}));
      var TetitsModel = exports('TetitsModel', (_dec = ccclass('TetitsModel'), _dec2 = property(Intents), _dec3 = property(CCFloat), _dec4 = property(CCFloat), _dec5 = property(Size), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(TetitsModel, _Component);
        function TetitsModel() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.Updated = new EventTarget();
          _initializerDefineProperty(_this, "intent", _descriptor, _assertThisInitialized(_this));
          //LockDelay的計時器
          _initializerDefineProperty(_this, "lockDelayTimerMax", _descriptor2, _assertThisInitialized(_this));
          _this.lockDelayTimer = _this.lockDelayTimerMax;
          //下落的週期，單位為秒
          _initializerDefineProperty(_this, "gravityPeriod", _descriptor3, _assertThisInitialized(_this));
          _this.gravityCounter = 0;
          //遊戲棋盤大小
          _initializerDefineProperty(_this, "size", _descriptor4, _assertThisInitialized(_this));
          //邏輯相關
          //遊戲棋盤放置已成定局的盤面
          _this.board = [];
          //接下來的方塊
          _this.TetrominoBag = [];
          //目前正在操作的方塊
          _this.handlingTetromino = void 0;
          return _this;
        }
        var _proto = TetitsModel.prototype;
        _proto.onLoad = function onLoad() {
          var _this2 = this;
          this.lockDelayTimer = this.lockDelayTimerMax;
          this.board = new Array(this.size.height).fill(0).map(function () {
            return new Array(_this2.size.width).fill(0);
          });
          this.shuffleBag();
          this.handlingTetromino = this.getNextTetromino();
        };
        _proto.shuffleBag = function shuffleBag() {
          var T = new Tetromino([[0, 1, 0], [1, 1, 1], [0, 0, 0]], this.board);
          var I = new Tetromino([[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], this.board);
          var O = new Tetromino([[1, 1], [1, 1]], this.board);
          var L = new Tetromino([[0, 0, 0], [1, 1, 1], [1, 0, 0]], this.board);
          var J = new Tetromino([[0, 0, 0], [1, 1, 1], [0, 0, 1]], this.board);
          var S = new Tetromino([[0, 0, 0], [0, 1, 1], [1, 1, 0]], this.board);
          var Z = new Tetromino([[0, 0, 0], [1, 1, 0], [0, 1, 1]], this.board);
          this.TetrominoBag.push(T);
          this.TetrominoBag.push(I);
          this.TetrominoBag.push(O);
          this.TetrominoBag.push(L);
          this.TetrominoBag.push(J);
          this.TetrominoBag.push(S);
          this.TetrominoBag.push(Z);
          for (var i = this.TetrominoBag.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var _ref = [this.TetrominoBag[j], this.TetrominoBag[i]];
            this.TetrominoBag[i] = _ref[0];
            this.TetrominoBag[j] = _ref[1];
          }
        };
        _proto.start = function start() {
          this.intent.PlayerIntent.on(IntentEnum.MoveLeft, this.onMoveLeft, this);
          this.intent.PlayerIntent.on(IntentEnum.MoveRight, this.onMoveRight, this);
          this.intent.PlayerIntent.on(IntentEnum.RotateL, this.onRotateL, this);
          this.intent.PlayerIntent.on(IntentEnum.RotateR, this.onRotateR, this);
          this.intent.PlayerIntent.on(IntentEnum.SoftDrop, this.onSoftDrop, this);
          this.intent.PlayerIntent.on(IntentEnum.HardDrop, this.onHardDrop, this);
          this.intent.PlayerIntent.on(IntentEnum.Hold, this.onHold, this);
        };
        _proto.onHold = function onHold(Hold, _onHold, thisArgs) {};
        _proto.onHardDrop = function onHardDrop(HardDrop, _onHardDrop, thisArgs) {
          this.handlingTetromino.hardDrop();
        };
        _proto.onSoftDrop = function onSoftDrop(SoftDrop, _onSoftDrop, thisArgs) {
          this.handlingTetromino.tryMove(new Vec2(0, 1));
        };
        _proto.onRotateR = function onRotateR(RotateR, _onRotateR, thisArgs) {
          this.handlingTetromino.tryRotateR();
        };
        _proto.onRotateL = function onRotateL(RotateL, _onRotateL, thisArgs) {
          this.handlingTetromino.tryRotateL();
        };
        _proto.onMoveRight = function onMoveRight(MoveRight, _onMoveRight, thisArgs) {
          this.handlingTetromino.tryMove(new Vec2(1, 0));
        };
        _proto.onMoveLeft = function onMoveLeft(MoveLeft, _onMoveLeft, thisArgs) {
          this.handlingTetromino.tryMove(new Vec2(-1, 0));
        };
        _proto.update = function update(deltaTime) {
          //依照時間更新
          this.gravityCounter += deltaTime;
          if (this.gravityCounter >= this.gravityPeriod) {
            this.gravityCounter = 0;
            this.gravityDrop();
          }
          this.Updated.emit(UpdateEnum.BoardUpdate, this.board, this.handlingTetromino);
        }

        //檢查是否可以放置到棋盤上
        //如果可以放置，則放置並回傳true，否則回傳false
        ;

        _proto.tryPlaceTetromino = function tryPlaceTetromino(tetromino) {
          var _this3 = this;
          if (tetromino.isLegal(tetromino.shape, tetromino.position)) {
            tetromino.shape.forEach(function (row, y) {
              row.forEach(function (cell, x) {
                if (cell != 0) {
                  _this3.board[tetromino.position.y + y][tetromino.position.x + x] = cell;
                }
              }, _this3);
            });
            return true;
          }
          return false;
        }

        //將方塊放置在棋盤上
        ;

        _proto.placeTetromino = function placeTetromino(tetromino) {
          if (!this.tryPlaceTetromino(tetromino)) {
            throw new Error("Cannot place tetromino");
          }
        }

        //重力下落，如果無法下落則放置，在放置前會檢查是否有LockDelay
        ;

        _proto.gravityDrop = function gravityDrop() {
          //如果無法下落，則放置
          if (!this.handlingTetromino.tryMove(new Vec2(0, 1))) {
            if (this.lockDelayTimer <= 0) {
              this.placeTetromino(this.handlingTetromino);
              this.checkClearLines();
              //檢查遊戲是否結束
              if (this.handlingTetromino.position.y == 0 && !this.handlingTetromino.isLegal(this.handlingTetromino.shape, this.handlingTetromino.position)) {
                this.Updated.emit(UpdateEnum.GameOver);
              }
              this.lockDelayTimer = this.lockDelayTimerMax;
              this.handlingTetromino = this.getNextTetromino();
            } else {
              this.lockDelayTimer--;
            }
          } else {
            this.lockDelayTimer = this.lockDelayTimerMax;
          }
        }

        //在新放置的方塊區域，檢查是否有滿行，並消除，上方的方塊下降，並回傳消除的行數
        ;

        _proto.checkClearLines = function checkClearLines() {
          var clearLines = 0;
          for (var y = 0; y < this.board.length; y++) {
            if (this.board[y].every(function (cell) {
              return cell != 0;
            })) {
              this.board.splice(y, 1);
              this.board.unshift(new Array(this.board[0].length).fill(0));
              clearLines++;
            }
          }
          return clearLines;
        }

        //得到下一個方塊
        ;

        _proto.getNextTetromino = function getNextTetromino() {
          if (this.TetrominoBag.length == 0) {
            this.shuffleBag();
          }
          return this.TetrominoBag.pop();
        };
        return TetitsModel;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "intent", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lockDelayTimerMax", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "gravityPeriod", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "size", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Size(10, 20);
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TetitsView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './TetitsModel.ts'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Prefab, instantiate, Component, TetitsModel, UpdateEnum;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
      Component = module.Component;
    }, function (module) {
      TetitsModel = module.TetitsModel;
      UpdateEnum = module.UpdateEnum;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
      cclegacy._RF.push({}, "19c86l2KChCZqvcK/wvpKqz", "TetitsView", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var TetitsView = exports('TetitsView', (_dec = ccclass('TetitsView'), _dec2 = property(Prefab), _dec3 = property(TetitsModel), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(TetitsView, _Component);
        function TetitsView() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "tetrominoPrefab", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "model", _descriptor2, _assertThisInitialized(_this));
          _this.ViewBoard = [];
          return _this;
        }
        var _proto = TetitsView.prototype;
        _proto.start = function start() {
          this.model.Updated.on(UpdateEnum.BoardUpdate, this.onBoardUpdate, this);
          for (var y = 0; y < this.model.size.height; y++) {
            for (var x = 0; x < this.model.size.width; x++) {
              if (this.ViewBoard[y] == undefined) {
                this.ViewBoard[y] = [];
              }
              if (this.ViewBoard[y][x] == undefined) {
                this.ViewBoard[y][x] = instantiate(this.tetrominoPrefab);
                this.ViewBoard[y][x].setParent(this.node);
                this.ViewBoard[y][x].setPosition(x * 32, -y * 32);
                this.ViewBoard[y][x].active = false;
              }
            }
          }
        };
        _proto.update = function update(deltaTime) {};
        _proto.onBoardUpdate = function onBoardUpdate(board, handlingTetromino, thisArg) {
          var previewBoardArr = this.previewBoard(board, handlingTetromino);
          for (var y = 0; y < previewBoardArr.length; y++) {
            for (var x = 0; x < previewBoardArr[y].length; x++) {
              if (previewBoardArr[y][x] == 0) {
                this.ViewBoard[y][x].active = false;
              } else {
                this.ViewBoard[y][x].active = true;
              }
            }
          }
        };
        _proto.previewBoard = function previewBoard(board, handlingTetromino) {
          var _this2 = this;
          var boardOutPut = "";
          var previewBoard = board.map(function (innerboard) {
            return [].concat(innerboard);
          });
          handlingTetromino.shape.forEach(function (row, y) {
            row.forEach(function (cell, x) {
              if (cell != 0) {
                previewBoard[handlingTetromino.position.y + y][handlingTetromino.position.x + x] = cell;
              }
            }, _this2);
          });
          console.log(boardOutPut);
          return previewBoard;
        };
        _proto.onDestroy = function onDestroy() {
          this.model.Updated.off(UpdateEnum.BoardUpdate, this.onBoardUpdate, this);
        };
        return TetitsView;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tetrominoPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "model", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Tetromino.ts", ['cc'], function (exports) {
  var cclegacy, Vec2;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec2 = module.Vec2;
    }],
    execute: function () {
      cclegacy._RF.push({}, "14fe71wtc9Jj7/PAyEKb/B0", "Tetromino", undefined);
      var Tetromino = exports('Tetromino', /*#__PURE__*/function () {
        function Tetromino(shape, board) {
          //4x4的方塊，0為空
          this.shape = [];
          //方塊的位置，LeftTop為(0,0)
          this.position = new Vec2(0, 0);
          //方塊的盤面，0為空
          this.board = [];
          if (board.length < 10 || board[0].length < 10) {
            throw new Error("Board must be at least 10x10");
          }
          this.shape = shape;
          this.board = board;
        }

        //嘗試旋轉方塊，如果成功則旋轉並回傳true，否則回傳false
        var _proto = Tetromino.prototype;
        _proto.tryRotateL = function tryRotateL() {
          return this.tryRotate(false);
        }

        //嘗試旋轉方塊，如果成功則旋轉並回傳true，否則回傳false
        ;

        _proto.tryRotateR = function tryRotateR() {
          return this.tryRotate(true);
        }

        //嘗試移動方塊，如果成功則移動並回傳true，否則回傳false
        ;

        _proto.tryMove = function tryMove(vec) {
          var nextPosition = this.position.clone().add(vec);
          if (this.isLegal(this.shape, nextPosition)) {
            this.position = nextPosition;
            return true;
          }
          return false;
        };
        _proto.rotate = function rotate(matrix, clockwise) {
          var n = matrix.length;
          var width = n - 1;
          for (var i = 0; i < Math.floor(n / 2); i++) {
            for (var j = i; j < i + width; j++) {
              if (clockwise) {
                var temp = matrix[i][j];
                matrix[i][j] = matrix[n - j - 1][i];
                matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1];
                matrix[n - i - 1][n - j - 1] = matrix[j][n - i - 1];
                matrix[j][n - i - 1] = temp;
              } else {
                var _temp = matrix[i][j];
                matrix[i][j] = matrix[j][n - i - 1];
                matrix[j][n - i - 1] = matrix[n - i - 1][n - j - 1];
                matrix[n - i - 1][n - j - 1] = matrix[n - j - 1][i];
                matrix[n - j - 1][i] = _temp;
              }
            }
            width -= 2;
          }
        }

        //嘗試旋轉方塊，如果失敗則進行WallKick檢查，如果還是失敗則不旋轉
        ;

        _proto.tryRotate = function tryRotate(clockwise) {
          var nextShape = this.shape.map(function (inner) {
            return [].concat(inner);
          });
          this.rotate(nextShape, clockwise);
          if (this.isLegal(nextShape, this.position)) {
            this.shape = nextShape;
            return true;
          } else {
            if (this.wallKick(nextShape)) {
              return true;
            }
          }
          return false;
        }

        //WallKick檢查，如果可以則進行WallKick，規則為最寬鬆且最符合直覺的規則
        ;

        _proto.wallKick = function wallKick(nextShape) {
          var wallKickData = [[new Vec2(0, 0), new Vec2(-1, 0), new Vec2(-1, 1), new Vec2(0, -2), new Vec2(-1, -2)], [new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, -1), new Vec2(0, 2), new Vec2(1, 2)], [new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, 1), new Vec2(0, -2), new Vec2(1, -2)], [new Vec2(0, 0), new Vec2(-1, 0), new Vec2(-1, -1), new Vec2(0, 2), new Vec2(-1, 2)]];
          for (var i = 0; i < wallKickData.length; i++) {
            for (var j = 0; j < wallKickData[i].length; j++) {
              var wallKick = wallKickData[i][j];
              var nextPosition = this.position.clone().add(wallKick);
              if (this.isLegal(nextShape, nextPosition)) {
                this.position = nextPosition;
                this.shape = nextShape;
                return true;
              }
            }
          }
          return false;
        }

        //檢查移動是否合法(沒有與其他方塊重疊，沒有超出邊界)
        ;

        _proto.isLegal = function isLegal(shape, position) {
          var boardWidth = this.board[0].length;
          var boardHeight = this.board.length;
          for (var y = 0; y < shape.length; y++) {
            for (var x = 0; x < shape[y].length; x++) {
              if (shape[y][x] == 0) continue;
              var newX = position.x + x;
              var newY = position.y + y;
              if (newX < 0 || newX >= boardWidth || newY < 0 || newY >= boardHeight) return false;
              if (this.board[newY][newX] !== 0) return false;
            }
          }
          return true;
        }

        //快速掉落方塊
        ;

        _proto.hardDrop = function hardDrop() {
          while (this.tryMove(new Vec2(0, 1))) {}
        };
        return Tetromino;
      }());
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});
//# sourceMappingURL=index.js.map