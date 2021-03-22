var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var StockProducto = require('../models/stockProducto');
var Producto = require('../models/producto');
var Color = require('../models/color');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id/:campo', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    let campo = req.params.campo;
    //tipos de colecciones
    var tiposValidos = ['stocks', 'productos', 'colores'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valido',
            errors: { message: 'El tipo de coleccion no se encuentra entre los tipos validos' }
        });
    }
    //verifica si seleccionaron archivo
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debes seleccionar un archivo' }
        });
    }

    //obtener nombre del archivo
    var archivo = req.files.archivo1;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //extensiones aceptadas
    var extencionesValidas = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG', 'webp', 'WEBP'];

    if (extencionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida',
            errors: { message: 'Las extenciones validas son ' + extencionesValidas.join(', ') }
        });
    }

    //nombre de archivo personalizado
    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extensionArchivo}`;
    //mover archivo a un path especifico
    var path = `./uploads/${ tipo }/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        if (tipo === 'stocks') {
            imagenStockProducto(id, res, nombreArchivo, campo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo, campo);
        } else if (tipo === 'colores') {
            imagenColor(id, res, nombreArchivo, campo);
        }

    })
});

function imagenProducto(id, res, nombreArchivo, campo) {
    Producto.findById(id, (err, producto) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar productos',
                errors: err
            });
        }
        if (!producto) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                mensaje: 'No se encontro ningun producto con ese id',
                errors: { message: 'no se encontro ningun producto con el id ' + id }
            });
        }
        borraArchivo(producto.img, 'productos');
        if (campo == 'img') {
            producto.img = nombreArchivo;
        }

        producto.save((err, productoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar producto',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Archivo de producto actualizado',
                producto: productoActualizado
            });
        });

    });
}

function imagenColor(id, res, nombreArchivo, campo) {
    Color.findById(id, (err, color) => {
        if (err) {
            borraArchivo(nombreArchivo, 'colores');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar colores',
                errors: err
            });
        }
        if (!color) {
            borraArchivo(nombreArchivo, 'colores');
            return res.status(500).json({
                ok: false,
                mensaje: 'No se encontro ningun color con ese id',
                errors: { message: 'no se encontro ningun color con el id ' + id }
            });
        }
        borraArchivo(color.img, 'colores');
        if (campo == 'img') {
            color.img = nombreArchivo;
        }

        color.save((err, colorActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar color',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Archivo de color actualizado',
                color: colorActualizado
            });
        });

    });
}

function imagenStockProducto(id, res, nombreArchivo, campo) {
    StockProducto.findById(id, (err, stock) => {
        if (err) {
            borraArchivo(nombreArchivo, 'stocks');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar stocks',
                errors: err
            });
        }
        if (!stock) {
            borraArchivo(nombreArchivo, 'stocks');
            return res.status(500).json({
                ok: false,
                mensaje: 'No se encontro ningun stock con ese id',
                errors: { message: 'no se encontro ningun stock con el id ' + id }
            });
        }
        borraArchivo(stock.img, 'stocks');
        if (campo == 'img') {
            stock.img = nombreArchivo;
        }

        stock.save((err, stockActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar stock',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Archivo de stock actualizada',
                stock: stockActualizado
            });
        });

    });
}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = `./uploads/${ tipo }/${ nombreImagen }`;
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;