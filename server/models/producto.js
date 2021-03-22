var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre del producto es necesario'] },
    precio: { type: String, required: [true, 'El precio del producto es necesario'] },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    resumenBreve: { type: String, required: [true, 'El resumen breve es necesario'] },
    caracteristicas: { type: String, required: [true, 'Las características son necesarias'] },
    departamento: { type: Schema.Types.ObjectId, ref: 'Departamento', required: [true, 'El departamento es necesario'] },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: [true, 'La categoria es necesaria'] },
    subcategoria: { type: Schema.Types.ObjectId, ref: 'Subcategoria', required: [true, 'La subcategoria es necesaria'] },
    img: { type: String, required: false },
    estado: { type: Boolean, default: true },
}, { collection: 'productos' });

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Producto', productoSchema);