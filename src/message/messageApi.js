

import {isAiTe} from "../util/xml/xmlUtil.js";


/**
 * 处理接收到的消息并回复相应的内容。
 * @param {Object} message - 接收到的消息对象。
 * @param {Object} room - 房间对象，用于发送回复。
 */
export function messageApi( message, room) {
// 根据消息内容回复
    let text = message.text();
    log.info(text)
    // 解析原始消息内容
    isAiTe(message.msgSource()).then(res => {
//         如果有长度则说明是艾特,则解析@人的信息
        if (res.length > 0){
            // 如果是@数据则不处理
            return;
        }
        if (text === "测试"){
            room.say("测试成功")
            return;
        }
    })

}
