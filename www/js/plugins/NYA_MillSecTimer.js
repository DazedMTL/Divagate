//=============================================================================
// NYA_MillSecTimer.js
// ----------------------------------------------------------------------------
// このプラグインは以下のライセンスのもと、使用することができます。 
// Copyright (c) 2016-2017 Nyatama
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2017/12/01 セーブした時タイマーの設定情報が保存されてなかった問題を修正しました
// 1.3.6 2017/11/29 タイマーの色変更コマンドが正常に機能してなかったので修正しました（プラグインコマンドにタイトル色変更追加）
// 1.3.5 2017/11/20 タイマーの点滅エフェクト機能を追加しました
// 1.3.4 2017/11/19 タイマーのフェードエフェクト機能を追加しました
// 1.3.3 2017/11/19 タイマーのフリッカーエフェクト機能を追加しました
// 1.3.2 2017/11/19 カウントアップのときに０秒から開始できない問題を修正しました
// 1.3.1 2017/11/14 タイマーアップのプラグインコマンドを追加しました。又、コマンドが大文字小文字関係なく実行可能にしました
// 1.3.0 2017/10/15 開始アニメーションやタイマータイトルをつける機能を追加しました→これに伴い各種パラメータ追加
// 1.2.1 2017/06/02 ver1.1.0で修正できてなかった条件分岐バグ修正
// 1.2.0 2016/05/29 タイマーの表示非表示、位置、フォントのサイズ及び色をプラグインコマンドで変えれるようにしました
// 1.1.0 2016/05/22 条件分岐バグ修正＆タイマーの表示非表示、位置、フォントのサイズ及び色変更機能追加
// 1.0.0 2016/02/28 初版試作
//=============================================================================

