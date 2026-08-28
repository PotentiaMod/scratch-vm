const EXTB_LIST = require('../util/extb-definitions');

const miscMenuBlocks = {
    channel: {
        acceptReporters: true,
        items: [{ text: "黄路", value: "0" }, { text: "蓝路", value: "1" }]
    },
    displayLine: { // OLED模组显示行数菜单
        acceptReporters: true,
        items: [{ text: "一", value: "0" }, { text: "二", value: "1" }, { text: "三", value: "2" }, { text: "四", value: "3" }]
    },
    colorDetectMenu: {
        acceptReporters: true,
        items: [{ text: "红色", value: 0 }, { text: "绿色", value: 1 }, { text: "蓝色", value: 2 }, { text: "全部", value: -1 },]
    },
    colorDetectResultMenu: {
        acceptReporters: true,
        items: [{ text: "红色", value: "(1,0,0)" }, { text: "绿色", value: "(0,1,0)" }, { text: "蓝色", value: "(0,0,1)" }, { text: "黄色", value: "(1,1,0)" }, { text: "紫色", value: "(1,0,1)" }, { text: "天蓝色", value: "(0,1,1)" }, { text: "黑色", value: "(0,0,0)" }, { text: "白色", value: "(1,1,1)" }]
    },
    colorRGBMenu: {
        acceptReporters: true,
        items: [{ text: "红", value: "r" }, { text: "绿", value: "g" }, { text: "蓝", value: "b" }, { text: "列表", value: "all" }]
    },
    faceMenu: {
        acceptReporters: true,
        items: [{ text: "笑脸", value: "0x01" }, { text: "调皮", value: "0x02" }, { text: "得意", value: "0x03" }, { text: "伤心", value: "0x04" }, { text: "开心", value: "0x05" }, { text: "OK", value: "0x06" }, { text: "两眼发光", value: "0x07" }]
    },
    faceColorMenu: {
        acceptReporters: true,
        items: [{ text: "红色", value: "FACE_COLOR_RED" }, { text: "绿色", value: "FACE_COLOR_GREEN" }, { text: "蓝色", value: "FACE_COLOR_BLUE" }, { text: "红蓝", value: "FACE_COLOR_REDBLUE" }, { text: "红绿", value: "FACE_COLOR_REDGREEN" }, { text: "蓝绿", value: "FACE_COLOR_BLUEGREEN" }, { text: "白色", value: "FACE_COLOR_RBG" }]
    },
    digitalDisplayIntensityMenu: {
        acceptReporters: true,
        items: [{ text: "0", value: 0 }, { text: "1", value: 1 }, { text: "2", value: 2 }, { text: "3", value: 3 },
        { text: "4", value: 4 }, { text: "5", value: 5 }, { text: "6", value: 6 }, { text: "7", value: 7 }, { text: "8", value: 8 }]
    },
    actions: {
        acceptReporters: true,
        items: [{ text: "开始", value: "START" }, { text: "切换", value: "SWITCH" }]
    },
    color: {
        acceptReporters: true,
        items: [{ text: "红色", value: "red" }, { text: "绿色", value: "green" }, { text: "蓝色", value: "blue" }, { text: "黄色", value: "yellow" }, { text: "天蓝色", value: "skyblue" }, { text: "紫色", value: "purple" }, { text: "白色", value: "white" }, { text: "黑色", value: "black" }]
    },
    imageMethods: {
        acceptReporters: true,
        items: [{ text: "边缘查找", value: "iess" }, { text: "锐化", value: "ishs" }, { text: "浮雕化", value: "issr" }]
    },
    colorResult: {
        acceptReporters: true,
        items: [{ text: "X", value: "0" }, { text: "Y", value: "1" }, { text: "宽度", value: "2" }, { text: "高度", value: "3" }]
    },
    faceModes: {
        acceptReporters: true,
        items: [{ text: "默认模式", value: "00" }, { text: "保存模式", value: "01" }]
    },
    inferedIndexMenu: {
        acceptReporters: true,
        items: [{ text: "一", value: "0" }, { text: "二", value: "1" }, { text: "三", value: "2" }, { text: "四", value: "3" }, { text: "五", value: "4" }, { text: "六", value: "5" }, { text: "七", value: "6" }, { text: "八", value: "7" },]
    },
    inferedDirectionMenu: {
        acceptReporters: true,
        items: [{ text: "车前", value: "front" }, { text: "车左前", value: "frontleft" }, { text: "车前中", value: "frontcenter" }, { text: "车右前", value: "frontright" }, { text: "车后", value: "back" }, { text: "车左后", value: "backleft" }, { text: "车后中", value: "backcenter" }, { text: "车右后", value: "backright" },]
    },
    FourInferredMap: {
        acceptReporters: true,
        items: [
            { text: "四路都没有压线", value: "0x0f" },
            { text: "第一路压线", value: "0x0e" },
            { text: "第二路压线", value: "0x0d" },
            { text: "第一二路压线", value: "0x0c" },
            { text: "第三路压线", value: "0x0b" },
            { text: "第一第三路压线", value: "0x0a" },
            { text: "第二第三路压线", value: "0x09" },
            { text: "第一第二第三路压线", value: "0x08" },
            { text: "第四路压线", value: "0x07" },
            { text: "第一第四路压线", value: "0x06" },
            { text: "第二第四路压线", value: "0x05" },
            { text: "第一第二第四路压线", value: "0x04" },
            { text: "第三第四路压线", value: "0x03" },
            { text: "第一第三第四路压线", value: "0x02" },
            { text: "第二第三第四路压线", value: "0x01" },
            { text: "第一第二第三第四路压线", value: "0x00" },
        ]
    },
    StepperDirectionMenu: {
        acceptReporters: true,
        items: [{ text: "正向", value: "0x01" }, { text: "反向", value: "0x00" }]
    },
    // 0 select 
    // 1 L3    
    // 2 R3   
    // 3 start  
    // 4 上    
    // 5 右     
    // 6 下    
    // 7 左    
    // 8 L2    
    // 9 R2     
    // 10 L1   
    // 11 R1   
    // 12 三角形 
    // 13 圆形   
    // 14 ×    
    // 15 正方形

    ps2BtnMenu: {
        acceptReporters: true,
        items: [
            // {text: "select", value: "0"},
            // {text: "L3", value: "1"},
            // {text: "R3", value: "2"},
            // {text: "start", value: "3"},
            { text: "上", value: "4" },
            { text: "右", value: "5" },
            { text: "下", value: "6" },
            { text: "左", value: "7" },
            { text: "L2", value: "8" },
            { text: "R2", value: "9" },
            { text: "L1", value: "10" },
            { text: "R1", value: "11" },
            { text: "Δ", value: "12" },
            { text: "o", value: "13" },
            { text: "×", value: "14" },
            { text: "□", value: "15" },
        ]
    },
    appBtnMenu: {
        acceptReporters: true,
        items: [
            // {text: "select", value: "0"},
            // {text: "L3", value: "1"},
            // {text: "R3", value: "2"},
            // {text: "start", value: "3"},
            { text: "上", value: "4" },
            { text: "右", value: "5" },
            { text: "下", value: "6" },
            { text: "左", value: "7" },
            { text: "L2", value: "9" },
            { text: "R2", value: "11" },
            { text: "L1", value: "8" },
            { text: "R1", value: "10" },
            { text: "Δ", value: "0" },
            { text: "o", value: "1" },
            { text: "×", value: "2" },
            { text: "□", value: "3" },
        ]
    },
    // 0 ly 1 lx 2 ry 3 rx
    ps2RemoteMenu: {
        acceptReporters: true,
        items: [
            { text: "LY", value: "0" },
            { text: "LX", value: "1" },
            { text: "RY", value: "2" },
            { text: "RX", value: "3" },
        ]
    },
    motor_module_motor_menu: {
        acceptReporters: true,
        items: [
            { text: "电机一", value: "0" },
            { text: "电机二", value: "1" },
            { text: "电机三", value: "2" },
            { text: "电机四", value: "3" },
        ]
    },
    motor_module_servo_menu: {
        acceptReporters: true,
        items: [
            { text: "舵机一", value: "0" },
            { text: "舵机二", value: "1" },
            { text: "舵机三", value: "2" },
            { text: "舵机四", value: "3" },
        ]
    },
}


