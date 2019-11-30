'use strict';

const app = require('../../server/server');
const {promisify} = require('util');

module.exports = function(Usuario) {
  Usuario.afterRemote('login', function(ctx) {
    ctx.res.cookie('access_token', ctx.result.id, {
      signed: true,
      maxAge: ctx.result.ttl * 1000,
    });
    if (ctx.result.ttl == -1) {
      ctx.res.cookie('access_token', ctx.result.id, {
        signed: true,
        maxAge: 21474836470,
      });
    }
    return Promise.resolve();
  });
  Usuario.afterRemote('logout', function(ctx) {
    ctx.res.clearCookie('access_token');
    return Promise.resolve();
  });

  Usuario.observe('before save', function filterProperties(ctx, next) {
    const oInstance = ctx.instance;

    if (oInstance) oInstance.email = oInstance.email || Date.now() + 'a@b.cc';

    next();
  });

  /**
 * Get role of a user
 */
  Usuario.prototype.getRole = async function() {
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;

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
          },
        );
      });
    };

    try {
      const rol = await promiseRol(this.id);
      return {
        rol,
      };
    } catch (err) {
      return {
        error: err,
      };
    }
  };

  /**
 * Get user names and roles
 */

  Usuario.getWithRole = async function() {
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;
    const getUsuariosPromisified = promisify(Usuario.find.bind(Usuario));
    const users = await getUsuariosPromisified();
    const promiseRol = userId => {
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
          },
        );
      });
    };
    const usersArray = [];
    for (const user of users) {
      const rol = await promiseRol(user.id);
      usersArray.push({
        id: user.id,
        nombre: user.nombre,
        rol: rol,
        imagenUrl: user.imagenUrl,
      });
    }
    return usersArray;
  };
};
