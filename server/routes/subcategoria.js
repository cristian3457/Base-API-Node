const express = require('express');
const Subcategoria = require('../models/subcategoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

//verificaToken
// app.get('/subcategoria', (req, res) => {
//     Subcategoria.find({ estado: true })
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
app.get('/subcategoria', (req, res) => {
    Subcategoria.find()
        .populate('categoria')
        .exec((err, subcategorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                subcategorias
            });

        });
});
app.get('/subcategoria/:categoria', (req, res) => {
    let categoria = req.params.categoria;
    Subcategoria.find({ categoria, estado: true })
        .exec((err, subcategorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                subcategorias
            });

        });
});
app.get('/subcategoria/byId/:id', (req, res) => {
    let id = req.params.id;
    Subcategoria.findById(id)
        .exec((err, subcategoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                subcategoria
            });

        });
});

//[verificaToken, verificaAdmin_Role]
app.post('/subcategoria', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let subcategoria = new Subcategoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        estado: body.estado,
        categoria: body.categoria,
    });
    subcategoria.save((err, subcategoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            subcategoria: subcategoriaDB
        });
    });
});
//[verificaToken, verificaAdmin_Role]
app.put('/subcategoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = req.body;
    Subcategoria.findByIdAndUpdate(id, body, { new: true }, (err, subcategoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            subcategoria: subcategoriaDB
        });
    })
});
//[verificaToken, verificaAdmin_Role]
app.delete('/subcategoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Subcategoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, subcategoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!subcategoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'subcategoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            subcategoria: subcategoriaBorrada
        });
    });
});

module.exports = app;