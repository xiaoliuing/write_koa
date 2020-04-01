const Koa = require('../source/my-koa/application.js');

const app = new Koa();

app.use(async (ctx, next) => {
  console.log('1->start');
  await next();
  console.log('1->end');
})

app.use(async (ctx, next) => {
  console.log('2->start');
  await next();
  console.log('2->end');
})

app.use(async (ctx, next) => {
  console.log('3->start');
  await next();
  console.log('3->end');
})

app.use(async (ctx, next) => {
  console.log('4->start');
  // console.log(ctx.__proto__)
  // throw new Error('new error');
  ctx.body = 'hello world';
  await next();
  console.log('4->end');
})

app.on('error', (e) => {
  console.log('user==', e)
})

app.listen(3002, () => {
  console.log('server is running at http://localhost:3002');
})