// 生成双向RJ11菜单，不包含只能输入的引脚
const GenerateRJMenuDuplex = function (id) {
    var menu = {
        acceptReporters: true,
        items: []
    }
    // console.log(id)
    var rj11s = EXTB_LIST[id].RJ11;
    for (var i in rj11s) {
        var rj11Name = rj11s[i].name;
        if (!rj11s[i].duplex) {
            // 只允许输入的引脚
            continue;
        }
        var rj11_menu_item = {
            text: rj11Name,                 // RJ11 名称
            value: rj11s[i].value.join(",") // RJ11 的引脚
        }
        menu.items.push(rj11_menu_item);
    }
    return menu;
}

// 生成RJ11菜单，包含所有的引脚
const GenerateRJMenu = function (id) {
    var menu = {
        acceptReporters: true,
        items: []
    }
    var rj11s = EXTB_LIST[id].RJ11;

    for (var i in rj11s) {
        var rj11Name = rj11s[i].name;
        var rj11_menu_item = {
            text: rj11Name,                 // RJ11 名称
            value: rj11s[i].value.join(",") // RJ11 的引脚
        }
        menu.items.push(rj11_menu_item);
    }
    return menu;
}

const GenerateRJDigiMenu = function (id) {
    var menu = {
        acceptReporters: true,
        items: []
    }
    var rj11s = EXTB_LIST[id].RJ11;
    for (var i in rj11s) {
        var rj11Name = rj11s[i].name;
        var rj11_menu_item = {
            text: rj11Name,                 // RJ11 名称
            value: rj11s[i].value[1] // RJ11 的引脚
        }
        menu.items.push(rj11_menu_item);
    }
    return menu;
}
const GenerateADCMenuFull = function (id) {
    var menu = {
        acceptReporters: true,
        items: []
    }
    var rj11s = EXTB_LIST[id].RJ11;
    for (var i in rj11s) {
        var rj11Name = rj11s[i].name;
        var rj11_menu_item = {
            text: rj11Name,          // RJ11 名称
            value: rj11s[i].value[0] // ADC引脚
        }
        menu.items.push(rj11_menu_item);
    }
    return menu;
}
const GenerateADCMenu = function (id) {
    var menu = {
        acceptReporters: true,
        items: []
    }
    var rj11s = EXTB_LIST[id].RJ11;
    for (var i in rj11s) {
        if (!rj11s[i].adc)
            continue
        var rj11Name = rj11s[i].name;
        var rj11_menu_item = {
            text: rj11Name,          // RJ11 名称
            value: rj11s[i].value[0] // ADC引脚
        }
        menu.items.push(rj11_menu_item);
    }
    return menu;
}

const GenerateRJMenuAll = function (id) {
    var menu = {
        RJMenuDup: GenerateRJMenuDuplex(id),
        RJMenu: GenerateRJMenu(id),
        RJDigiMenu: GenerateRJDigiMenu(id),
        RJADCMenu: GenerateADCMenu(id),
        RJADCMenuFull: GenerateADCMenuFull(id)
    }
    return menu
}
export {
    miscMenuBlocks,
    GenerateRJMenuDuplex,
    GenerateRJMenu,
    GenerateRJDigiMenu,
    GenerateADCMenuFull,
    GenerateADCMenu,
    GenerateRJMenuAll
};