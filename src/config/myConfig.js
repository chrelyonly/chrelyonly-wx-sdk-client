


// 解析命令行参数，如：node main.js env=production
const args = process.argv.slice(2);
let env = 'development'; // 默认环境

for (const arg of args) {
    if (arg.startsWith('env=')) {
        env = arg.split('=')[1];
    }
}
// mqtt地址,通讯地址,通过这个接收消息
export let PARENT_MQTT_DOMAIN
// api地址,通过这个接口发送消息
export let PARENT_WEB_API_DOMAIN
// 本地web-api地址   主要用于静态文件服务器,用于让别人访问
export let LOCAL_URL
// 用户id
export let CLIENT_ID = "";
if (!CLIENT_ID){
    console.error("用户id不能为空,用户id从后端获取,填错收不到消息")
    process.exit(1);
}
console.log('当前环境：', env);

if (env === 'production') {
    console.log('这是生产环境');
    PARENT_MQTT_DOMAIN = "wechat-mqtt-java-app:60001"
    LOCAL_URL = "http://chrelyonly-wechat-node-api:3000/"
} else {
    console.log('这是开发环境');
    PARENT_MQTT_DOMAIN = `wss://wechat-api.chrelyonly.cn/mqtt-api`
    LOCAL_URL =  "http://127.0.0.1:3000/"
}
