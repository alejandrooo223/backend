const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql2/promise');
const cors = require('cors');
const session = require('express-session');
const md5 = require('md5');


mysql://root:URoTTBSGbQKezEmtMqyIxgsjNDGceVsR@junction.proxy.rlwy.net:12082/railway

app.use(express.json());


app.use(cors({
    origin: process.end.URLFRONTEND || 'http://localhost:5173',
    credentials: true
}));


app.use(session({
    secret: process.end.SECRETSESSION || 'asdfsdfsdfvcv',
    proxy: process.env.NODE.ENV=== 'production',
    cookie: { secure: process.env.NODE.ENV === 'production',
        sameSite: 'none'

    }

}));


const connection = mysql.createPool({
    host: process.env.HOSTDB || 'localhost',
    user: process.env.HOSTDB || 'root',
    database:  process.env.DB ||'usuario',
    password: process.env.PASSWORDDB || '',
    port: process.end.portDB
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/login', async (req, res) => {
    const datos = req.query;
    try {
        const [results] = await connection.query(
            "SELECT * FROM usuario WHERE usuario = ? AND clave = ?",
            [datos.usuario, md5(datos.clave)]
        );

        if (results.length > 0) {
            req.session.usuario = datos.usuario;
            res.status(200).send('Inicio de sesión correcto');
        } else {
            res.status(401).send('Datos incorrectos');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
    }
});

c
app.get('/validar', (req, res) => {
    if (req.session.usuario) {
        res.status(200).send('Sesión validada');
    } else {
        res.status(401).send('No autorizado');
    }
});


app.post('/registro', async (req, res) => {
    if (!req.session.usuario) {
        res.status(401).send('Sesión NO validada');
        return
    } 
    const datos = req.body;

    if (!datos.usuario || !datos.clave) {  
        return res.status(400).send('Usuario y clave son requeridos');
    }

    try {
        const [results] = await connection.query(
            "INSERT INTO usuario (usuario, clave) VALUES (?, ?)",
            [datos.usuario, datos.clave]
        );

        if (results.affectedRows > 0) {
            req.session.usuario = datos.usuario;
            res.status(200).send('Registro correcto');
        } else {
            res.status(401).send('Registro incorrecto');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/usuarios', async (req, res) => {
    if (!req.session.usuario) {
        res.status(401).send('Sesión NO validada');
        return
        }    try {
        const [results] = await connection.query("SELECT * FROM usuario");
        res.status(200).json(results);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
    }
})




app.delete('/usuarios', async (req, res) => {
    if (!req.session.usuario) {
        res.status(401).send('Sesión NO validada');
        return
        }   
        const datos = req.query 
        try {
        const [results] = await connection.query("DELETE FROM `usuario` WHERE `usuario`.`id` = ?", 
    [datos.id])
    if (results.affectedRows > 0) {
        res.status(200).send('usuario eliminado ');
    } else {
        res.status(401).send('no se elimina');
    }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
