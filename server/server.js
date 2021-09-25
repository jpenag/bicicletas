const express = require('express');
const bodyParser = require('body-parser');
const { initDb, getDbUri } = require('./lib/db');
const { getConfig } = require('./lib/config');

const app = express();
const port = process.env.PORT || 5000;

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
app.get('/api/listarBicicletas', (req, res) => {

  app.db.bicicletas.find().toArray(function(err, result) {
    if (err)
      res.send({ datos: { error: true, msg: err }});
    else
      res.send({ datos: result });
  });
});


//API para obtener una bicicleta por id
app.get('/api/bicicleta/:id', (req, res) => {
  var query = { id: parseInt(req.params.id) };
  app.db.bicicletas.findOne(query, function(err, result) {
    if (err)
      res.send({ datos: { error: true, msg: err }});
    else
      res.send({ datos: result });
  });
});

//API para borrar una bicicleta por id
app.get('/api/borrarBicicleta/:id', (req, res) => {
  var query = { id: parseInt(req.params.id) };
  app.db.bicicletas.deleteOne(query, function(err, result) {
    if (err)
      res.send({ datos: { error: true, msg: err }});
    else
      res.send({ datos: { success: true } });
  });
});

//API para crear una bicicleta
app.post('/api/crearBicicleta', (req, res) => {
  app.db.bicicletas.insertOne(req.body.post, function(err, result) {
    if (err)
      res.send({ datos: { error: true, msg: err }});
    else
      res.send({ datos: { success: true } });
  });
});

//API para editar una bicicleta
app.post('/api/editarBicicleta', (req, res) => {
  var query = { id: parseInt(req.body.post.id) };
  var newvalues = { $set: req.body.post };
  app.db.bicicletas.updateOne(query, newvalues, function(err, result) {
    if (err)
      res.send({ datos: { error: true, msg: err }});
    else
      res.send({ datos: { success: true } });
  });
});

//API para crear un alquiler
app.post('/api/crearAlquiler', (req, res) => {
  app.db.alquiler.insertOne(req.body.post, function(err, result) {
    if (err)
      res.send({ datos: { error: true, msg: err }});
    else
      res.send({ datos: { success: true } });
  });
});

//API para tomar la lista de las bicicletas con alquiler
app.get('/api/listarBicicletasAlquiler', (req, res) => {

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

//API para regresar una bicicleta por id
app.get('/api/regresarBicicleta/:id', (req, res) => {
  var query = { bicicleta_id: parseInt(req.params.id) };
  app.db.alquiler.deleteOne(query, function(err, result) {
    if (err)
      res.send({ datos: { error: true, msg: err }});
    else
      res.send({ datos: { success: true } });
  });
});

//Inicia la escucha por el puerto
app.listen(port, () => console.log(`Listening on port ${port}`));