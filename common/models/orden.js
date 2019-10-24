'use strict';

module.exports = function(Orden) {
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
        }
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
