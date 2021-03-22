const express = require('express');
const Newsletter = require('../models/newsletter');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const newsletter = require('../models/newsletter');

const app = express();

//verificaToken
app.get('/newsletter', (req, res) => {
    Newsletter.find()
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

app.post('/newsletter', function(req, res) {

    let body = req.body;
    let newsletter = new Newsletter({
        email: body.email,
    });
    newsletter.save((err, newsletterDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            newsletter: newsletterDB
        });
    });
});
app.put('/newsletter/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = req.body;
    Newsletter.findByIdAndUpdate(id, body, { new: true }, (err, newsletterDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            newsletter: newsletterDB
        });
    })
});

app.delete('/newsletter/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    var id = req.params.id;

    newsletter.findByIdAndRemove(id, (err, newsletterBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando newsletter',
                errors: err
            });
        }

        if (!newsletterBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error borrando newsletter, no existe una newsletter con ese ID',
                errors: { message: 'No existe ninguna newsletter con ese ID' }
            });
        }

        return res.status(200).json({
            ok: true,
            newsletter: newsletterBorrado
        });
    });
});
module.exports = app;