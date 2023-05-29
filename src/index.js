const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const multer = require('multer');
const fs= require('fs');
const pdfparse = require('pdf-parse');

const pdffile = fs.readFileSync('src/uploads/ConstanciaKardex.pdf');


const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
    
});


//initialize
const app = express();

//settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
/*app.engine('.hbs', engine({
    defaultLayout: 'main', 
    layoutsDir: path.join(app.get('views'), 'layout'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extnames: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');*/
app.set('view engine', 'ejs');

//Middlewaress
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(multer({
    storage
    //dest: path.join(__dirname, 'uploads')
}).single('archivo'));

//Variables Globales
app.use((req, res, next) => {
    next();
});
function convertir(){
    
}
//Rutas
app.use(require('./routes/index.js'));
//app.use(require('./routes/authentication.js'));
app.post('/upload', (req, res) =>{
    res.send('Subido');
    console.log(storage.destination);
    pdfparse(pdffile).then(function (data){
        fs.writeFile('src/uploads/archivo.txt', data.text, 'utf8', (error) => {
            if (error) {
              console.error('Error al crear el archivo:', error);
            } else {
              console.log('Archivo creado exitosamente.');
            }
          });
    });
});

//Publiic 
app.use(express.static(path.join(__dirname, 'public')));

//Arrancando servidor
app.listen(app.get('port'), () => {
    console.log(app.get('port'));
});