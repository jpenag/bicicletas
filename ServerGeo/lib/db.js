const MongoClient = require('mongodb').MongoClient;
const mongodbUri = require('mongodb-uri');

let _db;

function initDb(dbUrl, callback){ // eslint-disable-line
    if(_db){
        console.warn('Intentando inciar DB de nuevo!');
        return callback(null, _db);
    }
    MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, connected);
    function connected(err, client){
        if(err){
            console.log('Falló conectando a la DB', err);
            return callback(err);
        }

        // Set the DB url
        dbUrl = getDbUri(dbUrl);

        // select DB
        const dbUriObj = mongodbUri.parse(dbUrl);

        // Set the DB depending on ENV
        const db = client.db(dbUriObj.database);

        // setup the collections
        db.bicicletas = db.collection('bicicletas');
        db.alquiler = db.collection('alquiler');
        
        _db = db;
        return callback(null, _db);
    }
};

function getDbUri(dbUrl){
    const dbUriObj = mongodbUri.parse(dbUrl);
    return mongodbUri.format(dbUriObj);
}

function getDb(){
    return _db;
}

module.exports = {
    getDb,
    initDb,
    getDbUri
};
