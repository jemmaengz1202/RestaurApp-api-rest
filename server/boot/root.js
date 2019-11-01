'use strict';

module.exports = function(server) {
  const router = server.loopback.Router();
  router.get('/api/usuarios/whoami', (req, res) => {
    const app = require('../server');
    const AccessToken = app.models.AccessToken;
    AccessToken.findForRequest(req, {}, function(_, accesstoken) {
      if (accesstoken == undefined) {
        res.status(401);
        res.send({
          error: 'Unauthorized',
          message: 'You need to be authenticated to access this endpoint'
        });
      } else {
        const UserModel = app.models.Usuario;
        UserModel.findById(accesstoken.userId, function(_, user) {
          res.status(200);
          res.send(user);
        });
      }
    });
  });
  server.use(router);
};
