/**
 * Created by Administrator on 2017/1/18.
 * [EventUntil Event事件处理函数  跨浏览器的事件对象]
 * @type {Object}
 */
var client = function() {
    //呈现引擎
    var engine = {
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,
        ver: null //完整的版本号
    };

    //浏览器
    var browser = {
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,
        ver: null //具体的版本号
    };

    //平台、设备和操作系统
    var system = {
        win: false,
        mac: false,
        xll: false,

        //移动设备
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,

        //游戏系统
        wii: false,
        ps: false
    };

    //检测呈现引擎及浏览器
    var ua = navigator.userAgent;
    if (window.opera) {
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebkit\/(S+)/.test(ua)) {
        engine.ver = RegExp["$1"]; //RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
        engine.webkit = parseFloat(engine.ver);

        //确定是Chrome还是Safari
        if (/Chrome\/(S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
            //近似的确定版本号
            var safariVersion = 1;
            if (engine.webkit < 100) {
                safariVersion = 1;
            } else if (engine.webkit < 312) {
                safariVersion = 1.2;
            } else if (engine.webkit < 412) {
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }
            browser.safari = browser.ver = safariVersion;
        }
    } else if (/KHTML\/(S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);

        //确定是不是Firefox
        if (/Firefox\/(S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }

    //检测浏览器
    browser.ie = engine.ie;
    browser.opera = engine.opera;

    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.xll = (p == "Xll") || (p.indexOf("Linux") == 0);

    //检测Windows操作系统
    if (system.win) {
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
            if (RegExp["$1"] == "NT") {
                switch (RegExp["$2"]) {
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;
                }
            }
        } else if (RegExp["$1"] == "9x") {
            system.win = "ME";
        } else {
            system.win = RegExp["$1"];
        }
    }

    //移动设备
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;

    //Windos mobile
    if (system.win == "CE") {
        system.winMobile = system.win;
    } else if (system.win == "Ph") {
        if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }

    //检测IOS版本
    if (system.ios && ua.indexOf("Mobile") > -1) {
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
            system.ios = parseFloat(RegExp.$1.replace("_", "."));
        } else {
            system.ios = 2; //不能真正检测出来，所以只能猜测
        }
    }

    //检测Android版本
    if (/Android (\d+.\d+)/.test(ua)) {
        system.android = parseFloat(RegExp.$1);
    }

    //游戏系统
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);

    return {
        engine: engine,
        browser: browser,
        system: system
    };
}();

var EventUntil = {
    addEventHandler: function(element, type, hander) {
        if (element.addEventListener) {
            //高级浏览器 ————DOM2级方法
            element.addEventListener(type, hander, false);
        } else if (element.attachEvent) {
            //IE
            element.attachEvent("on" + type, hander)
        } else {
            //低版本浏览器————DOM0级方法
            element["on" + type] = hander;
        }
    },
    removeEventHander: function(element, type, hander) {
        if (element.removeEventListener) {
            //高级浏览器
            element.removeEventListener(type, hander, false);
        } else if (element.detachEvent) {
            //IE
            element.detachEvent("on" + type, hander)
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function(event) {
        //获取事件对象
        return event ? event : window.event;
    },
    getTarget: function(event) {
        //获取事件对象的目标
        return event.target || event.srcElement; //非IE(DOM) || IE
    },
    getRelatedTarget: function(event) {
        //获取事件对象的相关目标  只对mouseover和mouseout有效
        if (event.relatedTarget) {
            return event.relatedTarget; //高版本浏览器 DOM规范
        } else if (event.toElement) {
            return event.toElement; //IE mouseout
        } else if (event.fromElement) {
            return event.fromElement; //IE mouseover
        } else {
            return null;
        }
    },
    getButton: function(event) {
        //获取鼠标按钮事件
        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
            /*DOM规范——————
             * 0为主鼠标按钮(左键);
             * 1为鼠标按钮(滚轮);
             * 2为次鼠标按钮(右键);
             */
            return event.button;
        } else {
            /*
             *IE ——————————
             *0为没有按下按钮;
             *1为鼠标主按钮;
             *2为鼠标次按钮;
             *3为同时按下主、次按钮;
             *4为同时按下中间的鼠标按钮;
             *5为同时按下主、中的鼠标按钮;
             *6为同时按下次、中的鼠标按钮;
             *7为同时按下主、中、次的鼠标按钮
             */
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },
    getWheelDelta: function(event) {
        //获取鼠标滚轮增量值  返回值为鼠标前滚为120，后滚为-120
        if (event.wheelDelta) {
            //非FF（IE、chrome、safari、opera）滚轮前滚为120的倍数，后滚为-120的倍数。opera9.5版本之前的正负号颠倒。
            return (client.engine.opera && client.engine.opera < 9.6 ? -event.wheelDelta : event.wheelDelta);
        } else {
            // FF火狐浏览器 滚轮前滚为-3的倍数，后滚为3的倍数
            return -event.detail * 40;
        }
    },
    getCharCode: function(event) {
        //获取键盘的字符编码
        if (typeof event.charCode == "number") {
            return event.charCode;
        } else {
            return event.ketCode;
        }
    },
    preventDefault: function(event) {
        //取消事件的默认行为
        if (event.preventDefault)
            event.preventDefault(); //DOM
        else
            event.returnValue = false; //IE事件对象——阻止默认事件
    },
    stopPropagation: function(event) {
        //阻止事件冒泡
        if (event.stopPropagation)
            event.stopPropagation(); //DOM
        else
            event.cancelBubble = true; //IE事件对象——取消事件冒泡
    },
    getClipboardText: function(event) {
        //获取剪切板文本
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },
    setClipboardText: function(event， value) {
        //设置剪切板文本
        if (event.clipboardData) {
            //非IE
            return event.clipboardData.setData("text/plain", value);
        } else if (window.clipboardData) {
            //IE
            return window.clipboardData.setData("text", value);
        }
    }
};

/**
 * mouseWheel [跨浏览器的鼠标滚轮事件]
 * @Author   SilentBoy
 * @DateTime 2017-07-13
 * @param    {[type]}   ){})( [description]
 * @return   {[type]}           [description]
 */
var mouseWheel = (function(client) {
    return client.browser.firefox ? "DOMMouseScroll" : "mousewheel";
})(client);