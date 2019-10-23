'use strict';

require('dotenv').config();

/*
  Crear usuario administrador si no existe. El usuario se crea
  por defecto con el username 'admin' y la contraseña guardada
  en la variable de entorno ADMIN_PASSWORD o 'admin', de no
  estar disponible.
*/
module.exports.addDefaultAdmin = function(app, cb) {
  const Usuario = app.models.Usuario;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;

  Usuario.findOne({where: {username: 'admin'}}, (err, user) => {
    if (!user) {
      Usuario.create(
        {username: 'admin', email: 'admin@admin.com',
          nombre: 'admin',
          password: process.env.ADMIN_PASSWORD || 'admin'}, (err, user) => {
          if (err) return cb(err);
          Role.create({
            name: 'admin',
          }, (err, role) => {
            if (err) cb(err);
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: user.id,
            }, (err, principal) => {
              if (err) cb(err);
              console.log('Creado usuario admin por primera vez.');
            });
          });
        }
      );
    }
    if (err) cb(err);
  });
};
