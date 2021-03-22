const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let subcategoriaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [false, 'La descripcion es necesaria'] },
    estado: { type: Boolean, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
});

subcategoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Subcategoria', subcategoriaSchema);