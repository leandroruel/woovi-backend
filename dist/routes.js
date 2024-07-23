import Router from '@koa/router';
const router = new Router();
router.get('/', async (ctx) => {
    ctx.body = 'GraphQL Server Ready! go to /graphql to start playing around!';
});
export default router;
