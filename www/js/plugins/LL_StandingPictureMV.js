//=============================================================================
// RPGツクールMV - LL_StandingPictureMV.js v2.3.0
//-----------------------------------------------------------------------------
// ルルの教会 (Lulu's Church)
// https://nine-yusha.com/
//
// URL below for license details.
// https://nine-yusha.com/plugin/
//=============================================================================

/*:
 * @target MV
 * @plugindesc メッセージウィンドウ表示時に立ち絵を表示します。
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin-spicture/
 *
 * @help LL_StandingPictureMV.js
 *
 * メッセージ内に専用の制御文字を入力することで、
 * 立ち絵を表示できます。
 *
 * ※立ち絵IDに半角英数字とアンダースコア(_)が使用できるようになりました。
 *   lulu_smileのように[名前_表情名]と付けるとわかりやすいです。
 *   また立ち絵IDは変数で指定することも可能です。 【例】\F[\V[1]]
 *
 * 専用制御文字:
 *   \F[立ち絵ID]       立ち絵1を表示します。 【例】\F[lulu_smile]
 *   \M[モーション名]   立ち絵1のモーションを再生します。 【例】\M[yes]
 *   \AA[F]             立ち絵1にフォーカスを当てます。 (立ち絵2を暗く)
 *   \FF[立ち絵ID]      立ち絵2を表示します。
 *   \MM[モーション名]  立ち絵2のモーションを再生します。
 *   \AA[FF]            立ち絵2にフォーカスを当てます。 (立ち絵1を暗く)
 *   \AA[N]             立ち絵を全て暗くします。
 *
 * 立ち絵モーション一覧:
 *   yes(頷く)、yesyes(二回頷く)、no(横に揺れる)、noslow(ゆっくり横に揺れる)
 *   jump(跳ねる)、jumpjump(二回跳ねる)、jumploop(跳ね続ける)
 *   shake(ガクガク)、shakeloop(ガクガクし続ける)
 *   runleft(画面左へ走り去る)、runright(画面右へ走り去る)
 *
 * プラグインコマンド:
 *   LL_StandingPictureMV setEnabled true       # 立ち絵を表示に設定 (初期値)
 *   LL_StandingPictureMV setEnabled false      # 立ち絵を非表示に設定
 *   LL_StandingPictureMV setTone 68,-34,-34,0  # 立ち絵の色調を夕暮れに変更
 *   LL_StandingPictureMV setTone -68,-68,68,0  # 立ち絵の色調を夜に変更
 *   LL_StandingPictureMV setTone 0,0,0,255     # 立ち絵の色調を白黒に変更
 *   LL_StandingPictureMV setTone 0,0,0,0       # 立ち絵の色調を通常に戻す
 *
 * 利用規約:
 *   ・著作権表記は必要ございません。
 *   ・利用するにあたり報告の必要は特にございません。
 *   ・商用・非商用問いません。
 *   ・R18作品にも使用制限はありません。
 *   ・ゲームに合わせて自由に改変していただいて問題ございません。
 *   ・プラグイン素材としての再配布（改変後含む）は禁止させていただきます。
 *
 * 作者: ルルの教会
 * 作成日: 2021/2/25
 *
 * @command setEnabled
 * @text 立ち絵表示ON・OFF
 * @desc 立ち絵の表示・非表示を一括制御します。
 *
 * @arg enabled
 * @text 立ち絵表示
 * @desc OFFにすると立ち絵が表示されなくなります。
 * @default true
 * @type boolean
 *
 * @command setTone
 * @text 色調変更
 * @desc 立ち絵の色調を変更します。
 *
 * @arg toneR
 * @text 赤
 * @desc 色調のR成分です。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 *
 * @arg toneG
 * @text 緑
 * @desc 色調のG成分です。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 *
 * @arg toneB
 * @text 青
 * @desc 色調のB成分です。 (-255～255)
 * @default 0
 * @type number
 * @min -255
 * @max 255
 *
 * @arg toneC
 * @text グレー
 * @desc グレースケールの強さです。 (0～255)
 * @default 0
 * @type number
 * @min 0
 * @max 255
 *
 * @param sPictures
 * @text 立ち絵リスト
 * @desc メッセージウィンドウに表示する立ち絵を定義します。
 * @default []
 * @type struct<sPictures>[]
 *
 * @param picture1Settings
 * @text 立ち絵1(\F)の設定
 * @desc ※この項目は使用しません
 *
 * @param transition
 * @text 切替効果
 * @desc 出現・消去時の切替効果を指定します。
 * @type select
 * @default 1
 * @option なし
 * @value 0
 * @option フェード
 * @value 1
 * @option フロート左
 * @value 2
 * @option フロート右
 * @value 3
 * @option フロート下
 * @value 4
 * @option フロート上
 * @value 5
 * @parent picture1Settings
 *
 * @param foreFront
 * @text ウィンドウの前面に表示
 * @desc ONにするとメッセージウィンドウよりも前面に表示されます。
 * @type boolean
 * @default false
 * @parent picture1Settings
 *
 * @param picture2Settings
 * @text 立ち絵2(\FF)の設定
 * @desc ※この項目は使用しません
 *
 * @param transition2
 * @text 切替効果
 * @desc 出現・消去時の切替効果を指定します。
 * @type select
 * @default 1
 * @option なし
 * @value 0
 * @option フェード
 * @value 1
 * @option フロート左
 * @value 2
 * @option フロート右
 * @value 3
 * @option フロート下
 * @value 4
 * @option フロート上
 * @value 5
 * @parent picture2Settings
 *
 * @param foreFront2
 * @text ウィンドウの前面に表示
 * @desc ONにするとメッセージウィンドウよりも前面に表示されます。
 * @type boolean
 * @default false
 * @parent picture2Settings
 *
 * @param focusToneAdjust
 * @text フォーカス時の暗さ
 * @desc AA[s]でフォーカスを当てた時の暗さ(-255～0)です。
 * 暗くなりすぎる場合に調整してください。(初期値: -96)
 * @default -96
 * @min -255
 * @max 0
 * @type number
 *
 * @param catheBootPicture
 * @text ゲーム起動時に事前ロード
 * @desc アツマールなどブラウザプレイ時の読み込み待ちを解消します。
 * 画像数や回線速度により起動が遅くなる場合があります。
 * @default true
 * @type boolean
 */

