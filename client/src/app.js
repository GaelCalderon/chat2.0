const express = require('express');
const app = express();
const log = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const os = require('os');
const IndexRoutes = require('./routers/index.js');

app.set('port', process.env.PORT || 5000); //asigna el puerto 4000
app.use(log('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', IndexRoutes);

app.listen(app.get('port'),() => { 
    console.log('El servidor esta funcionando en el puerto', app.get('port')); 
}
);


// const ipAddress = '192.168.171.1'; //aqui colocamos nuestra ip con la que entraremos en la pagina

// app.use(log('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/', IndexRoutes);

// app.listen(80, ipAddress, () => {
//     console.log(`El servidor está funcionando en http://${ipAddress}`);
// });


mongoose.connect('mongodb+srv://tbotello73:bdtbote@cluster0.fbmoru0.mongodb.net/Chat?retryWrites=true&w=majority')
.then(() => {
    console.log('Conexión a la base de datos establecida');
})
.catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
