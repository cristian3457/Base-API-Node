const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let direccionSchema = new Schema({
    cp: { type: String, required: [true, 'El codigo postal es necesario'] },
    estado: { type: String, required: [true, 'El estado es necesario'] },
    ciudad: { type: String, required: [false, 'La ciudad es necesaria'] },
    municipio: { type: String, required: [false, 'El municipio es necesario'] },
    colonia: { type: String, required: [true, 'La colonia es necesaria'] },
    calle: { type: String, required: [true, 'La calle es necesaria'] },
    numExterior: { type: String, required: [true, 'El numero exterior es necesario'] },
    numInterior: { type: String, required: [false, 'El numero interior es necesario'] },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
});

direccionSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Direccion', direccionSchema);