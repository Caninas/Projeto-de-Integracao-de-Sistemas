const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sensor = new Schema({
    _id: {
        type: String,
        required: [true, "ID Obrigatório"],
        default: "sensor"
    },
    sensibilidade: {
        type: Number
    },
    hist: {
        type: Array
    },
});

// Exportar o modelo
module.exports = mongoose.model('sensor', Sensor)
