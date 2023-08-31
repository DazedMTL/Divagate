//=============================================================================
// Pon_EventScroll.js
//=============================================================================
//Copyright (c) 2020 Ponpoko Neruson
//Released under the MIT license
//https://opensource.org/licenses/mit-license.php
//
//連絡先	:ponpokonerusontanuki@gmail.com
/*:
 * @plugindesc 画面の自動スクロールの対象に
 *イベントを指定できるようにします。
 * @author ぽんぽこねるそん
 *
 * @help  <使い方>
 *下記のプラグインコマンドで実行してください。
 *
 *<プラグインコマンド>
 *ScrollCaracter charaId
 *画面の自動スクロールの対象をcharaIdのキャラに変更します。
 *
 *<charaId対応表>
 *  -1:プレイヤー
 *   0:このイベント(実行しているイベント)
 *  1~:イベントID
 *
 *ex.自動スクロールの対象をこのイベントにする
 *ScrollCaracter 0
 *
 *
 * Var 1.00 20/01/23		やっつけ完成
 */




(function() {
	//=============================================================================
	// プラグインコマンドの追加
	//=============================================================================
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command === 'ScrollCaracter') {
			var charaId = Number(args[0]);
			console.log(charaId)
			if (this.character(charaId)){
				if (charaId === 0){charaId = this.character(charaId).eventId()};
				$gameMap.setScrollCharacterId(charaId);
				};
		}
	};
	//=============================================================================
	// Game_Mapセットアップ
	//=============================================================================
	var _gameMapSetup = Game_Map.prototype.setup;
	Game_Map.prototype.setup = function(mapId) {
		_gameMapSetup.call(this, mapId)
		this.setScrollCharacterId(-1);
		this._scrollCharacterId = false;
	};
	//=============================================================================
	// スクロールキャラの取得
	//=============================================================================
	Game_Map.prototype.getScrollCharacterId = function() {
		if (!this._scrollCharacterId){this._scrollCharacterId = -1};
		return this._scrollCharacterId;
	};
	//=============================================================================
	// スクロールキャラの変更
	//=============================================================================
	Game_Map.prototype.setScrollCharacterId = function(charaId) {
		if (charaId === -1 || (this.event(charaId) && !this.event(charaId)._erased)){this._scrollCharacterId = charaId};
		var chara = charaId === -1 ? $gamePlayer : this.event(charaId);
		if (chara){chara.center(chara.x, chara.y)};
	};
	//=============================================================================
	// プレイヤースクロール更新
	//=============================================================================
	var _gamePlayerUpdateScroll = Game_Player.prototype.updateScroll;
	Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
		if ($gameMap.getScrollCharacterId() === -1){_gamePlayerUpdateScroll.call(this, lastScrolledX, lastScrolledY)};
	};
	//=============================================================================
	// Game_Eventスクロール更新
	//=============================================================================
	Game_Event.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
		if ($gameMap.getScrollCharacterId() != this.eventId()){return};
		var x1 = lastScrolledX;
		var y1 = lastScrolledY;
		var x2 = this.scrolledX();
		var y2 = this.scrolledY();
		if (y2 > y1 && y2 > this.centerY()) {
			$gameMap.scrollDown(y2 - y1);
		}
		if (x2 < x1 && x2 < this.centerX()) {
			$gameMap.scrollLeft(x1 - x2);
		}
		if (x2 > x1 && x2 > this.centerX()) {
			$gameMap.scrollRight(x2 - x1);
		}
		if (y2 < y1 && y2 < this.centerY()) {
			$gameMap.scrollUp(y1 - y2);
		}
	};
	//=============================================================================
	// Game_EventセンターX
	//=============================================================================
	Game_Event.prototype.centerX = function() {
		return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
	};
	//=============================================================================
	// Game_EventセンターY
	//=============================================================================
	Game_Event.prototype.centerY = function() {
		return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
	};
	//=============================================================================
	// Game_Event画面を中央に
	//=============================================================================
	Game_Event.prototype.center = function(x, y) {
		return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
	};
	//=============================================================================
	// Game_Eventフレーム更新
	//=============================================================================
	var _gameEventUpdate = Game_Event.prototype.update;
	Game_Event.prototype.update = function() {
		var lastScrolledX = this.scrolledX();
		var lastScrolledY = this.scrolledY();
		_gameEventUpdate.call(this);
		this.updateScroll(lastScrolledX, lastScrolledY);
	};
})();
 