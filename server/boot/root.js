'use strict';

module.exports = function(server) {
  const router = server.loopback.Router();
  router.get('/api/usuarios/whoami', async (request, response) => {
    const app = require('../server');
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;
    const AccessToken = app.models.AccessToken;
    const UserModel = app.models.Usuario;

    const promiseRol = (userId) => {
      return new Promise((resolve, reject) => {
        Role.getRoles(
          {principalType: RoleMapping.USER, principalId: userId},
          (err, roles) => {
            if (err) reject(err);
            if (roles.includes(1)) {
              resolve('admin');
            } else if (roles.includes(2)) {
              resolve('mesero');
            } else if (roles.includes(3)) {
              resolve('cocinero');
            } else {
              resolve('none');
            }
          }
        );
      });
    };

    const promiseAccesTokenUserId = (req) => {
      return new Promise((resolve, reject) => {
        AccessToken.findForRequest(req, {}, (_, accesstoken) => {
          if (accesstoken == undefined) {
            reject({
              err: 'Token not found',
            });
          } else {
            resolve(accesstoken.userId);
          }
        });
      });
    };

    const promiseUser = (userId) => {
      return new Promise((resolve, reject) => {
        UserModel.findById(userId, (err, user) => {
          if (err) {
            reject({
              err: 'User not found',
            });
          }
          if (user) resolve(user);
        });
      });
    };

    try {
      const userId = await promiseAccesTokenUserId(request);
      const user = await promiseUser(userId);
      const role = await promiseRol(userId);

      const {
        realm,
        password,
        emailVerified,
        verificationToken,
        ...userToSend
      } = user.__data;

      response.status(200);
      response.send({
        ...userToSend,
        role
      });
    } catch (err) {
      response.status(404);
      response.send(err);
    }
  });
  server.use(router);
};
