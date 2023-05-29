const express = require('express');
const router = express.Router();
const pool = require('../database');
const controller = require('../controller/upload');



router.get('/', (req, res) => {
    res.render('index');
    //res.send("Hola mundo");
});

/*router.post('/', (req, res) => {
    res.send('subido');
    controller.upload,
    controller.uploadFile;s
});*/

module.exports = router;
