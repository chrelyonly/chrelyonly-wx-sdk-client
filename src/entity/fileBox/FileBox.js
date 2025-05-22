import fs from 'fs';
import path from 'path';
import axios from 'axios';

// 获取项目根目录
const rootDir = process.cwd();
// 文件夹路径
const tempDir = path.join('filebox', 'temp');
// 文件绝对路径
const saveDir = path.join(rootDir, 'static', 'filebox', 'temp');

if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
}
class MyFileBox {
    // 数据类型 2 image 3voice 4emoji
    static type = 2;
    // 保存的文件路径
    static path = '';
    // 保存的文件夹
    static saveDir = '';
    // 资源地址
    static resourceUrl = '';
    // 文件名
    static fileName = '';
    // 语音时长
    static voiceDuration = 1000;
    // 表情地址
    static emojiMd5 = "";
    // 表情大小
    static emojiSize = "";

    constructor() {
    }

     static saveFile(fileName, data,dir) {
        const filePath = path.join(saveDir,dir, fileName);
        fs.writeFileSync(filePath, data);
        this.resourceUrl = path.join(tempDir,dir, fileName);
        log.info("保存文件成功", this.resourceUrl);
        this.fileName = fileName;
        this.path = filePath;  // 将路径保存到 path 参数中
        return this;  // 返回实例本身
    }

    // 从本地文件读取并保存
    static fromFile(filePath, fileName,dir) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                throw new Error(`错误的文件读取: ${err.message}`);
            } else {
                this.saveFile(fileName, data,dir);
            }
        });
        return this;
    }

    // 直接从 Buffer 创建文件
    static fromBuffer(type,buffer, fileName,dir) {
        this.saveFile(fileName, Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer),dir);
        this.type = type;
        return this;  // 返回实例本身
    }

    // 从 Base64 编码的字符串创建文件
    static fromBase64(base64String, fileName,dir) {
        try {
            const match = base64String.match(/^data:(.*?);base64,/);
            if (match) {
                const mimeType = match[1];  // 获取数据类型，如 image/jpeg
                log.info(`base64数据类型: ${mimeType}`);
            } else {
                log.info('未找到数据类型');
            }
            const base64Data = base64String.replace(/^data:.*?;base64,/, ''); // 移除类型部分
            const buffer = Buffer.from(base64Data, 'base64');
            this.saveFile(fileName, buffer,dir);
            return this;  // 返回实例本身
        } catch (err) {
            log.error(err);
            throw new Error('无效的 Base64 数据');
        }
    }

    // 从 URL 下载文件并保存
    static fromUrl(type,url, fileName,dir) {
        log.info("下载文件至本地",url)
        return new Promise((resolve, reject) => {
            try {
                axios.get(url, { responseType: 'arraybuffer' }).then((response) => {
                    // 判断响应头如果是json
                    if (response.headers['content-type'].indexOf('application/json') !== -1) {
                        // 先将 ArrayBuffer 转换为字符串
                        let jsonString = Buffer.from(response.data).toString('utf-8');
                        let jsonData = JSON.parse(jsonString);
                        let base64Data = jsonData.data;
                        let temp = this.fromBase64(base64Data, fileName,dir)
                        resolve(temp)
                    }else{
                        this.saveFile(fileName, Buffer.from(response.data),dir);
                        this.type = type
                        // 返回实例本身
                        resolve(this)
                    }
                });
            } catch (err) {
                throw new Error(`错误的地址: ${err.message}`);
            }
        })
    }
}

globalThis.myFileBox = MyFileBox;
