const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');
const Direccion = require('../models/direccion');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

//verificaToken
app.get('/direccion/:usuario', (req, res) => {
    let usuario = req.params.usuario;
    Direccion.find({ usuario })
        .exec((err, direcciones) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                direcciones
            });

        });
});

//[verificaToken, verificaAdmin_Role]
app.post('/direccion', function(req, res) {

    let body = req.body;

    let direccion = new Direccion({
        cp: body.cp,
        estado: body.estado,
        ciudad: body.ciudad,
        municipio: body.municipio,
        colonia: body.colonia,
        calle: body.calle,
        numExterior: body.numExterior,
        numInterior: body.numInterior,
        telefono: body.telefono,
        usuario: body.usuario,
    });
    direccion.save((err, direccionDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            direccion: direccionDB
        });
    });
});
//[verificaToken, verificaAdmin_Role]
app.put('/direccion/:id', function(req, res) {

    let id = req.params.id;
    let body = req.body;
    Direccion.findByIdAndUpdate(id, body, { new: true }, (err, direccionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: direccionDB
        });
    })
});
//[verificaToken, verificaAdmin_Role]
app.delete('/direccion/:id', (req, res) => {
    var id = req.params.id;

    Direccion.findByIdAndRemove(id, (err, direccionBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando direccion',
                errors: err
            });
        }

        if (!direccionBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error borrando direccion, no existe una direccion con ese ID',
                errors: { message: 'No existe ninguna direccion con ese ID' }
            });
        }

        return res.status(200).json({
            ok: true,
            direccion: direccionBorrada
        });
    });
});

module.exports = app;