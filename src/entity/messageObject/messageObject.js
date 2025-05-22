/**
 * 给外部传进来的数据添加一些方法
 */
import {sendMqttMessage} from "../../mqtt/mqttMain.js";
import {LOCAL_URL, PARENT_WEB_API_DOMAIN} from "../../config/myConfig.js";

global.MessageObject = class MessageObject {
    constructor(topic, message) {
        // 这个暂时没用
        this.topic = topic;
        // 保存消息
        this.message = message;
        // 记录房间id
        this.wechatRoomId = message?.FromUserName?.string;
    }

    /**
     * 是否管理员
     */
    isAdmin(){
        return this.message?.Content?.string?.includes("wxid_2jyglissyfcp22");
    }
    self(){
        return this.message.Wxid === this.message?.FromUserName?.string;
    }
    type(){
        return this.message.MsgType;
    }
    date(){
        return this.message.CreateTime;
    }
    room(){
        // 判断this.message.Data.FromUserName.string是否包含@chatroom
        return new Promise((resolve, reject) => {
            resolve(this.message.FromUserName.string.includes("@chatroom")?this:undefined)
        })
    }
    topicTitle(){
        return new Promise((resolve, reject) => {
            resolve(this.message.FromUserName.string)
        })
    }
    text(){
        return this.message.Content.string.trim().split(":\n")[1];
    }
    // 原始消息
    msgSource(){
        return this.message.MsgSource;
    }
    // 获取艾特的人的信息
    getMember(atUserList){
        // let atUserList = this.message.atUserList;
        // for (let i = 0; i < atUserList.length; i++) {
        //     if (atUserList[i].wxid === atUser){
        //         return atUserList[i];
        //     }
        // }
        let params = {
            wechatRoomId:this.wechatRoomId,
            memberWxIds: atUserList
        }
        return http("http://" + PARENT_WEB_API_DOMAIN + "/api/wechat/getChatroomMemberDetail","post",params,2,{})
    }
    // 获取自己信息
    getUserInfo(){
        return this.message.userInfo;
    }
    /**
     * 发送消息
     * @param msg 发送的消息
     * 这里后面重写把
     */
    say(msg){
        // 封装消息参数
        if (typeof msg  === "string"){
            msg = {
                data: msg,
                type: 1
            }
        }
        let params = {
            wechatRoomId:this.wechatRoomId,
            type: msg.type
        }
        // 如果是图片纤细
        if (msg.type === 1){
            params.content = msg.data
        }else if (msg.type === 2){
            params.imgUrl = LOCAL_URL + msg.imgUrl
        }else if(msg.type === 3){
            // 如果是语音消息
            params.voiceUrl = LOCAL_URL + msg.voiceUrl
            params.voiceDuration = msg.voiceDuration
        }else if(msg.type === 4){
            // 如果是表情
            params.emojiMd5 = msg.emojiMd5
            params.emojiSize = msg.emojiSize
        }else{
            throw new Error("暂时不支持的文件类型")
        }
        //     否则发送普通消息
        sendMqttMessage(params).then(res => {
                log.info("发送成功")
            }
        ).catch(err => {
            log.error("发送失败")
        })
    }

    /**
     * 静态调用
     */
    static sayStatic = (msg) =>{
// 封装消息参数
        if (typeof msg  === "string"){
            msg = {
                data: msg,
                type: 1
            }
        }
        let params = {
            wechatRoomId: "45168511242@chatroom",
            type: msg.type
        }
        // 如果是图片纤细
        if (msg.type === 1){
            params.content = msg.data
        }else if (msg.type === 2){
            params.imgUrl = msg.imgUrl
        }else if(msg.type === 3){
            // 如果是语音消息
            params.voiceUrl = LOCAL_URL + msg.voiceUrl
            params.voiceDuration = msg.voiceDuration
        }else if(msg.type === 4){
            // 如果是表情
            params.emojiMd5 = msg.emojiMd5
            params.emojiSize = msg.emojiSize
        }else{
            throw new Error("暂时不支持的文件类型")
        }
        //     否则发送普通消息
        sendMqttMessage(params).then(res => {
                log.info("发送成功")
            }
        ).catch(err => {
            log.error("发送失败")
        })
    }
}
