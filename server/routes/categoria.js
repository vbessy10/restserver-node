const express = require('express');

const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

let app = express();
const _ = require('underscore');

let Categoria = require('../models/categoria');

//app.get('/usuario', verificaToken, (req, res) => {
app.get('/categoria', verificaToken, (req, res) => {
    // Obtener todas la categorias
    Categoria.find()
        .sort('categoria')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            });
        });
});

app.get('/categoria/:id', verificaToken, (req, res) => {
    // Obtener una categoria por id
    //Categoria.findById(...);
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

app.post('/categoria', [verificaToken, verificaAdminRol], (req, res) => {
    // Crear una nueva categoria y retornarla
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        categoria: body.categoria,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    // Actualizar una categorias
    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body, ['categoria', 'descripcion', 'usuario']);

    let categoria = {
        categoria: body.categoria,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    }

    Categoria.findByIdAndUpdate(id, categoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    // Eliminar categoria, borrar completamente
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada',
            categoria: categoriaDB
        })
    });
});

module.exports = app;