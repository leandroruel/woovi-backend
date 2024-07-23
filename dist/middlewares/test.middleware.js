const checkRequest = (ctx, next) => {
    const { request, response, cookies } = ctx;
    // TODO: Implement middleware logic
    //console.log(request.header.authorization);
    return next();
};
export default checkRequest;
