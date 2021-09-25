const express = require('express');
const bodyParser = require('body-parser');
const { initDb } = require('./lib/db');
const { getConfig } = require('./lib/config');

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// get config
const config = getConfig();

initDb(config.databaseConnectionString, async (err, db) => {
  // Si hay algún error con la conexión a la BD
  if(err){
      console.log(`Error conectando a MongoDB: ${err}`);
      process.exit(2);
  }

  app.db = db;
  app.config = config;
  app.port = app.get('port');
});

//API para listar las bicicletas
app.get('/apiGeo/listarBicicletasGeo', (req, res) => {

  app.db.bicicletas.find().toArray(function(err, result) {
    if (err)
      res.send({ datos: { error: true, msg: err }});
    else
      res.send({ datos: result });
  });
});

//API para tomar la lista de las bicicletas con alquiler
app.get('/apiGeo/listarBicicletasAlquilerGeo', (req, res) => {

  app.db.bicicletas.aggregate([
    { $lookup:
       {
         from: 'alquiler',
         localField: 'id',
         foreignField: 'bicicleta_id',
         as: 'alquiler'
       }
     }
    ]).toArray(function(err, result) {
    if (err)
      res.send({ datos: { error: true, msg: err }});
    else
      res.send({ datos: result });
  });
});

//Inicia la escucha por el puerto
app.listen(port, () => console.log(`Listening on port ${port}`));