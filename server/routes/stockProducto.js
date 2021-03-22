const express = require('express');
const StockProducto = require('../models/stockProducto');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

app.get('/stockProducto', (req, res) => {
    StockProducto.find()
        .populate('producto')
        .populate('color')
        .exec((err, stockProductos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                stockProductos
            });

        });
});
app.get('/stockProducto/:producto', (req, res) => {
    let producto = req.params.producto;
    StockProducto.find({ producto })
        .populate('color')
        .exec((err, stocks) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                stocks
            });

        });
});

//[verificaToken, verificaAdmin_Role]
app.post('/stockProducto', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let stockProducto = new StockProducto({
        precio: body.precio,
        stock: body.stock,
        img: body.img,
        color: body.color,
        producto: body.producto,
        estado: body.estado,
    });
    stockProducto.save((err, stockProductoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            stockProducto: stockProductoDB
        });
    });
});
//[verificaToken, verificaAdmin_Role]
app.put('/stockProducto/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = req.body;
    StockProducto.findByIdAndUpdate(id, body, { new: true }, (err, stockProductoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            stockProducto: stockProductoDB
        });
    })
});
//[verificaToken, verificaAdmin_Role]
app.delete('/stockProducto/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    StockProducto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, stockProductoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!stockProductoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'stockProducto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            stockProducto: stockProductoBorrado
        });
    });
});

module.exports = app;