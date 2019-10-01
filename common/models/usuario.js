'use strict';

module.exports = function(Usuario) {
  Usuario.afterRemote('login', function(ctx) {
    ctx.res.cookie('access_token', ctx.result.id, {
      signed: true,
      maxAge: ctx.result.ttl * 1000
    });
    return Promise.resolve();
  });
  Usuario.afterRemote('logout', function(ctx) {
    ctx.res.clearCookie('access_token');
    return Promise.resolve();
  });
};
