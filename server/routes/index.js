const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./color'));
app.use(require('./direccion'));
app.use(require('./departamento'));
app.use(require('./categoria'));
app.use(require('./subcategoria'));
app.use(require('./producto'));
app.use(require('./stockProducto'));
app.use(require('./login'));
app.use(require('./newsletter'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;