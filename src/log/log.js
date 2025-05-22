class log {
    static info(...message)  {
        console.log(`[INFO] ${new Date().toString()} - ${JSON.stringify(message)}`);
    }

    static error(...message) {
        console.error(`[ERROR] ${new Date().toString()} - ${JSON.stringify(message)}`);
    }

    static warn(...message) {
        console.warn(`[WARN] ${new Date().toString()} - ${JSON.stringify(message)}`);
    }
}
// 挂载到 global 对象上
global.log = log;
