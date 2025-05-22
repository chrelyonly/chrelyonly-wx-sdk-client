import express from 'express';
const sendMessageRouter = express.Router();

// 定义 user 路由
sendMessageRouter.post('/image', (req, res) => {

    let { resourceUrl} = req.body;
    if (resourceUrl){

        let params = {
            type: 2,
            imgUrl: resourceUrl
        }
        MessageObject.sayStatic(params)
    }
    res.json(R.success());
});

export default sendMessageRouter;
