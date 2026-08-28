const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const EXTB_LIST = require('../../util/extb-definitions');
const {miscMenuBlocks, GenerateRJMenuAll} = require('../../myBlocks/menu');
const carBlocks = require('../../myBlocks/car');
const cameraBlocks = require('../../myBlocks/camerab');
const sensorBlocks = require('../../myBlocks/sensor');
const actionBlocks = require('../../myBlocks/action');
const { extb_iot } = require ('../../../src/util/extb-definitions');
// 方块图标链接
const blockIconURI = 'data:image/png;base64,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'

class UDblockIOT {
    constructor(runtime) {
        this.runtime = runtime;
        this.customBlocks = [].concat(
            sensorBlocks,
            actionBlocks(false, false),
            cameraBlocks
        )
        this.dblRelayPinYellow = {
            acceptReporters: true,
            items: []
        };
        this.dblRelayPinBlue = {
            acceptReporters: true,
            items: []
        };
        // 双路继电器生成菜单
        for (i in extb_iot.RJ11) {
            var yellowPin = extb_iot.RJ11[i].value[0];
            var bluePin = extb_iot.RJ11[i].value[1];
            if (!(yellowPin >= 34 && yellowPin <= 39)){
                this.dblRelayPinYellow.items.push({text:"RJ"+String(Number(i)+1), value: String(yellowPin)});
            }
            if (!(bluePin >= 34 && bluePin <= 39)){
                this.dblRelayPinBlue.items.push({text:"RJ"+String(Number(i)+1), value: String(bluePin)});
            }
        }

        
    }
    getIP(){
        // 获取IP地址
        var request = new XMLHttpRequest();
        var ip = "127.0.0.1"
        request.open("GET","http://127.0.0.1:12888/myIP",false)
        request.onreadystatechange = function(e){
            if (request.status == 200 && request.readyState == 4){
                ip = request.responseText;
                // console.log(ip)
            }
        }
        request.send()
        return ip
    }
    getInfo() {

        return {
            id: "udblockEXTBIOT",
            name: "智能语音拓展板",
            blockIconURI: blockIconURI,
            blocks: [
                {
                    type: "custom_seperator",
                    text: '★ 功能',
                },
                {
                    opcode: 'initAiPlayer',
                    blockType: BlockType.COMMAND,
                    text: '初始化AI播放器'
                },
                {
                    opcode: 'initAiPlayerWithIP',
                    blockType: BlockType.COMMAND,
                    text: '初始化AI播放器 本机IP[IP]',
                    arguments: {
                        IP: {
                            type: ArgumentType.STRING,
                            defaultValue: this.getIP()
                        }
                    }
                },
                {
                    opcode: 'enableSD',
                    blockType: BlockType.COMMAND,
                    text: '启用SD卡'
                },
                {
                    opcode: 'disableSD',
                    blockType: BlockType.COMMAND,
                    text: '禁用SD卡'
                },
                {
                    opcode: 'setVolume',
                    blockType: BlockType.COMMAND,
                    text: '设置音量为[VOL]',
                    arguments: {
                        VOL:{
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'startRecording',
                    blockType: BlockType.COMMAND,
                    text: '录音[DUARATION]秒 保存到文件名[FNAME]',
                    arguments: {
                        DUARATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        },
                        FNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "recorded.wav"
                        }
                    }
                },
                {
                    opcode: 'removeRecord',
                    blockType: BlockType.COMMAND,
                    text: '删除录音文件[FNAME]',
                    arguments: {
                        FNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "recorded.wav"
                        }
                    }
                },
                {
                    opcode: 'removeRecordAll',
                    blockType: BlockType.COMMAND,
                    text: '删除所有录音文件',
                },
                {
                    opcode: 'startPlaying',
                    blockType: BlockType.COMMAND,
                    text: '播放文件名[FNAME]',
                    arguments: {
                        FNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "recorded.wav"
                        }
                    }
                },
                {
                    opcode: 'startPlayingAsync',
                    blockType: BlockType.COMMAND,
                    text: '异步播放文件名[FNAME]',
                    arguments: {
                        FNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "recorded.wav"
                        }
                    }
                },
                {
                    opcode: 'startSTT',
                    blockType: BlockType.COMMAND,
                    text: '使用文件[FNAME]开始语音识别',
                    arguments: {
                        FNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "recorded.wav"
                        }
                    }
                },
                {
                    opcode: 'getSTTResult',
                    blockType: BlockType.REPORTER,
                    text: '获取语音识别结果',
                },
                {
                    opcode: 'getSTTResultContains',
                    blockType: BlockType.BOOLEAN,
                    text: '语音识别结果包含[TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "你好"
                        },
                    }
                },
                {
                    opcode: 'getSTTResultEquals',
                    blockType: BlockType.BOOLEAN,
                    text: '语音识别结果等于[TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "你好"
                        },
                    }
                },
                {
                    opcode: 'startTTS',
                    blockType: BlockType.COMMAND,
                    text: '开始语音合成 文本[TEXT] 并播放',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "你好"
                        },
                    }
                },
                {
                    opcode: 'startTTSSave',
                    blockType: BlockType.COMMAND,
                    text: '开始语音合成 文本[TEXT] 并保存到文件[FNAME]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "你好"
                        },
                        FNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "tts.mp3"
                        },
                    }
                },
                {
                    opcode: 'startASRMode',
                    blockType: BlockType.COMMAND,
                    text: '开始语音唤醒模式(小智同学)',
                },
                {
                    opcode: 'getASRResultBL',
                    blockType: BlockType.BOOLEAN,
                    text: '获取离线识别结果为[RESULT]',
                    arguments: {
                        RESULT: {
                            type: ArgumentType.STRING,
                            defaultValue: "1",
                            menu: "asrmenu"
                        }
                    }
                },
                {
                    opcode: 'getASRResult',
                    blockType: BlockType.REPORTER,
                    text: '离线识别结果',
                },
                {
                    opcode: 'asrResult',
                    blockType: BlockType.REPORTER,
                    text: '识别结果[RESULT]',
                    arguments: {
                        RESULT: {
                            type: ArgumentType.STRING,
                            defaultValue: "1",
                            menu: "asrmenu"
                        }
                    }
                },
                {
                    type: "custom_seperator",
                    text: '★ 指纹模块',
                },
                {
                    opcode: 'initFingerprint',
                    blockType: BlockType.COMMAND,
                    text: '初始化指纹模块',
                    arguments: {
                        VOL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                    }
                },
                {
                    opcode: 'enableFingerprint',
                    blockType: BlockType.COMMAND,
                    text: '启用指纹模块',
                },
                {
                    opcode: 'disableFingerprint',
                    blockType: BlockType.COMMAND,
                    text: '禁用指纹模块',
                },
                {
                    opcode: 'recordFinger',
                    blockType: BlockType.COMMAND,
                    text: '开始指纹录入',
                },
                {
                    opcode: 'renameFingerprint',
                    blockType: BlockType.COMMAND,
                    text: '重命名指纹[FID]为[NFID]',
                    arguments: {
                        FID: {
                            type: ArgumentType.STRING,
                            defaultValue: ""
                        },
                        NFID: {
                            type: ArgumentType.STRING,
                            defaultValue: ""
                        },
                    }
                },
                {
                    opcode: 'getFingerprintName',
                    blockType: BlockType.REPORTER,
                    text: '获取当前指纹名字',
                },
                {
                    opcode: 'getFingerprintId',
                    blockType: BlockType.REPORTER,
                    text: '获取当前指纹ID',
                },
                {
                    opcode: 'removeFingerprints',
                    blockType: BlockType.COMMAND,
                    text: '删除所有已录入指纹',
                },
                ...this.customBlocks
            ],
            menus: {
                asrmenu:  {
                    acceptReporters: true,
                    items: [
                        { text: "小智同学", value: "1" },
                        { text: "开灯", value: "2" },
                        { text: "关灯", value: "3" },
                        { text: "开红色的灯", value: "4" },
                        { text: "开绿色的灯", value: "5" },
                        { text: "开蓝色的灯", value: "6" },
                        { text: "播放歌曲", value: "7" },
                        { text: "现在有没有下雨", value: "8" },
                        { text: "当前湿度多少", value: "9" },
                        { text: "当前温度多少", value: "10" },
                        { text: "当前光照强度多少", value: "11" },
                        { text: "开风扇", value: "12" },
                        { text: "关风扇", value: "13" },
                        { text: "开窗帘", value: "14" },
                        { text: "关窗帘", value: "15" },
                        { text: "执行指令一", value: "16" },
                        { text: "执行指令二", value: "17" },
                        { text: "执行指令三", value: "18" },
                        { text: "执行指令四", value: "19" },
                        { text: "执行指令五", value: "20" },
                        { text: "执行指令六", value: "21" },
                        { text: "打开电机一", value: "22" },
                        { text: "打开电机二", value: "23" },
                        { text: "打开电机三", value: "24" },
                        { text: "打开电机四", value: "25" },
                        { text: "打开灯带一", value: "26" },
                        { text: "打开灯带二", value: "27" },
                        { text: "打开灯带三", value: "28" },
                        { text: "打开灯带四", value: "29" },
                        { text: "打开灯带五", value: "30" },
                        { text: "打开灯带六", value: "31" },
                        { text: "打开灯带七", value: "32" },
                        { text: "打开灯带八", value: "33" },
                        { text: "关闭灯带一", value: "34" },
                        { text: "关闭灯带二", value: "35" },
                        { text: "关闭灯带三", value: "36" },
                        { text: "关闭灯带四", value: "37" },
                        { text: "关闭灯带五", value: "38" },
                        { text: "关闭灯带六", value: "39" },
                        { text: "关闭灯带七", value: "40" },
                        { text: "关闭灯带八", value: "41" },
                        { text: "打开双路继电器一黄路", value: "42" },
                        { text: "打开双路继电器一蓝路", value: "43" },
                        { text: "打开双路继电器二黄路", value: "44" },
                        { text: "打开双路继电器二蓝路", value: "45" },
                        { text: "打开双路继电器三黄路", value: "46" },
                        { text: "打开双路继电器三蓝路", value: "47" },
                        { text: "打开双路继电器四黄路", value: "48" },
                        { text: "打开双路继电器四蓝路", value: "49" },
                        { text: "打开双路继电器五黄路", value: "50" },
                        { text: "打开双路继电器五蓝路", value: "51" },
                        { text: "打开双路继电器六黄路", value: "52" },
                        { text: "打开双路继电器六蓝路", value: "53" },
                        { text: "打开双路继电器七黄路", value: "54" },
                        { text: "打开双路继电器七蓝路", value: "55" },
                        { text: "打开双路继电器八黄路", value: "56" },
                        { text: "打开双路继电器八蓝路", value: "57" },
                        { text: "关闭双路继电器一黄路", value: "58" },
                        { text: "关闭双路继电器一蓝路", value: "59" },
                        { text: "关闭双路继电器二黄路", value: "60" },
                        { text: "关闭双路继电器二蓝路", value: "61" },
                        { text: "关闭双路继电器三黄路", value: "62" },
                        { text: "关闭双路继电器三蓝路", value: "63" },
                        { text: "关闭双路继电器四黄路", value: "64" },
                        { text: "关闭双路继电器四蓝路", value: "65" },
                        { text: "关闭双路继电器五黄路", value: "66" },
                        { text: "关闭双路继电器五蓝路", value: "67" },
                        { text: "关闭双路继电器六黄路", value: "68" },
                        { text: "关闭双路继电器六蓝路", value: "69" },
                        { text: "关闭双路继电器七黄路", value: "70" },
                        { text: "关闭双路继电器七蓝路", value: "71" },
                        { text: "关闭双路继电器八黄路", value: "72" },
                        { text: "关闭双路继电器八蓝路", value: "73" },
                        { text: "小智同学", value: "74" },
                        { text: "小智同学", value: "75" },
                        { text: "小智同学", value: "76" },
                        { text: "小智同学", value: "77" },
                        { text: "小智同学", value: "78" },
                        { text: "小智同学", value: "79" },
                        { text: "小智同学", value: "80" },
                        { text: "小智同学", value: "81" },
                        { text: "小智同学", value: "82" },
                        { text: "小智同学", value: "83" },
                        { text: "小智同学", value: "84" },
                        { text: "小智同学", value: "85" },
                        { text: "小智同学", value: "86" },
                        { text: "小智同学", value: "87" },
                        { text: "小智同学", value: "88" },
                        { text: "小智同学", value: "89" },
                        { text: "小智同学", value: "90" },
                        { text: "小智同学", value: "91" },
                        { text: "小智同学", value: "92" },
                        { text: "小智同学", value: "93" },
                        { text: "小智同学", value: "94" },
                        { text: "小智同学", value: "95" },
                        { text: "小智同学", value: "96" },
                        { text: "小智同学", value: "97" },
                        { text: "小智同学", value: "98" },
                        { text: "小智同学", value: "99" },
                        { text: "小智同学", value: "100" }
                    ]
                },
                ...GenerateRJMenuAll('extb_iot'),
                dblRelayPinYellow: this.dblRelayPinYellow,
                dblRelayPinBlue:this.dblRelayPinBlue,
                ...miscMenuBlocks
            }
        }
    }


}

module.exports = UDblockIOT;