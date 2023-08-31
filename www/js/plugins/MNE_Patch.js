//=============================================================================
// MNE_Patch.js
//
// ----------------------------------------------------------------------------
// by ecf5DTTzl6h6lJj02
// 2021/06/03
// ----------------------------------------------------------------------------
// Copyright (C) 2020 ecf5DTTzl6h6lJj02
//	This software is released under the MIT lisence.
//	http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc マップ名表示拡張プラグインの機能拡張プラグイン
 * @author ecf5DTTzl6h6lJj02
 *
 *
 * @param Integrate
 * @text 統合したマップ名を使用する
 * @desc 表示名の欄に設定した表示名と <MNE_MapNameX:aaa> で追加した表示名を
 * つないだものを表示名として使用します。
 * @type boolean
 * @default false
 * 
 * @help
 * マップ名表示拡張プラグインに他のプラグイン用に表示名を返却する関数を追加したものです。
 * プラグインパラメータ『統合したマップ名を使用する』の値に応じて、動作が変化します。
 * 
 * パラメータの値が、true の場合:
 * 表示名の欄に設定した名前と、<MNE_MapNameX:aaa> のメモタグで設定した表示名を
 * 半角スペース区切りでつないだものを返却します。
 * 例えば、マップの表示名が マップ1 、メモタグが <MNE_MapName2:〇〇の家> の場合、
 * マップ1 〇〇の家 という表示名になります。
 * 
 * パラメータの値が false の場合:
 * 表示名の欄に設定したマップ名のみを返却します。
 *
 * 他プラグインを編集して、
 * 表示名を取得する関数 $gameMap.displayName() を、$gameMap.displayNameForOthers() に
 * 変更する必要があります。
 */

(()=>{
    'use strict'

    const MapNameExtendValid = $plugins.some(plugin => plugin.name === 'MapNameExtend' && plugin.status);
    const Parameters = PluginManager.parameters('MapNameExtend');
    const UseRealMapName = Parameters['実名表示'] === 'true' || Parameters['ShowRealName'] === 'true';
    const MNEPatchParam = PluginManager.parameters('MNE_Patch');
    const MNEPatch_Integrate = MNEPatchParam['Integrate'] === 'true';

    if (MapNameExtendValid) {

        // プラグインパラメータ『』の値に応じて実行する関数を変更する。
        Game_Map.prototype.displayMapNameForOthers = function() {
            if (MNEPatch_Integrate){
                return this.getIntegrateDisplayMapName();
            } else {
                return this.getOriginDisplayMapName();
            }
        };

        // マップ本来の表示名を統合して、返却する。
        Game_Map.prototype.getIntegrateDisplayMapName = function() {
            if (UseRealMapName && $dataMap.displayName === '') {
                return $dataMapInfos[$gameMap.mapId()].name;
            } else {
                const MNEMetaValues = Object.entries($dataMap.meta).filter(entry => entry[0].match(/^MNE_MapName/)).map(entry => entry[1]);
                if(!MNEMetaValues.length) {
                    return $dataMap.displayName;
                }
                let displayMapName = $dataMap.displayName;
                MNEMetaValues.forEach(value => displayMapName += ' ' + value);
                return displayMapName;
            }
        };

        Game_Map.prototype.getOriginDisplayMapName = function() {
            if (UseRealMapName && $dataMap.displayName === '') {
                return $dataInfos[$gameMap.mapId()].name;
            } else {
                return $dataMap.displayName;
            }
        };
    } else {
        // マップ名表示拡張 が有効でなければ、通常の displayMapName 関数と同じ動作に
        GameMap.prototype.displayMapNameForOthers = function() {
            return $gameMap.displayMapName();
        };
    }
})();