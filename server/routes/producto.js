const express = require('express');
const Producto = require('../models/producto');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

app.get('/producto', (req, res) => {
    Producto.find()
        .populate('departamento')
        .populate('categoria')
        .populate('subcategoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });
});
app.get('/producto/nuevos', (req, res) => {
    Producto.find().sort({ _id: -1 })
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });
});
app.get('/producto/byId/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto
            });

        });
});
app.get('/producto/:categoria', (req, res) => {
    let categoria = req.params.categoria;
    Producto.find({ categoria, estado: true })
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });
});
app.get('/producto/subcategoria/:subcategoria', (req, res) => {
    let subcategoria = req.params.subcategoria;
    Producto.find({ subcategoria, estado: true })
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });
});


//[verificaToken, verificaAdmin_Role]
app.post('/producto', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precio: body.precio,
        descripcion: body.descripcion,
        resumenBreve: body.resumenBreve,
        caracteristicas: body.caracteristicas,
        departamento: body.departamento,
        categoria: body.categoria,
        subcategoria: body.subcategoria,
        estado: body.estado,
    });
    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
//[verificaToken, verificaAdmin_Role]
app.put('/producto/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = req.body;
    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
});
//[verificaToken, verificaAdmin_Role]
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});

module.exports = app;