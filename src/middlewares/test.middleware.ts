import type { Context } from "koa";

const checkRequest = (ctx: Context, next: () => Promise<any>) => {
  const { request, response, cookies } = ctx;
  // TODO: Implement middleware logic
  //console.log(request.header.authorization);
  return next();
};

export default checkRequest;
