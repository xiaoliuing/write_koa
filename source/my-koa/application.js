const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const EventEmitter = require('events'); // Koa 需要继承 events的事件流模块

class Koa extends EventEmitter{
  constructor() {
    super();
    this.middleWares = [];
    this.context = context;
    this.request = request;
    this.response = response;
  }
  use(middleWare) { // 注册中间件
    this.middleWares.push(middleWare);
  }

  compose() {  // 处理中间件，就是对next的不断改写，使得的一个中间件包裹另一个中间件
    return ctx => {
      const len = this.middleWares.length;
      // oldNext就是上一个中间件
      const createNext = (currebtMiddleWare, oldNext) => {
        return async () => {
          await currebtMiddleWare(ctx, oldNext);
        }
      }

      let next = () => Promise.resolve(); // 初始化next

      for(let i = len - 1; i > -1; i--) {
        next = createNext(this.middleWares[i], next);
      }
      return next();  // next就是一系列Promise嵌套组成的函数，所以有Promise的链式调用可以容错和响应
    }
  }

  createContext(req, res) {
    const ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.req = req;
    ctx.res = res;
    return ctx;
  }

  callback() {
    return (req, res) => {  // req, res是原生模块的
      const fn = this.compose();
      const ctx = this.createContext(req, res);
      const onResponse = () => {
        if(typeof ctx.body === 'object') {
          ctx.res.end(JSON.stringify(ctx.body))
        } else {
          ctx.res.end(ctx.body);
        }
      }
      const onError = (e) => {
        ctx.res.end(e.message); // 将错误信息响应出去
        this.emit('error', e)
      }
      fn(ctx).then(onResponse).catch(onError);
    }
  }

  listen(port, callback) {
    const server = http.createServer(this.callback()); // 创建server，参数是request事件
    server.listen(port, callback);
  }
}

module.exports = Koa;