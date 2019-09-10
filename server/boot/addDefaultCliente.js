'use strict';

/*
  Crear cliente por default, con el id 1 y que será utilizado para todas las órdenes no registradas.
*/
module.exports = function(app, cb) {
  const Cliente = app.models.Cliente;

  Cliente.findById(1, (err, cliente) => {
    if (!cliente) {
      Cliente.create({
        rfc: '',
        nombre: 'Cliente',
        direccion: '',
        colonia: '',
        ciudad: '',
        cp: '',
        telefono: '',
      }, (err) => {
        if (err) return cb(err);
        console.log('Cliente por defecto (con id:1) creado satisfactoriamente');
      });
    }
    if (err) cb(err);
  });

  process.nextTick(cb);
};
