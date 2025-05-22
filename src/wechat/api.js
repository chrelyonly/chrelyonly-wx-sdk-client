
// 机器人状态

import {messageApi} from "../message/messageApi.js";

let botStatus = "on";

/**
 * 消息监听
 */
export function onMessage(message) {
    // 判断是否机器人自己发送的
    if (message.self()) {
        log.info("自己发送的消息,不处理")
        return;
    }
    // if (true) {
    //     log.info("开发环境")
    //     return;
    // }
    // 消息类型 1是文本消息
    const txtType = message.type()
    // 判断消息的时间戳,如果超过10分钟,则不处理
    // if (message.date() * 1000 < new Date().getTime() - 10 * 60 * 1000) {
    //     log.info("消息时间超过10分钟,不处理")
    //     log.info("消息时间: " + new Date(message.date() * 1000).Format("yyyy-MM-dd HH:mm:ss"))
    //     log.info("当前时间: " + new Date().Format("yyyy-MM-dd HH:mm:ss"))
    //     log.info("消息时间戳: " + message.date() * 1000)
    //     log.info("当前时间戳: " + new Date().getTime())
    //     return;
    // }
    // 判断是否是群消息  获取发送群
    message.room().then(room => {
        if (room) {
            let msg = message.text();
            if (msg === "") {
                //    不支持的消息类型
                log.info("不支持的消息类型")
                return;
            }
            if(msg === "开机" && message.isAdmin()){
                botStatus = "on";
                room.say("起床床啦\n当前时间:\n" + new Date().Format("yyyy-MM-dd HH:mm:ss"))
                return;
            }
            if(msg === "关机" && message.isAdmin()){
                botStatus = "off";
                room.say("睡觉觉啦\n当前时间:\n" + new Date().Format("yyyy-MM-dd HH:mm:ss"))
                return;
            }
            // 判断机器人状态
            if(botStatus === "off"){
                return;
            }
            if (txtType === 1) {
                messageApi(message, room)
            }
        } else {
            log.info('收到个人消息')
        }
    });
}
