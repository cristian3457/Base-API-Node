const express = require('express');
const Color = require('../models/color');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

//verificaToken
app.get('/color', (req, res) => {
    Color.find()
        .exec((err, colores) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                colores
            });
        });
});
//verificaToken
app.get('/color/activos', (req, res) => {
    Color.find({ estado: true })
        .exec((err, colores) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                colores
            });
        });
});
app.get('/color/:id', (req, res) => {
    let id = req.params.id;
    Color.findById(id)
        .exec((err, color) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                color
            });

        });
});

//[verificaToken, verificaAdmin_Role]
app.post('/color', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let color = new Color({
        nombre: body.nombre,
        estado: body.estado,
    });
    color.save((err, colorDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            color: colorDB
        });
    });
});
//[verificaToken, verificaAdmin_Role]
app.put('/color/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = req.body;
    Color.findByIdAndUpdate(id, body, { new: true }, (err, colorDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            color: colorDB
        });
    })
});
//[verificaToken, verificaAdmin_Role]
app.delete('/color/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Color.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, colorBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!colorBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'color no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            color: colorBorrado
        });
    });
});

module.exports = app;