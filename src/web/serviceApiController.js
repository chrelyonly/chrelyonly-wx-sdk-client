import express from 'express';
import bodyParser from 'body-parser';
import myRouter from "../router/myRoutes.js";  // 使用 import 语法加载 body-parser

const app = express();
const port = 3000;

// 映射 static 文件夹
app.use(express.static('static'));

app.use(bodyParser.json());
app.use('/v1', myRouter);


app.get('/', (req, res) => {
    res.send('欢迎访问主页！');
});

app.listen(port, () => {
    console.log(`服务器已启动，访问地址: http://0.0.0.0:${port}`);
});
