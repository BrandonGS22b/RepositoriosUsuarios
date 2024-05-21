import { Router } from "express";
import Usuario from '../models/Usuarios.js'
const router = Router();
//const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
//require('dotenv').config();
dotenv.config();

//importo libreria para encryptar contraseña
//const bcrypjs =require('bcrypjs'); //error en esta libreria verificar

import bcryptjs from 'bcryptjs';



//inicio session
//crear usuario hasheado 
// Crear Usuario

router.post("/createUser", async (req, res) => {
    try {
        // Verificar si el usuario ya existe
        console.log("Se va a comparar el siguiente correo en la base de datos: " + req.body.correo);
        const existingUser = await Usuario.findOne({ correo: req.body.correo });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe.", correo: req.body.correo });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcryptjs.hash(req.body.clave, 15);

        // Crear un nuevo objeto de usuario con la contraseña encriptada
        const newUser = new Usuario({
            ...req.body,
            clave: hashedPassword
        });

        // Guardar el nuevo usuario en la base de datos
        const savedUser = await newUser.save();
        res.status(201).json({ message: "Usuario creado exitosamente.", Usuario: savedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el usuario.", error: error.message });
    }
});




//editar Usuario
router.patch("/EditUser/:id", async  (req, res) => {
    if(req.body.clave){
        // Encriptar la contraseña
        const hashedPassword = await bcryptjs.hash(req.body.clave, 15);3
        // Actualizar el usuario con la contraseña encriptada
        req.body.clave = hashedPassword;
    }
    Usuario.findOneAndUpdate(
        {_id: req.params.id },
        {$set: req.body},
        {new: true}
    ).then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({ message: err})
    });
});


// get para mostrar todos los usuarios
router.get("/GetAll",(req,res)=> {
    Usuario.find()
        .then(datos => res.json ({Usuario:datos}))
        .catch(error => res.json ({mensaje: error}));

});

//Buscar por Id
router.get("/SearchById/:_id",(req,res)=> {
    const {_id} = req.params;
    Usuario.find({_id: _id})
        .then(datos => res.json ({Usuario:datos}))
        .catch(error => res.json ({mensaje: error}));
});

//Buscar por Documento 
router.get("/SearchByDocument/:documento",(req,res)=> {
    const {documento} = req.params;
    Usuario.find({documento: documento})
        .then(datos => res.json ({Usuario:datos}))
        .catch(error => res.json ({mensaje: error}));
});

//Buscar por Correo 
router.get("/SearchByEmail/:correo",(req,res)=> {
    const {correo} = req.params;
    Usuario.find({correo: correo})
        .then(datos => res.json ({Usuario:datos}))
        .catch(error => res.json ({mensaje: error}));
});

//Buscar por Nombre 
router.get("/SearchByName/:nombre",(req,res)=> {
    const {nombre} = req.params;
    Usuario.find({nombre: nombre})
        .then(datos => res.json ({Usuario:datos}))
        .catch(error => res.json ({mensaje: error}));
});

//Buscar por Apellido 
router.get("/SearchByLastName/:apellido",(req,res)=> {
    const {apellido} = req.params;
    Usuario.find({apellido: apellido})
        .then(datos => res.json ({Usuario:datos}))
        .catch(error => res.json ({mensaje: error}));
});

//inicio de sesion
router.post("/LoginByUser", (req, res) => {
    const { correo, clave} = req.body;

    Usuario.findOne({ correo: correo})
        .then(existUser => {
            if(existUser){
                if (existUser.estado !== 'activo') {
                    return res.status(403).json({ message: "El usuario está inactivo." });
                }

                //Authenticar datos correo y clave
                if(existUser.clave === clave){
                    const user = {correo: correo, clave: clave}
                    const accessToken = generateAccessToken(user);
                    res.header('authorization', accessToken).json({
                        message: 'Usuario autenticado',
                        token: accessToken,
                        rol: existUser.rol, // Incluir el rol del usuario en la respuesta
                        nombres:existUser.nombres,
                        usuario: existUser, // Incluir el objeto del usuario en la respuesta
                    });
                    return res.status(200).json({ message: "Inicio de sesión exitoso." });
                }else{
                    return res.status(401).json({ message: "Contraseña incorrecta." });
                }
            }else{
                return res.status(400).json({ message: "El usuario no se encueentra registrado." });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Error al buscar al usuario en la base de datos.", error: err });
        });

});

function generateAccessToken(user){
    return jwt.sign(user, process.env.SECRET, {expiresIn: '1m'});
}


////////////////////////////////////////////////////////////////////////
// Middleware para verificar el token
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó ningún token." });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "El token no es válido." });
        }
        req.userId = decoded.id;
        next();
    });
}


// Ruta para obtener información del usuario autenticado
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await Usuario.findById(req.userId, { password: 0 });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar al usuario.", error: error });
    }
});



//////////////////////////////////////////////////////////////////






// Desactivar Usuario
router.patch("/DisableByUser/:id", (req, res) => {
    Usuario.updateOne(
        { _id: req.params.id },
        {
            $set: {
                estado: "inactivo" //  para inactivar usuario 
            }
        }
    )
    .then(() => {
        res.status(200).json({ message: "Usuario desactivado exitosamente." });
    })
    .catch((err) => {
        res.status(500).json({ message: "Error al desactivar al usuario.", error: err });
    });
});

// Activar usuario Usuario
router.patch("/EnableByUser/:id", (req, res) => {
    Usuario.updateOne(
        { _id: req.params.id },
        {
            $set: {
                estado: "Activo" //  para activar usuario 
            }
        }
    )
    .then(() => {
        res.status(200).json({ message: "Usuario activado exitosamente." });
    })
    .catch((err) => {
        res.status(500).json({ message: "Error al activar al usuario.", error: err });
    });
});

//cerrar seccion 
router.post("/logout", (req, res) => {
    try {
       
         res.clearCookie("token"); 
        
        // Envía una respuesta exitosa al cliente.
        res.status(200).json({ message: "Sesión cerrada exitosamente." });
    } catch (error) {
        // Manejo de errores si ocurre algún problema al cerrar sesión
        res.status(500).json({ message: "Error al cerrar sesión.", error: error.message });
    }
});


export default router;
