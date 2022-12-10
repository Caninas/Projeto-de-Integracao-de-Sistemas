const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Motor = new Schema({
    _id: {
        type: String,
        required: [true, "ID Obrigatório"],
        default: "motor"
    },
    velocidade: {
        type: Number
    },
});

// Exportar o modelo
module.exports = mongoose.model('motor', Motor)
