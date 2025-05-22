// 加载依赖
import {onMessage} from "./wechat/api.js";
import "./config/dateConfig.js"
import "./util/https.js"
import "./log/log.js"
import "./util/R/R.js"
import "./entity/messageObject/messageObject.js"
import "./entity/fileBox/FileBox.js"
/**
 * 处理未捕获的 Promise 拒绝
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('未捕获的 Promise 拒绝:', reason);
});
/**
 * 处理未捕获的异常
 */
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    // 这里可以选择是否退出进程，比如：
    // process.exit(1);
});

// 连接至服务器
import {mqttMain} from "./mqtt/mqttMain.js";
mqttMain((message) => {
    // 此处放回的msg为Message类型 可以使用Message类的方法
    try {
        onMessage(message);
    }catch (e) {
        console.error(e)
    }
});
// 开启web服务器映射
import "./web/serviceApiController.js"

