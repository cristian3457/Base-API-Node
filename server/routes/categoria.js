const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

//verificaToken
// app.get('/categoria', (req, res) => {
//     Categoria.find({ estado: true })
//         .exec((err, departamentos) => {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     err
//                 });
//             }
//             res.json({
//                 ok: true,
//                 departamentos
//             });
//         });
// });
app.get('/categoria', (req, res) => {
    Categoria.find()
        .populate('departamento')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });

        });
});
// Get by ID
app.get('/categoria/byId/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria
            });

        });
});
app.get('/categoria/:departamento', (req, res) => {
    let departamento = req.params.departamento;
    Categoria.find({ departamento, estado: true })
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });

        });
});

//[verificaToken, verificaAdmin_Role]
app.post('/categoria', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        estado: body.estado,
        departamento: body.departamento,
    });
    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
//[verificaToken, verificaAdmin_Role]
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = req.body;
    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});
//[verificaToken, verificaAdmin_Role]
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Categoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;