/*:
 * @plugindesc v1.4.0 ミリ秒に変更するタイマー関係のプラグイン
 * @author にゃたま
 *
 * @param FontFace
 * @desc タイマー文字列のフォント名です(指定する場合のみ)
 * fontsフォルダに入れて下さい。「.ttf」以外のフォント名のみ
 *
 * @param FontSize
 * @desc フォントサイズ
 * Default: 52
 * @default 52
 *
 * @param FontColor
 * @desc フォント色 Default: #ffffff
 * 例（黒:#000000 白:#ffffff 赤:#ff0000）
 * @default  #ffffff
 *
 * @param Width
 * @desc 横幅
 * Default: 200
 * @default 200
 *
 * @param Height
 * @desc 縦幅
 * Default: 68
 * @default 68
 *
 * @param Align
 * @desc タイマーの整列設定 Default: center
 * 例（左揃え:left 中央揃え:center 右揃え:right）
 * @default center
 *
 * @param Position X
 * @desc X位置
 * Default: Graphics.width - this.bitmap.width - 10
 * @default Graphics.width - this.bitmap.width - 10
 *
 * @param Position Y
 * @desc Y位置
 * Default: 0
 * @default 0
 *
 * @param --デバッグ用--
 *
 * @param BackColor
 * @desc 背景色設定（主にデバッグ用）Default: <空欄>
 * 例> 黒:#000000 白:#ffffff 赤:#ff0000 or rgb(255, 0, 0)
 * @default 
 *
 * @param TimerTitle BackColor
 * @desc タイマータイトル背景色設定（主にデバッグ用）
 * 例> 黒:#000000 白:#ffffff 赤:#ff0000 or rgb(255, 0, 0)
 * Default: <空欄>
 * @default 
 * 
 * @param --タイマータイトル設定--
 *
 * @param TimerTitle Enable
 * @desc タイマーにタイトルを設定する
 * Default: false
 * @type boolean
 * @default false
 *
 * @param TimerTitle Name
 * @desc タイマータイトルのタイトル名
 * Default: TIME
 * @default  TIME
 *
 * @param TimerTitle FontFace
 * @desc タイマータイトル文字列のフォント名です(指定する場合のみ)
 * fontsフォルダに入れて下さい。「.ttf」以外のフォント名のみ
 *
 * @param TimerTitle FontSize
 * @desc タイマータイトルのフォントサイズ
 * Default: 25
 * @default 25
 *
 * @param TimerTitle FontColor
 * @desc タイマータイトルの文字色 Default: #ffffff
 * 例（黒:#000000 白:#ffffff 赤:#ff0000）
 * @default  #ffffff
 *
 * @param TimerTitle Width
 * @desc タイマータイトルの横幅
 * Default: 200
 * @default 200
 *
 * @param TimerTitle Height
 * @desc タイマータイトルの縦幅
 * Default: 30
 * @default 30
 *
 * @param TimerTitle Align
 * @desc タイマータイトルの整列設定 Default: left
 * 例（左揃え:left 中央揃え:center 右揃え:right）
 * @default left
 *
 * @param --開始アニメーション設定--
 *
 * @param TimerStartAnime Enable
 * @desc タイマーのスタート位置を決めてアニメーションする
 * Default: false
 * @type boolean
 * @default false
 *
 * @param StartWaitFrame
 * @desc タイマー開始位置で維持させるフレーム数
 * Default: 180
 * @default 180
 *
 * @param StartToEndFrame
 * @desc タイマー開始位置〜通常位置にアニメーションさせるフレーム数
 * Default: 180
 * @default 180
 *
 * @param StartPosition X
 * @desc タイマーのスタートするX座標
 * Default: Graphics.width / 2 - this.bitmap.width / 2
 * @default Graphics.width / 2 - this.bitmap.width / 2
 *
 * @param StartPosition Y
 * @desc タイマーのスタートするY座標
 * Default: Graphics.height / 2 - this.bitmap.height / 2
 * @default Graphics.height / 2 - this.bitmap.height / 2
 *
 *
 * @help
 * 概要:
 * ツクール標準のカウントダウンタイマーの表示をミリ秒表示に変えるプラグインです。
 *
 *
 * プラグインコマンド:
 *   NYA_MillSecTimer add 10                   # タイマーを指定秒数増加させる
 *   NYA_MillSecTimer sub 10                   # タイマーを指定秒数減少させる
 *   NYA_MillSecTimer pause                    # タイマーを一時停止させる
 *   NYA_MillSecTimer resume                   # タイマーを再開させる
 *   NYA_MillSecTimer posSet 340 250           # タイマーの表示位置を変更する(x位置,y位置)
 *   NYA_MillSecTimer posSet                   # タイマーの表示位置の引数がないとリセットになります
 *   NYA_MillSecTimer posReset                 # タイマーの表示位置をリセットします
 *   NYA_MillSecTimer colorSet #ffffff         # タイマーフォントの色を設定します
 *   NYA_MillSecTimer colorReset               # タイマーフォントの色をリセットします
 *   NYA_MillSecTimer fontSizeSet #ffffff      # タイマーフォントのサイズを設定します
 *   NYA_MillSecTimer fontSizeReset            # タイマーフォントのサイズをリセットします
 *   NYA_MillSecTimer titleColorSet #ffffff    # タイトルフォントの色を設定します
 *   NYA_MillSecTimer titleColorReset          # タイトルフォントの色をリセットします
 *   NYA_MillSecTimer titleFontSizeSet #ffffff # タイトルフォントのサイズを設定します
 *   NYA_MillSecTimer titleFontSizeReset       # タイトルフォントのサイズをリセットします
 *   NYA_MillSecTimer hide                     # タイマーを非表示にします
 *   NYA_MillSecTimer show                     # タイマーを表示します
 *   NYA_MillSecTimer countUp                  # タイマーをカウントアップさせます
 *   NYA_MillSecTimer countDown                # タイマーをカウントダウンさせます
 *   NYA_MillSecTimer effect flickr 1          # タイマーのフリッカーエフェクトを設定します
 *                                             # (第1引数:明滅強度) [1:強設定]【指定しない場合:1】
 *   NYA_MillSecTimer effect fade 5 128        # タイマーのフェードエフェクトを設定します
 *                                             # (第1引数:フェードの速度) [1:遅い]【指定しない場合:5】
 *                                             # (第2引数:フェードアウト最小値) [0:強設定]【指定しない場合:128】
 *   NYA_MillSecTimer effect blink 10          # タイマーのブリンクエフェクトを設定します
 *                                             # (第1引数:点滅強度) [1:点滅速度早い]【指定しない場合:10】
 *   NYA_MillSecTimer effect off               # タイマーのエフェクトを無効にします
 *   NYA_MillSecTimer titleName 制限時間        # タイマータイトルの名前を変更します
 *  
 * ※このプラグインでは、以下を書き換えていますので、本体アップデートや競合に注意してください。
 *    
 *    Sprite_Timer.prototype.createBitmap
 *    Sprite_Timer.prototype.updateBitmap
 *    Sprite_Timer.prototype.updatePosition
 *    Sprite_Timer.prototype.timerText
 *    Sprite_Timer.prototype.redraw
 *    Game_Timer.prototype.initialize
 *    Game_Timer.prototype.start
 *    Game_Timer.prototype.update
 *    Game_Interpreter.prototype.command111
 *    
 * 
 */
 
