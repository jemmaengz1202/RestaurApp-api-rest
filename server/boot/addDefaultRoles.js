'use strict';

const {addAdminUser} = require('./addAdminUser');

/*
  Añadir los roles de: mesero (2) y cocinero (3).
*/
module.exports.addDefaultRoles = function(app, cb) {
  const Role = app.models.Role;
  Role.findById(1, (err, role) => {
    if (!role) {
      Role.create([
        {name: 'admin'},
        {name: 'mesero'},
        {name: 'cocinero'},
      ], err => {
        if (err) cb(err);
        console.log('Creados los roles por defecto');
        addAdminUser(app, cb);
      });
    }
  });
};
