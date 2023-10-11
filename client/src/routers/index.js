const express = require('express');
const router = express.Router();
const { chatModel, registroModel } = require('../models/datos.js');  // Se importa registroModel en lugar de cuentaModel
const session = require('express-session');

router.use(
    session({
      secret: 'secret', 
      resave: false,
      saveUninitialized: true,
    })
);

let userAutenticado = false;

const verificarAutenticacion = (req, res, next) => {
    if (userAutenticado || req.session.usuarioAutenticado) {
      next();
    } else {
      res.redirect('/login');
    }
};

router.get('/', async (req, res) => {
    try {
      const datos = await chatModel.find(); 
      res.render('index.ejs', { datos }); 
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).send('Error en el servidor');
    }
});

router.post('/registro', async (req, res) => {
    try {
      const { nombre, email, contraseña } = req.body;
      if (!nombre || !email|| !contraseña) {
        return res.render('registro.ejs', {
          error: 'Nombre, correo y contraseña son obligatorios',
        });
      }

      const nuevaCuenta = new registroModel({
        nombre,
        correo, 
        contraseña,
      });

      await nuevaCuenta.save();
      res.redirect('/login'); 
    } catch (error) {
      console.error('Error al registrar la cuenta:', error);
      res.status(500).send('Error en el servidor');
    }
});
  
router.get('/login', (req, res) => {
    res.render('index.ejs');
});

router.get('/registro', (req, res) => {
    res.render('registro.ejs'); 
});
  
router.post('/login', async (req, res) => {
    try {
      const { nombre, contraseña } = req.body;
  
      const cuenta = await registroModel.findOne({ nombre, contraseña });  
      if (cuenta) {
        usurarioAutenticado = true;
  
        req.session.nombreUsuario = nombre;
        req.session.usuarioAutenticado = true;
        res.redirect('/chat.ejs'); 
      } else {
        res.render('index.ejs', { error: 'Nombre o contraseña incorrectos' });
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      res.status(500).send('Error en el servidor');
    }
});

router.post('/send', async (req, res) => {
    try {
      const { nombre, mensaje } = req.body;
  
      if (!nombre || !mensaje) {
        return res.status(400).json({ error: 'Nombre y mensaje son obligatorios' });
      }
  
      const nuevoMensaje = new chatModel({
        nombre,
        mensaje,
      });
  
      await nuevoMensaje.save();
  
      res.redirect('/chat');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
});
  
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      usuarioAutenticado = false;
      res.redirect('/login');
    });
});

router.get('/chat', verificarAutenticacion, async (req, res) => {
    try {
      const mensajes = await chatModel.find(); 
      res.render('index.ejs', {
        datos: mensajes,
        nombreUsuario: req.session.nombreUsuario, 
      });
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      res.status(500).send('Error en el servidor');
    }
});
  
module.exports = router;
