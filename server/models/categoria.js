const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

let categoriaSchema = new Schema({
    categoria: {
        type: String,
        required: [true, 'El nombre de la categoria es necesario'],
        unique: true
    },
    descripcion: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        //required: true //,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }
});

categoriaSchema.methods.toJSON = function() {
    let categoria = this;
    let categoriaObject = categoria.toObject();

    return categoriaObject;
};

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = moongose.model('Categoria', categoriaSchema);