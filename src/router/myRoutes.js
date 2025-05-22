import express from 'express';
import sendMessageRouter from "./modules/sendMessageRouter.js";
const myRouter = express.Router();  // 创建路由实例

myRouter.use('/message', sendMessageRouter);         // 访问 /user/*
export default myRouter;
