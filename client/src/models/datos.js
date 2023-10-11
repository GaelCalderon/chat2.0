const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// chat
const chat = new Schema({
    nombre: String,
    mensaje: String,
}, {
    versionKey: false 
});

// registro
const registro = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contraseña: {
        type: String,
        required: true
    },
   
}, {
    versionKey: false 
});


  module.exports = {
    chatModel: mongoose.model('chat', chat),
    registroModel: mongoose.model('registro', registro)
};