/*~struct~sPictures:
 *
 * @param id
 * @text 立ち絵ID
 * @desc 立ち絵IDです。立ち絵を制御文字で呼び出す際に使用します。
 * 半角英数字(_)で入力してください。(例: lulu_smile)
 * @type string
 *
 * @param imageName
 * @text 画像ファイル名
 * @desc 立ち絵として表示する画像ファイルを選択してください。
 * @dir img/pictures
 * @type file
 * @require 1
 *
 * @param origin
 * @text 原点
 * @desc 立ち絵の原点です。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 *
 * @param x
 * @text X座標 (立ち絵1)
 * @desc 立ち絵1(F)で呼び出された時の表示位置(X)です。
 * @default 464
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y
 * @text Y座標 (立ち絵1)
 * @desc 立ち絵1(F)で呼び出された時の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param x2
 * @text X座標 (立ち絵2)
 * @desc 立ち絵2(FF)で呼び出された時の表示位置(X)です。
 * @default 20
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param y2
 * @text Y座標 (立ち絵2)
 * @desc 立ち絵2(FF)で呼び出された時の表示位置(Y)です。
 * @default 96
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param reverse
 * @text 立ち絵2の左右反転
 * @desc 立ち絵2(FF)で呼び出された時の表示方法です。
 * @default 1
 * @type select
 * @option 左右反転しない
 * @value 1
 * @option 左右反転する
 * @value -1
 *
 * @param scaleX
 * @text X拡大率
 * @desc 立ち絵の拡大率(X)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Y拡大率
 * @desc 立ち絵の拡大率(Y)です。
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param opacity
 * @text 不透明度
 * @desc 立ち絵の不透明度(0～255)です。
 * @default 255
 * @type number
 * @min 0
 * @max 255
 *
 * @param blendMode
 * @text 合成方法
 * @desc 立ち絵の合成方法です。
 * @default 0
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 除算
 * @value 2
 * @option スクリーン
 * @value 3
 */

