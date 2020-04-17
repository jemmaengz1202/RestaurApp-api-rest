'use strict';

module.exports = function(Orden) {
  Orden.reporte = function(cb) {
    const ds = Orden.dataSource;
    const sql = 'SELECT SUM(importe) AS "total", DATE(cierre) AS "fecha" FROM public.orden GROUP BY DATE(cierre)';

    ds.connector.query(sql, (err, reportes) => {
      if (err) console.error(err);
      cb(err, reportes);
    });
  };

  /**
 * Sets 'preparada' property to true
 */
  Orden.prototype.setPreparada = async function() {
    const orden = this;
    const savePreparada = (orden) => {
      return new Promise(
        (resolve, reject) => {
          orden.preparada = true;
          orden.save((err, obj) => {
            if (err) reject(err);
            resolve(obj);
          });
        },
      );
    };
    try {
      await savePreparada(orden);
      return {
        ok: true,
      };
    } catch (err) {
      return {
        error: err,
      };
    }
  };
};
