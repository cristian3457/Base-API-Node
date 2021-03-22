// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Vencimiento del Token
// ============================

process.env.CADUCIDAD_TOKEN = '48h';


// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/pochosStore';
} else {
    // urlDB = process.env.MONGO_URI;
    urlDB = "mongodb://root:root@cluster0-shard-00-00.aila2.mongodb.net:27017,cluster0-shard-00-01.aila2.mongodb.net:27017,cluster0-shard-00-02.aila2.mongodb.net:27017/pochosStore?ssl=true&replicaSet=atlas-s6v91x-shard-0&authSource=admin&retryWrites=true&w=majority";
}
process.env.URLDB = urlDB;