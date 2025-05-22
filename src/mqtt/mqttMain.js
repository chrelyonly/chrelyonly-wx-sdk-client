import {CLIENT_ID, PARENT_MQTT_DOMAIN} from "../config/myConfig.js";

export const SOCKET_SERVICE = PARENT_MQTT_DOMAIN
export const USERNAME = "chrelyonly";
export const PASSWORD = "chrelyonly";
// 引入全局websocket
import mqtt from "mqtt";
// 订阅消息
const topicUrl = "/client/message/" + CLIENT_ID;
// 服务端mqtt消息
global.mqttServer = null;

const createMqttClient = () => {
    const client = mqtt.connect(SOCKET_SERVICE, {
        username: USERNAME,
        password: PASSWORD,
        reconnectPeriod: 3000, // 自动重连间隔时间
        keepalive: 30, // 保持连接时间

    });
//监听连接状态
    client.on("connect", () => {
        console.log("连接成功");
        client.subscribe(topicUrl, err => {
            if (!err) {
                console.log("订阅成功:" + topicUrl);
            }
        });
    });
    client.on("error", (err) => {
        console.error("MQTT 连接错误:", err);
    });

    client.on("reconnect", () => {
        console.log("MQTT 正在重连...");
    });

    client.on("offline", () => {
        console.log("MQTT 离线，等待自动重连...");
    });

    client.on("close", () => {
        console.log("MQTT 连接关闭，尝试重新连接...");
    });
    return client;
}

// 初始化 MQTT
mqttServer = createMqttClient();

/**
 * 初始化mqtt
 * @param callback 回调函数
 */
export const mqttMain = (callback) => {
        mqttServer.on("message", (topic, message) => {
            try {
                if (topicUrl === topic){
                    // console.log("收到消息:", topic);
                    // console.log(message.toString());
                    // 消息可能是list,循环推送
                    let info = JSON.parse(message.toString());
                    let delay = 1000; // 延迟时间 1000ms（1秒）,伪造列队
                    const sendMessage = (index = -1) => {
                        if (index < info?.Data?.AddMsgs?.length) {
                            let temp = info.Data.AddMsgs[index];
                            callback(new MessageObject(topic, temp));
                            // 使用 setTimeout 控制延迟
                            setTimeout(() => sendMessage(index + 1), delay);
                        }
                    };
                    sendMessage(0); // 从索引0开始
                }
            }catch (e){
                console.log("mqttMain error",e)
            }
        });
}
export const sendMqttMessage = (message) => {
    return new Promise((resolve, reject) => {
        // 向后端发送消息
        mqttServer.publish("/client/server/message/" + CLIENT_ID, JSON.stringify(message), (err) => {
            if (err) {
                reject("MQTT 消息发送失败: " + err);
            } else {
                resolve("MQTT 消息发送成功: " + JSON.stringify(message));
            }
        });
    });
};
