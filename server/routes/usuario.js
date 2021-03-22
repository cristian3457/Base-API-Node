const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

//verificaToken
app.get('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find()
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuarios
            });

        });


});
app.get('/usuario/tokenUser', (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(200).json({
                ok: false,
            });
        }
        let exp = decoded.exp;
        let role = decoded.usuario.role;
        if (role !== 'USER_ROLE') {
            return res.status(200).json({
                ok: false,
            });
        }
        let fechaActual = new Date();
        let fechaExpiracion = new Date(exp * 1000);
        if (fechaActual > fechaExpiracion) {
            return res.status(200).json({
                ok: false,
            });
        }
        return res.status(200).json({
            ok: true,
        });

    });
});
app.get('/usuario/tokenAdmin', (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(200).json({
                ok: false,
            });
        }
        let exp = decoded.exp;
        let role = decoded.usuario.role;
        if (role !== 'ADMIN_ROLE') {
            return res.status(200).json({
                ok: false,
            });
        }
        let fechaActual = new Date();
        let fechaExpiracion = new Date(exp * 1000);
        if (fechaActual > fechaExpiracion) {
            return res.status(200).json({
                ok: false,
            });
        }
        return res.status(200).json({
            ok: true,
        });

    });
});
app.get('/usuario/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Usuario.findById(id)
        .exec((err, usuario) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario
            });

        });


});
app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });


});
//[verificaToken, verificaAdmin_Role]
app.put('/usuario/:id', [verificaToken], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellidos', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});
app.put('/usuario/password/:id', [verificaToken], function(req, res) {

    let id = req.params.id;
    let body = req.body;
    Usuario.findByIdAndUpdate(id, { password: bcrypt.hashSync(body.password, 10) }, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })


});
//[verificaToken, verificaAdmin_Role]
app.delete('/usuario/:id', [verificaToken], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;