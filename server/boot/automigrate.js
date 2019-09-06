module.exports = (app) => {
  const ds       = app.dataSources.database;
  const dbTables = ['AccessToken', 'ACL', 'RoleMapping', 'Role', 'Usuario', 'Categoria', 'Cliente', 'Mesa', 'OrdenDetalle', 'Orden', 'Producto'];
  if(dbTables.length !== 0){
    ds.autoupdate(dbTables, (err) => {
      if(err) throw err;
      console.log('Automigración realizada');
    });
  } else {
    console.log('No hay tablas por crear.');
  }
  //ds.disconnect(); //Descomentar si se pone fuera de la carpeta boot
}