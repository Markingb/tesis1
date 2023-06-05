const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const multer = require('multer');
const fs= require('fs');
const pdfparse = require('pdf-parse');

//const pdffile = fs.readFileSync('src/uploads/ConstanciaKardex.pdf');

//para definir donde se guarda y con que nombre se guarda
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
//funciópn para crear txt
function text_(archiv0){
    concatenado = 'src/uploads/'+archiv0+'.pdf';
    //console.log(concatenado);
    const pdffile = fs.readFileSync(concatenado);
    pdfparse(pdffile).then(function (data){
        
        fs.writeFile('src/uploads/'+archiv0+'.txt', data.text, 'utf8', (error) => {
            if (error) {
              console.error('Error al crear el archivo:', error);
            } else {
              console.log('Archivo creado exitosamente.');
              const ruta_send = 'src/uploads/'+archiv0+'.txt';
              console.log(ruta_send);
              extraercadenas(ruta_send);
            }
          });
    });
}

//funcion para extraer y mandar a la bd
function extraercadenas(ruta){
    //const rutaTxt =;
    
    fs.readFile(ruta, 'utf8', (err, data) => {
        if (err) {
          console.error('Error al leer el archivo:', err);
          return;
        }
      
        // Separamos el archivo 
        const lineas = data.split('\n');

        //rellenamos las variables principales
        const facultad = lineas[10].slice(5,(lineas[10].length));
        const carrera = lineas[11].slice(3,(lineas[10].length));
        const n_cuenta = lineas[12].slice(0,9);
        const nombre = lineas[12].slice(10,(lineas[12].length));
        const promedio = lineas[15];
        const plan_estudio = lineas[13].slice((lineas[13].length-1),(lineas[13].length));
        const semestre = lineas[lineas.length-11];
        const primer_a = lineas[lineas.length-10].slice((([lineas.length-10].length-13)),([lineas.length-10].length-8));
        const seg_a = lineas[lineas.length-10].slice((([lineas.length-10].length-5)),(([lineas.length-10]).length-1));
        //console.log(seg_a);
        const generacion = primer_a + "-" + seg_a;
        //console.log(generacion);
        const lineaEspecifica = lineas[16 - 1];
        //console.log(lineaEspecifica);

        //recorremos las materias
        var semestre_actual = 1;
        for (var i = 17; i < ((lineas.length)-11); i++) {
            if(lineas[i].length < 2){
                semestre_actual = semestre_actual + 1;
            }else{
                const clave_materia = lineas[i].split(0,4);
                
            }
          }
          


        //console.log('Contenido del archivo:', data);
      });
}

//Rutas
app.use(require('./routes/index.js'));
//app.use(require('./routes/authentication.js'));
app.post('/upload', (req, res) =>{
    //res.send('Subido');
    //const upload = multer({ storage: storage });
    const nombreArchivo = req.file.originalname;
    const nombreextraido = nombreArchivo.substring(0, nombreArchivo.length-4);
    //console.log(nombreextraido);
    
    text_(nombreextraido);
    //extraercadenas(nombreextraido+'.txt');
    
    
    
    
    res.send('Se ha subido correctamente');
    //console.log(nombreArchivo);
});

//Publiic 
app.use(express.static(path.join(__dirname, 'public')));

//Arrancando servidor
app.listen(app.get('port'), () => {
    console.log(app.get('port'));
});