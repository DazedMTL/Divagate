//=============================================================================
// NYA_ZeldaLifeHud.js
//=============================================================================

/*:
 * @plugindesc ゼルダ風のライフHUDを表示するプラグイン
 * @author Nyatama(Original:Moghunter)
 *
 * @param Initial Visible
 * @desc 初期状態で表示させる
 * @type boolean
 * @default true
 * @on 表示
 * @off 非表示
 *
 * @param Hud X-Axis
 * @desc ライフHUDのX軸位置指定
 * @default 0
 *
 * @param Hud Y-Axis
 * @desc ライフHUDのY軸位置指定
 * @default 0
 *
 * @param Fade Limit
 * @desc プラグインコマンドにより表示状態を変更するときにフェードさせる時間
 * @default 60 
 *
 
 *
 * @param >> HP ===================
 * @desc 
 * @default 
 *
 * @param HP Icon Visible
 * @desc ライフを表示します
 * @type boolean
 * @default true
 * @on 表示
 * @off 非表示
 *
 * @param HP Icon Half Mode
 * @desc １つのハートでライフ２つ分を表します
 * @type boolean
 * @default true 
 * @on 有効
 * @off 無効
 *
 * @param HP Icon Max Colors
 * @desc アイコンの色数
 * 画像の量は色の数で除算されます。
 * @default 2
 *
 * @param HP Icon Max Rows
 * @desc ハートアイコンの最大列数
 * @default 10
 *
 * @param HP Icon Max Columns
 * @desc ハートアイコンの最大行数
 * @default 2
 *
 * @param HP Icon X-Axis
 * @desc 最大ライフのX軸位置
 * @default 67
 *
 * @param HP Icon Y-Axis
 * @desc ライフのY座標
 * @default 60
 *
 * @param HP Icon Space X
 * @desc ハートアイコン間の水平方向のスペースの設定
 * @default 0
 *
 * @param HP Icon Space Y
 * @desc アイコン間の垂直方向のスペースの設定
 * @default 0
 *
 * @param HP Icon Zoom Anime
 * @desc 最後のアイコンでズームアニメーションを有効
 * @type boolean
 * @default true
 * @on 有効
 * @off 無効
 *
 *
 * @help  
 * =============================================================================
 * NYA_ZeldaLifeHud
 * Original: MOG Actor Hud (v1.8) By Moghunter[https://atelierrgss.wordpress.com/]
 *  (Edit by Nyatama)
 * =============================================================================
 *
 * このプラグインはMoghunter様のMOG Actor Hud (v1.8)からゼルダライフ表示部のみ
 * 抜粋したプラグインとなります。
 * オリジナルのプラグインからライフ表示に必要な関数以外全て削除していますので
 * 潜在的な不具合が出る可能性もあります。そうなった場合は本家のほうをご利用ください。
 *
 * 以下の画像ファイルをimg/actorhud/に入れること
 *
 * Layout.png   ←ライフの背景（フレーム）ファイル
 * HP_Icon.png  ←ライフの画像ファイル
 *
 * <注意！>
 * アクターのHPを参照してライフ数を変更します。
 * 職業の能力値曲線（最大HP）を小さくしないとハートが増えすぎて表示限界を越えてしまいます。
 * この点のみ注意してご利用ください。
 * 
 *
 * =============================================================================
 * PLUGIN COMMAND
 * =============================================================================
 * 
 * hide_actor_hud　　　←ライフのHUDを非表示にするとき
 * show_actor_hud　　　←ライフのHUDを表示するとき
 * 
 *        
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_ActorHud = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('NYA_ZeldaLifeHud');
   
    // HUD POSITION
	Moghunter.ahud_pos_x = Number(Moghunter.parameters['Hud X-Axis'] || 0);
	Moghunter.ahud_pos_y = Number(Moghunter.parameters['Hud Y-Axis'] || 0);
	Moghunter.ahud_fade_limit = Number(Moghunter.parameters['Fade Max'] || 90);	
		
	// HP ICON POSITION
	Moghunter.ahud_hp_icon_visible = String(Moghunter.parameters['HP Icon Visible'] || 'true');
	Moghunter.ahud_hp_icon_halfMode = String(Moghunter.parameters['HP Icon Half Mode'] || 'true');	
	Moghunter.ahud_hp_icon_colorMax = Number(Moghunter.parameters['HP Icon Max Colors'] || 2);	 
	Moghunter.ahud_hp_icon_rows = Number(Moghunter.parameters['HP Icon Max Rows'] || 10);
	Moghunter.ahud_hp_icon_cols = Number(Moghunter.parameters['HP Icon Max Columns'] || 2);	
	Moghunter.ahud_hp_icon_pos_x = Number(Moghunter.parameters['HP Icon X-Axis'] || 67);
	Moghunter.ahud_hp_icon_pos_y = Number(Moghunter.parameters['HP Icon Y-Axis'] || 60);	
	Moghunter.ahud_hp_icon_space_x = Number(Moghunter.parameters['HP Icon Space X'] || 0);
	Moghunter.ahud_hp_icon_space_y = Number(Moghunter.parameters['HP Icon Space Y'] || 0);	
	Moghunter.ahud_hp_icon_zoomAnime = String(Moghunter.parameters['HP Icon Zoom Anime'] || 'true');	

    Moghunter.ahud_hudvisible = String(Moghunter.parameters['Initial Visible'] || "false");	

//=============================================================================
// ** ImageManager
//=============================================================================

//==============================
// * BHud
//==============================
ImageManager.loadAHud = function(filename) {
    return this.loadBitmap('img/actorhud/', filename, 0, true);
};			

//=============================================================================
// ** Game_System
//=============================================================================

//==============================
// * Initialize
//==============================
var _alias_mog_ahud_sys_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	_alias_mog_ahud_sys_initialize.call(this);
	this._ahud_position = [0,0];
	this._ahud_visible = String(Moghunter.ahud_hudvisible) === "true" ? true : false;
};

//=============================================================================
// ** Game Character Base 
//=============================================================================

//==============================
// * Screen RealX
//==============================
Game_CharacterBase.prototype.screen_realX = function() {
    return this.scrolledX() * $gameMap.tileWidth();
};

//==============================
// * Screen RealY
//==============================
Game_CharacterBase.prototype.screen_realY = function() {
    return this.scrolledY() * $gameMap.tileHeight();
};

//=============================================================================
// ** Game_Interpreter
//=============================================================================	

//==============================
// * PluginCommand
//==============================
var _alias_mog_actorhud_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_alias_mog_actorhud_pluginCommand.call(this,command, args)
	if (command === "show_actor_hud")  { $gameSystem._ahud_visible = true};
	if (command === "hide_actor_hud")  { $gameSystem._ahud_visible = false;};
	return true;
};


//=============================================================================
// ** Scene Map
//=============================================================================	

//==============================
// * create All Windows
//==============================
var _mog_actorHud_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    this.create_actor_hud();
	_mog_actorHud_createAllWindows.call(this);	
};


//==============================
// * Create Actor Hud
//==============================
Scene_Map.prototype.create_actor_hud = function() {
	this._actor_hud = new Actor_Hud();
	this.addChild(this._actor_hud);	
    
};

//=============================================================================
// * Actor_Hud
//=============================================================================
function Actor_Hud() {
    this.initialize.apply(this, arguments);
};

Actor_Hud.prototype = Object.create(Sprite.prototype);
Actor_Hud.prototype.constructor = Actor_Hud;

//==============================
// * Initialize
//==============================
Actor_Hud.prototype.initialize = function(hud_id) {
    Sprite.prototype.initialize.call(this);	
    this._data_initial_ref = [0,true];
	this._hud_id = hud_id;
	this._hud_size = [-1,-1,-1,-1];
    this.base_parameter_clear();
    this.load_img();
	if (!$gameSystem._ahud_visible) {this.opacity = 0};
	this.update();
};

//==============================
// * Load Img
//==============================
Actor_Hud.prototype.load_img = function() {
	this._layout_img = ImageManager.loadAHud("Layout");
	if (String(Moghunter.ahud_hp_icon_visible) == "true") {this._hp_icon_img = ImageManager.loadAHud("HP_Icon")};
};

//==============================
// * Base Parameter Clear
//==============================
Actor_Hud.prototype.base_parameter_clear = function() {
 	 this._hp_old = [-1,-1];
	 this._maxhp_old = [-1,-1];
	 this._hp_old_ani = [-1,-1];
	 this._hp_flow = [false,0,0,0];
	 this._hp_icon_old = [-1,-1];
	 this._active = false;
	 this._hud_size = [0,0];
};

//==============================
// * Need Refresh Bhud
//==============================
Actor_Hud.prototype.need_refreh_bhud = function() {
	if (this._data_initial_ref[1]) {return true};
	if (this._battler != $gameParty.members()[0]) {return true};
	return false;
};

//==============================
// * Refresh Bhud
//==============================
Actor_Hud.prototype.refresh_bhud = function() {
	 this._data_initial_ref[1] = false;
	 this._battler = $gameParty.members()[0];
	 this._hud_size = [0,0];
	 this.base_parameter_clear();
	 this.create_base_sprites();
};

//==============================
// * Refresh Position
//==============================
Actor_Hud.prototype.refresh_position = function() {
	 this.set_hud_position();	      
	 this.create_sprites();
 	 this._layout.x = this._pos_x;
	 this._layout.y = this._pos_y;
};

//==============================
// * Set Hud Position
//==============================
Actor_Hud.prototype.set_hud_position = function() {
     this._hud_size[0] = Moghunter.ahud_pos_x - ($gameMap.tileWidth() / 2);
     this._hud_size[1] = Moghunter.ahud_pos_y - ($gameMap.tileHeight() / 2);
     this._hud_size[2] = Moghunter.ahud_pos_x + this._layout.bitmap.width - $gameMap.tileWidth();
     this._hud_size[3] = Moghunter.ahud_pos_y + this._layout.bitmap.height;	 
	 this._pos_x = Moghunter.ahud_pos_x;
	 this._pos_y = Moghunter.ahud_pos_y;
};

//==============================
// * Update
//==============================
Actor_Hud.prototype.update = function() {
    Sprite.prototype.update.call(this);	
	if (this.need_refreh_bhud()) {this.refresh_bhud()};
    if (!this._battler) {this.visible = false;return};
	if (!this._layout_img.isReady()) {return};
	if (this._hud_size[0] === 0) {this.refresh_position();return};
	this.update_sprites();
};

//==============================
// * Create Base Sprites
//==============================
Actor_Hud.prototype.create_base_sprites = function() {
    this.create_layout(); 
};

//==============================
// * Create Sprites
//==============================
Actor_Hud.prototype.create_sprites = function() {
    
	this.create_hp_icon();
};

//==============================
// * Update Sprites
//==============================
Actor_Hud.prototype.update_sprites = function() {	
	this.update_visible();
    this.update_hp();
};

//==============================
// * Need Hide
//==============================
Actor_Hud.prototype.needHide = function(start) {
    if ($gameMessage.isBusy()) {return true};
	if (!$gameSystem._ahud_visible) {return true};
	if (!this._battler) {return true};
	return false
};

//==============================
// * Update visible
//==============================
Actor_Hud.prototype.update_visible = function() {
	 this.visible = true;
     if (this.needHide(false)) {
		 this.opacity -= 15;
	 } else {		 	
		if (this.needFade()) {
			if (this.opacity > Moghunter.ahud_fade_limit) {
				this.opacity -= 10;
				if (this.opacity < Moghunter.ahud_fade_limit) {this.opacity = Moghunter.ahud_fade_limit};
			 };
		} else {
				 this.opacity += 10;
		};		
	 };
};

//==============================
// * Need Fade
//==============================
Actor_Hud.prototype.needFade = function() {
    if (this._hud_size[0] === -1) {return false};
	if (!this._battler) {return false};
	if ($gamePlayer.screen_realX() < this._hud_size[0]) {return false};
	if ($gamePlayer.screen_realX() > this._hud_size[2]) {return false};
	if ($gamePlayer.screen_realY() < this._hud_size[1]) {return false};
	if ($gamePlayer.screen_realY() > this._hud_size[3]) {return false};	
    return true;
};


//==============================
// * Update Dif
//==============================
Actor_Hud.prototype.update_dif = function(value,real_value,speed) {
	if (value == real_value) {return value};
	var dnspeed = 1 + (Math.abs(value - real_value) / speed);
	if (value > real_value) {value -= dnspeed;
	    if (value < real_value) {value = real_value};}
    else if (value < real_value) {value  += dnspeed;
    	if (value  > real_value) {value  = real_value};		
    };
	return Math.floor(value);
};

//==============================
// * Need Refresh Parameter
//==============================
Actor_Hud.prototype.need_refresh_parameter = function(parameter) {
  switch (parameter) {
  	case 0:
         if (this._hp_old[0] != this._battler.hp) {return true};
		 if (this._hp_old[1] != this._battler.mhp) {return true};
         break;	 				
  };
  return false;
};

//==============================
// * Create Layout
//==============================
Actor_Hud.prototype.create_layout = function() {
	this.removeChild(this._layout);
	if (!this._battler) {return};
	this._layout = new Sprite(this._layout_img);
	this.addChild(this._layout);
};
	

//==============================
// * Create HP icon
//==============================
Actor_Hud.prototype.create_hp_icon = function() {
   if (String(Moghunter.ahud_hp_icon_visible) != "true") {return};
	if (this._hp_icons) {
	    for (var i = 0; i < this._hp_icons.length; i++) {
			this.removeChild(this._hp_icons[i]);
	    };
	    for (var i = 0; i < this._hp_iconsB.length; i++) {
			this.removeChild(this._hp_iconsB[i]);
	    };
	};	
	if (!this._battler) {return};	
	var n_icons = Moghunter.ahud_hp_icon_rows * Moghunter.ahud_hp_icon_cols;
	this._hp_icons = [];
	this._hp_icons.iconMode = String(Moghunter.ahud_hp_icon_halfMode) == "true" ? true : false;
	this._hp_iconsB = [];
	this._hp_iconsB.iconMode = this._hp_icons.iconMode;
	this._hp_IconZoomAnime = String(Moghunter.ahud_hp_icon_zoomAnime) == "true" ? true : false;
	var colors = Math.max(Moghunter.ahud_hp_icon_colorMax, 2)
	var cw = this._hp_icon_img.width / colors;
	var ch = this._hp_icon_img.height / 2;
	for (var i = 0; i < n_icons; i++) {
		 this._hp_iconsB[i] = new Sprite(this._hp_icon_img);
		 this._hp_iconsB[i].colorMax = colors;
		 this._hp_iconsB[i].anchor.x = 0.5;
		 this._hp_iconsB[i].anchor.y = 0.5;
		 this._hp_iconsB[i].rows = Moghunter.ahud_hp_icon_rows;
		 this._hp_iconsB[i].cols = Moghunter.ahud_hp_icon_cols;
		 this._hp_iconsB[i].org = [this._pos_x + Moghunter.ahud_hp_icon_pos_x - cw,this._pos_y + Moghunter.ahud_hp_icon_pos_y - ch];
		 this._hp_iconsB[i].spc = [Moghunter.ahud_hp_icon_space_x,Moghunter.ahud_hp_icon_space_y];
		 this._hp_iconsB[i].zoomA = this._hp_IconZoomAnime;
		 this._hp_iconsB[i].zoomData = [0,0,0,1.00];
		 this._hp_iconsB[i].visible = false;
		 this._hp_iconsB[i].enabled = false;
		 this.addChild(this._hp_iconsB[i]);
	};		
	for (var i = 0; i < n_icons; i++) {
		 this._hp_icons[i] = new Sprite(this._hp_icon_img);
		 this._hp_icons[i].colorMax = Math.max(Moghunter.ahud_hp_icon_colorMax, 2);
		 this._hp_icons[i].anchor.x = 0.5;
		 this._hp_icons[i].anchor.y = 0.5;		 
		 this._hp_icons[i].rows = Moghunter.ahud_hp_icon_rows;
		 this._hp_icons[i].cols = Moghunter.ahud_hp_icon_cols;
		 this._hp_icons[i].org = [this._pos_x + Moghunter.ahud_hp_icon_pos_x - cw,this._pos_y + Moghunter.ahud_hp_icon_pos_y - ch];
		 this._hp_icons[i].spc = [Moghunter.ahud_hp_icon_space_x,Moghunter.ahud_hp_icon_space_y];
		 this._hp_icons[i].zoomA = this._hp_IconZoomAnime;
		 this._hp_icons[i].zoomData = [0,0,0,1.00];	 
		 this._hp_icons[i].visible = false;
		 this._hp_icons[i].enabled = false;
		 this.addChild(this._hp_icons[i]);
	};
};


//==============================
// * refresh Icons
//==============================
Actor_Hud.prototype.refresh_icons = function(sprites,image,par,par_max,mode) {	
    var halfpar = Math.floor(par / 2);
	var parOdd1 = par%2;
	var parOdd2 = parOdd1 == 0 ? true : false;
	var prepar = par;
	par = sprites.iconMode ? (halfpar + parOdd1) : par;
	var prepar2 = par;
	var halfmaxpar = Math.floor(par_max / 2);
	var parmaxOdd1 = par_max%2;
	var parmaxOdd2 = parmaxOdd1 == 0 ? true : false;
	var preparmax = par_max;
	par_max = sprites.iconMode ? (halfmaxpar + parmaxOdd1) : par_max;
	var preparmax2 = par_max;	
	if (mode === 1 && par > sprites.length) {

			var mx_g = Math.floor(par / sprites.length);
			var mx_l = sprites.length * mx_g;
			var par = par - mx_l;
			if (par === 0) {par = sprites.length};
	};
	for (var i = 0; i < sprites.length; i++) {
		var icon = sprites[i];
		icon.visible = false;
		icon.opacity = 255;
		icon.enable = (prepar2 > 0 && i === (prepar2 - 1) && mode === 1) ? true : false;
		var cw = image.width / icon.colorMax;
		var ch = image.height;
		if (par > 0 && icon.colorMax > 2) {
			var lines  = Math.floor((prepar - 1) / sprites.length) + 1;
			if (lines >= icon.colorMax - 1) {
				var hp = (icon.colorMax - 1) * cw;
				if (mode === 1) {icon.opacity = 0};
			} else {
              if (mode === 0 && lines > 0) {lines--};
			  var hp = lines * cw;	
			};
		} else {
			if (mode === 1 && prepar2 > sprites.length) {
				par = prepar;
				icon.enable = false;
			};		
		    var hp = mode === 1 ? cw : 0;
		};
		var sX = cw + 2 + icon.spc[0];
		var sY = ch + 2 + icon.spc[1];
		var lX = sX * icon.rows;
		var lines = Math.floor(i / icon.rows);
		if (sprites.iconMode) {
			if (mode === 0) {
				icon.scale.x = 1.00;
				if (par_max <= sprites.length && i == par_max - 1) {
					icon.scale.x = !parmaxOdd2 ? 0.5 : 1.00;
				};
			} else  {
				if (prepar2 - 1 === i) {
					icon.scale.x = parOdd2 ? 1.00 : 0.50;
				} else {
					icon.scale.x = 1.00;
				};		
			};
		} else {
			icon.scale.x = 1.00;
		};
		icon.scale.y = icon.scale.x;
		icon.zoomData = [0,0,0,icon.scale.x]; 
		icon.visible = true
		if (par_max < sprites.length && i > (par_max - 1)) {icon.visible = false};
	 	if (mode === 1) {
			icon.visible = i > prepar2 - 1 ? false : true
		};
		icon.setFrame(hp,0,cw,ch);
		icon.x = icon.org[0] + (sX * i) - (lX * lines);
		icon.y = icon.org[1] + (sY * lines);
	};
};

//==============================
// * update Icon Zoom Anime
//==============================
Actor_Hud.prototype.updateIconZoomAnime = function(sprites) {
	for (var i = 0; i < sprites.length; i++) {
		 var icon = sprites[i];
		 if (icon.enable) {
			 icon.zoomData[1]++;
			 if (icon.zoomData[1] > 2) {
			     icon.zoomData[1] = 0;
				 icon.zoomData[2]++;
			     if (icon.zoomData[2] < 15) {
			         icon.zoomData[0] += 0.02;
				 } else if (icon.zoomData[2] < 30) {
					 icon.zoomData[0] -= 0.02;
				 } else {
					 icon.zoomData[0] = 0;
				     icon.zoomData[2] = 0;
				 };
			     icon.scale.x = icon.zoomData[3] + icon.zoomData[0];
			     icon.scale.y = icon.scale.x;
			 };
		 };
	};
};

//==============================
// * Update HP
//==============================
Actor_Hud.prototype.update_hp = function() {
	if (this._hp_icons) {
		if (this._hp_icon_old[0] != this._battler.hp || this._hp_icon_old[1] != this._battler.mhp) {
		    this._hp_icon_old[0] = this._battler.hp;
			this._hp_icon_old[1] = this._battler.mhp;
			this.refresh_icons(this._hp_iconsB,this._hp_icon_img,this._battler.hp,this._battler.mhp,0);
	        this.refresh_icons(this._hp_icons,this._hp_icon_img,this._battler.hp,this._battler.mhp,1);
		};
		if (this._hp_IconZoomAnime) {this.updateIconZoomAnime(this._hp_icons)};
    };
};
