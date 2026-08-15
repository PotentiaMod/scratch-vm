// @ts-check

/**
 * @fileoverview List of blocks to be supported in the compiler compatibility layer.
 * This is only for native blocks. Extensions should not be listed here.
 */

// Please keep these lists alphabetical.
// OH REALLY!? >8(
// What's with this big fat idea about these?

const stacked = [
    'looks_changeStretch',
    'looks_changestretchby',
	'looks_changeVisibilityOfSpriteShow',
    'looks_changeVisibilityOfSpriteHide',
    'looks_hideallsprites',
	'looks_layersSetLayer',
    'looks_previousbackdrop',
	'looks_previouscostume',
    'looks_say',
    'looks_sayforsecs',
    'looks_scream',
    'looks_screamforsecs',
	'looks_setHorizTransform',
	'looks_setStretch',
    'looks_setstretchto',
    'looks_setVertTransform',
	'looks_showallsprites',
	'looks_stoptalking',
    'looks_switchbackdroptoandwait',
    'looks_think',
    'looks_thinkforsecs',
    'motion_align_scene',
    'motion_glidesecstoxy',
    'motion_glideto',
    'motion_goto',
    'motion_pointtowards',
    'motion_scroll_right',
    'motion_scroll_up',
    'sensing_askandwait',
    'sensing_setdragmode',
    'sound_changeeffectby',
    'sound_changevolumeby',
    'sound_cleareffects',
    'sound_play',
    'sound_playuntildone',
    'sound_seteffectto',
    'sound_setvolumeto',
    'sound_stopallsounds'
];

const inputs = [
    'looks_getAllSpritesVisible',
    'looks_getbackdroplength',
	'looks_getcostumelength',
    'looks_getEffectValue',
    'looks_getinputofbackdrop',
	'looks_getinputofcostume',
	'looks_getOtherSpriteVisible',
    'looks_getSpriteVisible',
	'looks_getWhatBubbleIsDisplaying',
    'looks_layersGetLayer',
	'looks_sayColor',
    'looks_sayHeight',
    'looks_sayOther',
    'looks_sayWidth',
    'looks_stretchGetX',
    'looks_stretchGetY',
    'motion_xscroll',
    'motion_yscroll',
    'sensing_loud',
    'sensing_loudness',
    'sensing_online',
    'sensing_userid',
    'sound_volume'
];

module.exports = {
    stacked,
    inputs
};