(function() {
    function convertEscape(txt) {
        return Window_Base.prototype.convertEscapeCharacters(txt)
    };
    
    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };
    
    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };
    
     var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    
    var pluginName = 'NYA_MillSecTimer';
    var parameters = PluginManager.parameters(pluginName);
    var fontFace = getParamString(['FontFace']);
    var fontColor = String(parameters['FontColor'] || '#ffffff');
    var fontSize = Number(parameters['FontSize'] || 52);
    var timerWidth = Number(parameters['Width'] || 200);
    var timerHeight = Number(parameters['Height'] || 68);
    var timerAlign = String(parameters['Align'] || 'center');
    var posX = String(parameters['Position X'] || 'Graphics.width - this.bitmap.width - 10');
    var posY = String(parameters['Position Y'] || '0');
    
    var backColor = String(parameters['BackColor'] || '');
    var timerTitle_BackColor = String(parameters['TimerTitle BackColor'] || '');
    
    var timerTitle_Enable = eval(parameters['TimerTitle Enable']);
    var timerTitle_Name = String(parameters['TimerTitle Name'] || 'TIME');
    var timerTitle_FontFace = getParamString(['TimerTitle FontFace']);
    var timerTitle_FontSize = Number(parameters['TimerTitle FontSize'] || 25);
    var timerTitle_FontColor = String(parameters['TimerTitle FontColor'] || '#ffffff');
    var timerTitle_Width = Number(parameters['TimerTitle Width'] || 200);
    var timerTitle_Height = Number(parameters['TimerTitle Height'] || 30);
    var timerTitle_Align = String(parameters['TimerTitle Align'] || 'left');
    
    var timerStartAnime = eval(parameters['TimerStartAnime Enable']);
    var timerStartAnime_StartWaitFrame = Number(parameters['StartWaitFrame'] || 180);
    var timerStartAnime_StartToEndFrame = Number(parameters['StartToEndFrame'] || 180);
    var timerStartAnime_StartPosX = String(parameters['StartPosition X'] || 'Graphics.width / 2 - this.bitmap.width / 2');
    var timerStartAnime_StartPosY = String(parameters['StartPosition Y'] || 'Graphics.height / 2 - this.bitmap.height / 2');

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'NYA_MillSecTimer') {

            switch (args[0].toUpperCase()) {
            case 'ADD':
                $gameTimer.addFrames(eval(args[1]));
                break;
            case 'SUB':
                $gameTimer.subFrames(eval(args[1]));
                break;
                    
            case 'PAUSE':
                $gameTimer.pause();
                break;
            case 'RESUME':
                $gameTimer.resume();
                break;
                    
            case 'POSSET':
                $gameTimer._posTimerX = args[1] != null ? Number(args[1]) : posX;
                $gameTimer._posTimerY = args[2] != null ? Number(args[2]) : posY;
                break;
            case 'POSRESET':
                $gameTimer._posTimerX = posX;
                $gameTimer._posTimerY = posY;
                break;
                    
            case 'COLORSET':
                $gameTimer._timerColor = args[1];
                break;
            case 'COLORRESET':
                $gameTimer._timerColor = fontColor;
                break;
                    
            case 'FONTSIZESET':
                $gameTimer._timerFontSize = Number(args[1]);
                break;
            case 'FONTSIZERESET':
                $gameTimer._timerFontSize = fontSize;
                break;
                    
            case 'TITLECOLORSET':
                $gameTimer._timerTitleColor = args[1];
                break;
            case 'TITLECOLORRESET':
                $gameTimer._timerTitleColor = timerTitle_FontColor;
                break;
                    
            case 'TITLEFONTSIZESET':
                $gameTimer._timerTitleFontSize = Number(args[1]);
                break;
            case 'TITLEFONTSIZERESET':
                $gameTimer._timerTitleFontSize = timerTitle_FontSize;
                break;
                    
            case 'HIDE':
                $gameTimer.setHideTimer(true);
                break;
            case 'SHOW':
                $gameTimer.setHideTimer(false);
                break;
                    
            case 'COUNTUP':
                $gameTimer.setCountUp(true);
                break;
            case 'COUNTDOWN':
                $gameTimer.setCountUp(false);
                break;
                    
            case 'TITLENAME':
                $gameTimer._timerTitle_Name = convertEscape(args[1]);
                break;
                    
            case 'EFFECT':
                if(args[1]){
                    if(args[1].toUpperCase() === 'FLICKR'){
                        if(args[2]) $gameTimer._timerFlickr = Number(args[2]);
                        $gameTimer._effectId = 1;
                    }
                    if(args[1].toUpperCase() === 'FADE'){
                        if(args[2]) $gameTimer._timerFadeInterval = Number(args[2]);
                        if(args[3]) $gameTimer._timerFadeMin = Number(args[3]);
                        $gameTimer._effectId = 2;
                    }
                    if(args[1].toUpperCase() === 'BLINK'){
                        if(args[2]) $gameTimer._timerBlinkInterval = Number(args[2]);
                        $gameTimer._effectId = 3;
                    }
                    if(args[1].toUpperCase() === 'OFF'){
                        $gameTimer._effectId = 0;
                    }
                }
                break;
            }
        }
    };
    
    // _Sprite_Timer_initialize override
    var _Sprite_Timer_initialize = Sprite_Timer.prototype.initialize;
    Sprite_Timer.prototype.initialize = function() {
       _Sprite_Timer_initialize.call(this);
        //eval()でwidth、heightを処理できるのはspriteクラス内でのみ
        timerStartAnime_StartPosX = eval(timerStartAnime_StartPosX);
        timerStartAnime_StartPosY = eval(timerStartAnime_StartPosY);
        posX = eval(posX);
        posY = eval(posY);
        
        this._ticker = 0;
        this._isFadeIn = false;
        this._isBlinkFlash = true;
    };
    
    // _Sprite_Timer_createBitmap override
    var _Sprite_Timer_createBitmap = Sprite_Timer.prototype.createBitmap;
    Sprite_Timer.prototype.createBitmap = function() {
        _Sprite_Timer_createBitmap.call(this);
        
        //タイマーテキスト
        var timerWidthMax =  timerWidth > timerTitle_Width ? timerWidth : timerTitle_Width;
        if(timerTitle_Enable){
            this.bitmap = new Bitmap(timerWidthMax, timerHeight + timerTitle_Height);
        }else{
            this.bitmap = new Bitmap(timerWidthMax, timerHeight);
        }
        //this.bitmap.textColor = fontColor;
        //this.bitmap.fontSize = fontSize;
        if (fontFace) {
            Graphics.loadFont($gameTimer._fontFace, 'fonts/' + fontFace + '.ttf');
        }
        if (timerTitle_FontFace) {
            Graphics.loadFont($gameTimer._timerTitle_FontFace, 'fonts/' + timerTitle_FontFace + '.ttf');
        }
        
        
    };
    
    // _Sprite_Timer_updateBitmap override
    var _Sprite_Timer_updateBitmap = Sprite_Timer.prototype.updateBitmap;
    Sprite_Timer.prototype.updateBitmap = function() {
        _Sprite_Timer_updateBitmap.call(this);
        
        if (this._millseconds !== $gameTimer.millseconds()) {
            this._seconds = $gameTimer.seconds();
            this._millseconds = $gameTimer.millseconds();
        }
        this.bitmap.clear();
        this.redraw();
        if($gameTimer._effectId == 1){
            var min = 0;
            var max = $gameTimer._timerFlickr;
            var rand = Math.floor( Math.random() * (max + 1 - min) ) + min ;
            if(rand == 0){
                this.opacity = 0;//非表示
            }else{
                this.opacity = 255;//表示
            }
        }
        if($gameTimer._effectId == 2){
            if(this._isFadeIn){
                if(this.opacity < 255) this.opacity += $gameTimer._timerFadeInterval;
                else this._isFadeIn = false;
            }else{
                if(this.opacity > $gameTimer._timerFadeMin) this.opacity -= $gameTimer._timerFadeInterval;
                else this._isFadeIn = true;
            }
        }
        if($gameTimer._effectId == 3){
            if(this._isBlinkFlash){
                this.opacity = 255;//表示
            }else{
                this.opacity = 0;//非表示
            }
            if(this._ticker > $gameTimer._timerBlinkInterval) {
                this._isBlinkFlash = !this._isBlinkFlash;
                this._ticker = 0;
            }
            this._ticker++;
        }
        if($gameTimer._effectId == 0){
            this.opacity = 255;
        }
        if($gameTimer._hideTimer){
            this.opacity = 0;
        }
    };
    
    // _Sprite_Timer_redraw override
    var _Sprite_Timer_redraw = Sprite_Timer.prototype.redraw;
    Sprite_Timer.prototype.redraw = function() {
        
        var text = this.timerText();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        
        
        //背景色設定
        if(backColor){
            if(timerTitle_Enable){
                this.bitmap.fillRect(0, timerTitle_Height, timerWidth, timerHeight, backColor);
            }else{
                this.bitmap.fillRect(0, 0, timerWidth, timerHeight, backColor);
            }
        }
        
        //タイマーテキスト設定
        this.bitmap.textColor = $gameTimer._timerColor;
        this.bitmap.fontSize = $gameTimer._timerFontSize;
        if (fontFace) {
            this.bitmap.fontFace = $gameTimer._fontFace;
        }else{
            this.bitmap.fontFace = 'GameFont';
        }
        //タイマーテキスト画面出力
        if(timerTitle_Enable){
            //タイマータイトルが有効の場合タイトルの高さ分下に表示
            this.bitmap.drawText(text, 0, timerTitle_Height, timerWidth, timerHeight, timerAlign);
            //背景色設定
            if(timerTitle_BackColor){
                this.bitmap.fillRect(0, 0, timerTitle_Width, timerTitle_Height, timerTitle_BackColor);
            }
            //タイマータイトル設定
            this.bitmap.textColor = $gameTimer._timerTitleColor;
            this.bitmap.fontSize = $gameTimer._timerTitleFontSize;
            if (timerTitle_FontFace) {
                this.bitmap.fontFace = $gameTimer._timerTitle_FontFace;
            }else{
                this.bitmap.fontFace = 'GameFont';
            }
            //タイマータイトル画面出力
            this.bitmap.drawText($gameTimer._timerTitle_Name, 0, 0, timerTitle_Width, timerTitle_Height, timerTitle_Align);
        }else{
            //タイマータイトルが無効の場合はタイマーのみそのまま表示
            this.bitmap.drawText(text, 0, 0, timerWidth, timerHeight, timerAlign);
        }
    };
    
    // _Sprite_Timer_updatePosition override
    var _Sprite_Timer_updatePosition = Sprite_Timer.prototype.updatePosition;
    Sprite_Timer.prototype.updatePosition = function() {
        _Sprite_Timer_updatePosition.call(this);
        this.x = $gameTimer._posTimerX;
        this.y = $gameTimer._posTimerY;
    };
    
    // _Sprite_Timer_timerText override
    var _Sprite_Timer_timerText = Sprite_Timer.prototype.timerText;
    Sprite_Timer.prototype.timerText = function() {
        _Sprite_Timer_timerText.call(this);
        var min = Math.floor(this._seconds / 60) % 60;
        var sec = this._seconds % 60;
        var millsec = this._millseconds % 60; 
        return min.padZero(2) + ':' + sec.padZero(2) + ':' + millsec.padZero(2);
    };
    
    
    
    //=================================
    // Game_Timer (プラグインスクリプト用)
    //=================================
    
    //ADD
    var _Game_Timer_initialize = Game_Timer.prototype.initialize;
    Game_Timer.prototype.initialize = function() {
        _Game_Timer_initialize.call(this);
        this._posTimerX = 0;
        this._posTimerY = 0;
        
        this._timerPause = false;
        this._timerFontSize = fontSize;
        this._timerTitleFontSize = timerTitle_FontSize;
        this._timerColor = fontColor;
        this._timerTitleColor = timerTitle_FontColor;
        this._hideTimer = false;
        this._countUp = true;
        this._timerTitle_Name = timerTitle_Name;
        
        this._timerFlickr = 1;
        this._timerFadeInterval = 5;
        this._timerFadeMin = 128;
        this._timerBlinkInterval = 10;
        this._effectId = 0;
    }
    
    // override
    var _Game_Timer_start = Game_Timer.prototype.start;
    Game_Timer.prototype.start = function(count) {
        _Game_Timer_start.call(this, count);
        this._ticker = 0;
        if(timerStartAnime){
            this._posTimerX = timerStartAnime_StartPosX;
            this._posTimerY = timerStartAnime_StartPosY;
        }else{
            this._posTimerX = posX;
            this._posTimerY = posY;
        }
    };

    // override
    var _Game_Timer_update = Game_Timer.prototype.update;
    Game_Timer.prototype.update = function(sceneActive) {
        if (!this._timerPause) {
            if (this._countUp){
                //CountUp
                if (sceneActive && this._working && this._frames >= 0) {
                    this._frames++;
                }
            }else{
                //CountDown
                _Game_Timer_update.call(this, sceneActive);
            }
            
        }
        
        if(timerStartAnime){
            this._ticker++;
            if(this._ticker >= timerStartAnime_StartWaitFrame && 
                     this._ticker < timerStartAnime_StartWaitFrame + timerStartAnime_StartToEndFrame){
                this._posTimerX -= (timerStartAnime_StartPosX - posX) / timerStartAnime_StartToEndFrame;
                this._posTimerY -= (timerStartAnime_StartPosY - posY) / timerStartAnime_StartToEndFrame;
            }
        }
    };
    
    // Game_Timer に millseconds を追加
    Game_Timer.prototype.millseconds = function() {
        return Math.floor(this._frames);
    };
    
    // Game_Timer に addFrames を追加
    Game_Timer.prototype.addFrames = function(second) {
        this._frames += second * 60;
    };

    // Game_Timer に subFrames を追加
    Game_Timer.prototype.subFrames = function(second) {
        this._frames -= second * 60;
        if (this._frames < 0) {
            this._frames = 0;
        }
    };

    // Game_Timer に pause を追加
    Game_Timer.prototype.pause = function() {
        this._timerPause = true;
    };

    // Game_Timer に resume を追加
    Game_Timer.prototype.resume = function() {
        this._timerPause = false;
    };

    // Game_Timer に setHideTimer を追加
    Game_Timer.prototype.setHideTimer = function(val) {
        this._hideTimer = val;
    };
    
    // Game_Timer に setCountUp を追加
    Game_Timer.prototype.setCountUp = function(val) {
        this._countUp = val;
    };
})();


    
// Conditional Branch
Game_Interpreter.prototype.command111 = function() {
    var result = false;
    switch (this._params[0]) {
        case 0:  // Switch
            result = ($gameSwitches.value(this._params[1]) === (this._params[2] === 0));
            break;
        case 1:  // Variable
            var value1 = $gameVariables.value(this._params[1]);
            var value2;
            if (this._params[2] === 0) {
                value2 = this._params[3];
            } else {
                value2 = $gameVariables.value(this._params[3]);
            }
            switch (this._params[4]) {
                case 0:  // Equal to
                    result = (value1 === value2);
                    break;
                case 1:  // Greater than or Equal to
                    result = (value1 >= value2);
                    break;
                case 2:  // Less than or Equal to
                    result = (value1 <= value2);
                    break;
                case 3:  // Greater than
                    result = (value1 > value2);
                    break;
                case 4:  // Less than
                    result = (value1 < value2);
                    break;
                case 5:  // Not Equal to
                    result = (value1 !== value2);
                    break;
            }
            break;
        case 2:  // Self Switch
            if (this._eventId > 0) {
                var key = [this._mapId, this._eventId, this._params[1]];
                result = ($gameSelfSwitches.value(key) === (this._params[2] === 0));
            }
            break;
        case 3:  // Timer
            if ($gameTimer.isWorking()) {
                if (this._params[2] === 0) {
                    // >=が選択されている場合
                    result = ($gameTimer.millseconds() >= this._params[1] * 60);
                } else {
                    // <=が選択されている場合
                    result = ($gameTimer.millseconds() <= this._params[1] * 60);
                }
            }
            break;
        case 4:  // Actor
            var actor = $gameActors.actor(this._params[1]);
            if (actor) {
                var n = this._params[3];
                switch (this._params[2]) {
                    case 0:  // In the Party
                        result = $gameParty.members().contains(actor);
                        break;
                    case 1:  // Name
                        result = (actor.name() === n);
                        break;
                    case 2:  // Class
                        result = actor.isClass($dataClasses[n]);
                        break;
                    case 3:  // Skill
                        result = actor.hasSkill(n);
                        break;
                    case 4:  // Weapon
                        result = actor.hasWeapon($dataWeapons[n]);
                        break;
                    case 5:  // Armor
                        result = actor.hasArmor($dataArmors[n]);
                        break;
                    case 6:  // State
                        result = actor.isStateAffected(n);
                        break;
                }
            }
            break;
        case 5:  // Enemy
            var enemy = $gameTroop.members()[this._params[1]];
            if (enemy) {
                switch (this._params[2]) {
                    case 0:  // Appeared
                        result = enemy.isAlive();
                        break;
                    case 1:  // State
                        result = enemy.isStateAffected(this._params[3]);
                        break;
                }
            }
            break;
        case 6:  // Character
            var character = this.character(this._params[1]);
            if (character) {
                result = (character.direction() === this._params[2]);
            }
            break;
        case 7:  // Gold
            switch (this._params[2]) {
                case 0:  // Greater than or equal to
                    result = ($gameParty.gold() >= this._params[1]);
                    break;
                case 1:  // Less than or equal to
                    result = ($gameParty.gold() <= this._params[1]);
                    break;
                case 2:  // Less than
                    result = ($gameParty.gold() < this._params[1]);
                    break;
            }
            break;
        case 8:  // Item
            result = $gameParty.hasItem($dataItems[this._params[1]]);
            break;
        case 9:  // Weapon
            result = $gameParty.hasItem($dataWeapons[this._params[1]], this._params[2]);
            break;
        case 10:  // Armor
            result = $gameParty.hasItem($dataArmors[this._params[1]], this._params[2]);
            break;
        case 11:  // Button
            result = Input.isPressed(this._params[1]);
            break;
        case 12:  // Script
            result = !!eval(this._params[1]);
            break;
        case 13:  // Vehicle
            result = ($gamePlayer.vehicle() === $gameMap.vehicle(this._params[1]));
            break;
    }
    this._branch[this._indent] = result;
    if (this._branch[this._indent] === false) {
        this.skipBranch();
    }
    return true;
};
