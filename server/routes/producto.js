const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
const categoria = require('../models/categoria');

//Obtener todos los productos
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos 
    //populate usuarios y categorias
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(10)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            });
        });
});

//Obtener un producto por ID
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate usuarios y categorias
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        });
});

//Buscar Productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
})


//Crear un producto
app.post('/productos', verificaToken, (req, res) => {
    //grabar un usuario
    //grabar una categoria

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status('500').json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

//Actualizar un producto por ID
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar un usuario
    //grabar una categoria

    let id = req.params.id;
    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    };

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria');


});

//Borrar un producto por ID
app.delete('/productos/:id', verificaToken, (req, res) => {
    //Cambiar estado (disponible = false)
    let id = req.params.id;
    let disponible = { disponible: false }

    Producto.findByIdAndUpdate(id, disponible, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Producto borrada',
            producto: productoDB
        })
    });

});


module.exports = app;