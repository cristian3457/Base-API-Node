const express = require('express');
const Departamento = require('../models/departamento');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

//verificaToken
app.get('/departamento', (req, res) => {
    Departamento.find()
        .exec((err, departamentos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                departamentos
            });
        });
});
//verificaToken
app.get('/departamento/activos', (req, res) => {
    Departamento.find({ estado: true })
        .exec((err, departamentos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                departamentos
            });
        });
});
app.get('/departamento/:id', (req, res) => {
    let id = req.params.id;
    Departamento.findById(id)
        .exec((err, departamento) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                departamento
            });

        });
});

//[verificaToken, verificaAdmin_Role]
app.post('/departamento', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let departamento = new Departamento({
        nombre: body.nombre,
        estado: body.estado,
    });
    departamento.save((err, departamentonDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            departamento: departamentonDB
        });
    });
});
//[verificaToken, verificaAdmin_Role]
app.put('/departamento/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = req.body;
    Departamento.findByIdAndUpdate(id, body, { new: true }, (err, departamentonDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            departamento: departamentonDB
        });
    })
});
//[verificaToken, verificaAdmin_Role]
app.delete('/departamento/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Departamento.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, departamentoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!departamentoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'departamento no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            departamento: departamentoBorrado
        });
    });
});

module.exports = app;