(function() {
	"use strict";
	var pluginName = "LL_StandingPictureMV";

	var parameters = PluginManager.parameters(pluginName);
	// 立ち絵1の設定
	var transition = Number(parameters["transition"] || 1);
	var foreFront = eval(parameters["foreFront"] || "false");
	// 立ち絵2の設定
	var transition2 = Number(parameters["transition2"] || 1);
	var foreFront2 = eval(parameters["foreFront2"] || "false");

	var focusToneAdjust = Number(parameters["focusToneAdjust"] || -96);
	var catheBootPicture = eval(parameters["catheBootPicture"] || "true");
	var sPictures = JSON.parse(parameters["sPictures"] || "null");
	var sPictureLists = [];
	if (sPictures) {
		sPictures.forEach(function(elm) {
			sPictureLists.push(JSON.parse(elm));
		});
	}

	//-----------------------------------------------------------------------------
	// PluginCommand (for MV)
    //

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === pluginName) {
            switch (args[0]) {
				case 'setEnabled':
					var enabled = eval(args[1] || "true");
					$gameSystem._StandingPictureDisabled = !enabled;
					break;
				case 'setTone':
					var setTone = args[1].split(',');
					var pictureTone = [Number(setTone[0]), Number(setTone[1]), Number(setTone[2]), Number(setTone[3])];
					$gameSystem._StandingPictureTone = pictureTone;
					break;
            }
        }
	};

	// 独自変数定義
	var animationCount = 0;
	var spriteSPicture = null;
	var showSPicture = false;
	var refSPicture = false;
	var motionSPicture = "";
	var animationCount2 = 0;
	var spriteSPicture2 = null;
	var showSPicture2 = false;
	var refSPicture2 = false;
	var motionSPicture2 = "";
	var focusSPicture = null;

	// アニメーションフレーム数定義
	var animationFrame = {
		"yes":       24,
		"yesyes":    48,
		"no":        24,
		"noslow":    48,
		"jump":      24,
		"jumpjump":  48,
		"jumploop":  48,
		"shake":     1,
		"shakeloop": 1,
		"runleft":   1,
		"runright":  1,
		"none":      0
	};

	//-----------------------------------------------------------------------------
	// ExStandingPicture
	//
	// 立ち絵を表示する独自のクラスを追加定義します。

	class ExStandingPicture {

		static create (elm) {
			// 立ち絵1
			elm._spSprite = new Sprite();
			elm._spSprite.bitmap = null;
			elm._spSprite.opacity = 0;
			elm._spSprite.opening = false;
			elm._spSprite.closing = false;
			elm._spSprite.originX = 0;
			elm._spSprite.originY = 0;
			elm._spSprite.showing = false;
			// 立ち絵2
			elm._spSprite2 = new Sprite();
			elm._spSprite2.bitmap = null;
			elm._spSprite2.opacity = 0;
			elm._spSprite2.opening = false;
			elm._spSprite2.closing = false;
			elm._spSprite2.originX = 0;
			elm._spSprite2.originY = 0;
			elm._spSprite2.showing = false;
			// 重なり順を指定
			if (foreFront) {
				elm.addChildAt(elm._spSprite, elm.children.indexOf(elm._windowLayer) + 1);
			} else {
				elm.addChildAt(elm._spSprite, elm.children.indexOf(elm._spriteset) + 1);
			}
			if (foreFront2) {
				elm.addChildAt(elm._spSprite2, elm.children.indexOf(elm._windowLayer) + 1);
			} else {
				elm.addChildAt(elm._spSprite2, elm.children.indexOf(elm._spriteset) + 1);
			}
		}

		static update (elm) {
			// 立ち絵を非表示に設定している場合、処理を中断
			if ($gameSystem._StandingPictureDisabled) {
				elm._spSprite.opacity = 0;
				elm._spSprite2.opacity = 0;
				return;
			}
			// 立ち絵1ピクチャ作成
			if (spriteSPicture && refSPicture) {
				this.refresh(elm._spSprite, spriteSPicture, 1);
				refSPicture = false;
			}
			// 立ち絵2ピクチャ作成
			if (spriteSPicture2 && refSPicture2) {
				this.refresh(elm._spSprite2, spriteSPicture2, 2);
				refSPicture2 = false;
			}

			// フォーカス処理
			if (focusSPicture == 1 || focusSPicture == 0) {
				elm._spSprite2.setBlendColor([0, 0, 0, (focusToneAdjust * -1)]);
			}
			if (focusSPicture == 2 || focusSPicture == 0) {
				elm._spSprite.setBlendColor([0, 0, 0, (focusToneAdjust * -1)]);
			}

			// フェード処理
			if (showSPicture) {
				this.fadeIn(elm._spSprite, spriteSPicture, 1);
			} else {
				this.fadeOut(elm._spSprite, spriteSPicture, 1);
			}
			if (showSPicture2) {
				this.fadeIn(elm._spSprite2, spriteSPicture2, 2);
			} else {
				this.fadeOut(elm._spSprite2, spriteSPicture2, 2);
			}

			// 立ち絵モーション再生
			if (!elm._spSprite.opening && !elm._spSprite.closing && animationCount > 0) {
				animationCount = this.animation(elm._spSprite, motionSPicture, animationCount);
			}
			if (!elm._spSprite2.opening && !elm._spSprite2.closing && animationCount2 > 0) {
				animationCount2 = this.animation(elm._spSprite2, motionSPicture2, animationCount2);
			}

			//console.log("[1] x:" + elm._spSprite.x + " y:" + elm._spSprite.y + " opacity:" + elm._spSprite.opacity + " motion: " + motionSPicture + " opening: " + elm._spSprite.opening + " closing: " + elm._spSprite.closing + " scaleX: " + elm._spSprite.scale.x);
			//console.log("[2] x:" + elm._spSprite2.x + " y:" + elm._spSprite2.y + " opacity:" + elm._spSprite2.opacity + " motion: " + motionSPicture2 + " opening: " + elm._spSprite2.opening + " closing: " + elm._spSprite2.closing + " scaleX: " + elm._spSprite2.scale.x);
		}

		static refresh (sSprite, sPicture, sNumber) {
			sSprite.bitmap = null;
			sSprite.bitmap = ImageManager.loadPicture(sPicture.imageName);
			sSprite.showing = false;
			var calcScaleX = Number(sPicture.scaleX);
			var calcScaleY = Number(sPicture.scaleY);
			// 左右反転させる場合 (立ち絵2)
			if (sNumber == 2) calcScaleX *= Number(sPicture.reverse);
			// 画像が読み込まれたあとに実行
			sSprite.bitmap.addLoadListener(function() {
				if (Number(sPicture.origin) == 0) {
					// 左上原点
					if (sNumber == 1) {
						sSprite.x = Number(sPicture.x);
						sSprite.y = Number(sPicture.y);
						sSprite.originX = Number(sPicture.x);
						sSprite.originY = Number(sPicture.y);
					}
					if (sNumber == 2) {
						sSprite.x = Number(sPicture.x2);
						sSprite.y = Number(sPicture.y2);
						sSprite.originX = Number(sPicture.x2);
						sSprite.originY = Number(sPicture.y2);
					}
				} else {
					// 中央原点
					if (sNumber == 1) {
						sSprite.x = Number(sPicture.x) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.y = Number(sPicture.y) - (sSprite.height * calcScaleY / 100) / 2;
						sSprite.originX = Number(sPicture.x) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.originY = Number(sPicture.y) - (sSprite.height * calcScaleY / 100) / 2;
					}
					if (sNumber == 2) {
						sSprite.x = Number(sPicture.x2) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.y = Number(sPicture.y2) - (sSprite.height * calcScaleY / 100) / 2;
						sSprite.originX = Number(sPicture.x2) - (sSprite.width * calcScaleX / 100) / 2;
						sSprite.originY = Number(sPicture.y2) - (sSprite.height * calcScaleY / 100) / 2;
					}
				}
				// 切替効果
				if (sSprite.opacity == 0) {
					if (sNumber == 1) {
						if (transition == 0) sSprite.opacity = Number(sPicture.opacity);
						if (transition == 2) sSprite.x -= 30;
						if (transition == 3) sSprite.x += 30;
						if (transition == 4) sSprite.y += 30;
						if (transition == 5) sSprite.y -= 30;
					}
					if (sNumber == 2) {
						if (transition2 == 0) sSprite.opacity = Number(sPicture.opacity);
						if (transition2 == 2) sSprite.x -= 30;
						if (transition2 == 3) sSprite.x += 30;
						if (transition2 == 4) sSprite.y += 30;
						if (transition2 == 5) sSprite.y -= 30;
					}
				}
				sSprite.blendMode = Number(sPicture.blendMode);
				sSprite.setColorTone($gameSystem._StandingPictureTone ? $gameSystem._StandingPictureTone : [0, 0, 0, 0]);
				sSprite.setBlendColor([0, 0, 0, 0]);
				sSprite.scale.x = calcScaleX / 100;
				sSprite.scale.y = calcScaleY / 100;
				sSprite.showing = true;
			}.bind(this));
		}

		static fadeIn (sSprite, sPicture, sNumber) {
			if (!sSprite.showing) return;
			if (sSprite.opacity >= Number(sPicture.opacity)) {
				sSprite.opening = false;
				sSprite.opacity = Number(sPicture.opacity);
				return;
			}
			sSprite.opening = true;
			sSprite.closing = false;
			// 切替効果
			if (sSprite.originX > sSprite.x) sSprite.x += 2;
			if (sSprite.originX < sSprite.x) sSprite.x -= 2;
			if (sSprite.originY < sSprite.y) sSprite.y -= 2;
			if (sSprite.originY > sSprite.y) sSprite.y += 2;
			sSprite.opacity += Number(sPicture.opacity) / 15;
		}

		static fadeOut (sSprite, sPicture, sNumber) {
			if (sSprite.opacity == 0) {
				sSprite.closing = false;
				return;
			}
			sSprite.closing = true;
			if (!sPicture) {
				sSprite.opacity = 0;
				return;
			}
			sSprite.opacity -= Number(sPicture.opacity) / 15;
			// 切替効果
			if (sNumber == 1) {
				if (transition == 0) sSprite.opacity = 0;
				if (transition == 2 && sSprite.originX - 30 < sSprite.x) sSprite.x -= 2;
				if (transition == 3 && sSprite.originX + 30 > sSprite.x) sSprite.x += 2;
				if (transition == 4 && sSprite.originY + 30 > sSprite.y) sSprite.y += 2;
				if (transition == 5 && sSprite.originY - 30 < sSprite.y) sSprite.y -= 2;
			}
			if (sNumber == 2) {
				if (transition2 == 0) sSprite.opacity = 0;
				if (transition2 == 2 && sSprite.originX - 30 < sSprite.x) sSprite.x -= 2;
				if (transition2 == 3 && sSprite.originX + 30 > sSprite.x) sSprite.x += 2;
				if (transition2 == 4 && sSprite.originY + 30 > sSprite.y) sSprite.y += 2;
				if (transition2 == 5 && sSprite.originY - 30 < sSprite.y) sSprite.y -= 2;
			}
		}

		static animation (sSprite, sMotion, animationCount) {
			if (!sSprite.showing) return animationCount;
			if (sMotion == "yes") {
				if (animationCount > 12) {
					sSprite.y += 2;
				} else {
					sSprite.y -= 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "yesyes") {
				if (animationCount > 36) {
					sSprite.y += 2;
				} else if (animationCount > 24) {
					sSprite.y -= 2;
				} else if (animationCount > 12) {
					sSprite.y += 2;
				} else {
					sSprite.y -= 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "no") {
				if (animationCount > 18) {
					sSprite.x += 2;
				} else if (animationCount > 6) {
					sSprite.x -= 2;
				} else {
					sSprite.x += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "noslow") {
				if (animationCount > 36) {
					sSprite.x += 1;
				} else if (animationCount > 12) {
					sSprite.x -= 1;
				} else {
					sSprite.x += 1;
				}
				animationCount -= 1;
			}
			if (sMotion == "jump") {
				if (animationCount > 12) {
					sSprite.y -= 2;
				} else {
					sSprite.y += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "jumpjump") {
				if (animationCount > 36) {
					sSprite.y -= 2;
				} else if (animationCount > 24) {
					sSprite.y += 2;
				} else if (animationCount > 12) {
					sSprite.y -= 2;
				} else {
					sSprite.y += 2;
				}
				animationCount -= 1;
			}
			if (sMotion == "jumploop") {
				if (animationCount > 36) {
					sSprite.y -= 2;
				} else if (animationCount > 24) {
					sSprite.y += 2;
				}
				animationCount -= 1;
				if (animationCount == 0) animationCount = 48;
			}
			if (sMotion == "shake") {
				if (animationCount <= 2) {
					sSprite.x -= 2;
					animationCount += 1;
				} else if (animationCount <= 4) {
					sSprite.y -= 2;
					animationCount += 1;
				} else if (animationCount <= 6) {
					sSprite.x += 4;
					sSprite.y += 4;
					animationCount += 1;
				} else if (animationCount <= 8) {
					sSprite.y -= 2;
					animationCount += 1;
				} else if (animationCount == 9) {
					sSprite.x -= 2;
					animationCount += 1;
				} else if (animationCount == 10) {
					sSprite.x -= 2;
					animationCount = 0;
				}
			}
			if (sMotion == "shakeloop") {
				if (animationCount <= 2) {
					sSprite.x -= 1;
					animationCount += 1;
				} else if (animationCount <= 4) {
					sSprite.y -= 1;
					animationCount += 1;
				} else if (animationCount <= 6) {
					sSprite.x += 2;
					sSprite.y += 2;
					animationCount += 1;
				} else if (animationCount <= 8) {
					sSprite.y -= 1;
					animationCount += 1;
				} else if (animationCount <= 10) {
					sSprite.x -= 1;
					animationCount += 1;
				}
				if (animationCount > 10) animationCount = 1;
			}
			if (sMotion == "runleft") {
				sSprite.x -= 16;
				if (sSprite.x < -2000) animationCount = 0;
			}
			if (sMotion == "runright") {
				sSprite.x += 16;
				if (sSprite.x > 2000) animationCount = 0;
			}
			return animationCount;
		}
	}

	var _Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_Scene_Map_update.apply(this, arguments);
		ExStandingPicture.update(this);
	};

	var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function() {
		_Scene_Map_createDisplayObjects.apply(this, arguments);
		ExStandingPicture.create(this);
	};

	var _Scene_Battle_update = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function() {
		_Scene_Battle_update.apply(this, arguments);
		ExStandingPicture.update(this);
	};

	var _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
	Scene_Battle.prototype.createDisplayObjects = function() {
		_Scene_Battle_createDisplayObjects.apply(this, arguments);
		ExStandingPicture.create(this);
	};

	var _Window_Message_updateClose = Window_Message.prototype.updateClose;
	Window_Message.prototype.updateClose = function() {
		// ピクチャ消去判定
		if (this._closing && this.openness == 255) {
			showSPicture = false;
			showSPicture2 = false;
			motionSPicture = "";
			motionSPicture2 = "";
	    }
		_Window_Message_updateClose.apply(this, arguments);
	};

	var _Window_Message_startMessage = Window_Message.prototype.startMessage;
	Window_Message.prototype.startMessage = function() {
		var messageAllText = $gameMessage.allText();
		messageAllText = messageAllText.replace(/\\V\[(\d+)\]/gi, function() {
			return $gameVariables.value(parseInt(arguments[1]));
		}.bind(this));

		// 専用制御文字を取得 (\F[s])
		var sPictureNumber = null;
		var processEscapeNumber = messageAllText.match(/\\F\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureNumber = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\FF[s])
		var sPictureNumber2 = null;
		processEscapeNumber = messageAllText.match(/\\FF\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureNumber2 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\M[s])
		var sPictureMotion = null;
		processEscapeNumber = messageAllText.match(/\\M\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureMotion = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\MM[s])
		var sPictureMotion2 = null;
		processEscapeNumber = messageAllText.match(/\\MM\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				sPictureMotion2 = processEscapeNumber[1];
			}
		}
		// 専用制御文字を取得 (\AA[s])
		focusSPicture = null;
		processEscapeNumber = messageAllText.match(/\\AA\[(\w+)\]/);
		if (processEscapeNumber) {
			if (processEscapeNumber[1]) {
				focusSPicture = processEscapeNumber[1];
				// v2.1.0 \AA[F]、\AA[FF]、\AA[N]を置換
				if (focusSPicture == "F") focusSPicture = 1;
				if (focusSPicture == "FF") focusSPicture = 2;
				if (focusSPicture == "N") focusSPicture = 0;
			}
		}
		// 立ち絵1を更新
		if (sPictureNumber) {
			// var sPicture = sPictureLists.find(function(item, index) {
			// 	if (parseInt(item.id) == sPictureNumber) return true;
			// });
			//spriteSPicture = sPicture;

			// for Ver.1.5.1
			var sPicture = sPictureLists.filter(function(item, index) {
				if (String(item.id) == sPictureNumber) return true;
			});
			spriteSPicture = sPicture[0];

			if (sPicture[0]) {
				showSPicture = true;
				refSPicture = true;
			} else {
				showSPicture = false;
				refSPicture = false;
			}
			// 再生モーション定義
			motionSPicture = sPictureMotion ? sPictureMotion : "none";
			animationCount = animationFrame[motionSPicture];
		} else {
			showSPicture = false;
			motionSPicture = "";
		}
		// 立ち絵2を更新
		if (sPictureNumber2) {
			// var sPicture2 = sPictureLists.find(function(item, index) {
			// 	if (parseInt(item.id) == sPictureNumber2) return true;
			// });
			// spriteSPicture2 = sPicture2;

			// for Ver.1.5.1
			var sPicture2 = sPictureLists.filter(function(item, index) {
				if (String(item.id) == sPictureNumber2) return true;
			});
			spriteSPicture2 = sPicture2[0];

			if (sPicture2[0]) {
				showSPicture2 = true;
				refSPicture2 = true;
			} else {
				showSPicture2 = false;
				refSPicture2 = false;
			}
			// 再生モーション定義
			motionSPicture2 = sPictureMotion2 ? sPictureMotion2 : "none";
			animationCount2 = animationFrame[motionSPicture2];
		} else {
			showSPicture2 = false;
			motionSPicture2 = "";
		}

		_Window_Message_startMessage.apply(this, arguments);
	};

	var _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
	Window_Base.prototype.convertEscapeCharacters = function(text) {
		// 立ち絵呼び出し用の制御文字(\V[n]内包)を追加
		text = text.replace(/\\F\[\\V\[(\d+)\]\]/gi, "");
		text = text.replace(/\\FF\[\\V\[(\d+)\]\]/gi, "");

		// 立ち絵呼び出し用の制御文字を追加
		text = text.replace(/\\F\[(\w+)\]/gi, "");
		text = text.replace(/\\FF\[(\w+)\]/gi, "");
		text = text.replace(/\\M\[(\w+)\]/gi, "");
		text = text.replace(/\\MM\[(\w+)\]/gi, "");
		text = text.replace(/\\AA\[(\w+)\]/gi, "");

		return _Window_Base_convertEscapeCharacters.call(this, text);
	};

	var _Scene_Boot_create = Scene_Boot.prototype.create;
	Scene_Boot.prototype.create = function() {
		_Scene_Boot_create.apply(this, arguments);

		this.loadLLStandingPictures();
	};

	Scene_Boot.prototype.loadLLStandingPictures = function() {
		if (!catheBootPicture) return;

		// 立ち絵画像を事前読み込み
		// const startTime = Date.now();
		sPictureLists.forEach(function(elm) {
			ImageManager.loadPicture(elm.imageName);
		});
		// const endTime = Date.now();

		// console.log("LL_StandingPicture: Cathe OK (" + (endTime - startTime) + "ms)");
	};
})();
