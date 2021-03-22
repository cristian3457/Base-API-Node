var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var stockProductoSchema = new Schema({
    precio: { type: Number, required: [true, 'El precio es necesario'] },
    stock: { type: Number, required: [true, 'El stock es necesario'] },
    color: { type: Schema.Types.ObjectId, ref: 'Color', required: [true, 'El color es necesario'] },
    estado: { type: Boolean, default: true },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: [true, 'El producto es necesario'] },
    img: { type: String, required: false },
}, { collection: 'stockProductos' });

stockProductoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('StockProducto', stockProductoSchema);