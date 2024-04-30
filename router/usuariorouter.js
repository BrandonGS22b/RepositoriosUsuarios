import { Router } from "express";
import Usuario from '../models/Usuarios.js'
const router = Router();
//importo libreria para encryptar contraseña
//const bcrypjs =require('bcrypjs'); //error en esta libreria verificar

import bcryptjs from 'bcryptjs';



//inicio session

//crear usuario hasheado 

// Crear Usuario

router.post("/createUser", async (req, res) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ correo: req.body.correo });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe." });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(req.body.clave, 15); // 15 es el número de rondas de encriptación

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


// Crear Usuario

/*
router.post("/createUser", async (req, res) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ correo: req.body.correo });
        if (existingUser) {

            return res.status(400).json({ message: "El usuario ya existe." });
        }

        // Crear nuevo usuario
        const newUser = new Usuario(req.body);

        // Guardar el nuevo usuario en la base de datos
        const savedUser = await newUser.save();
        res.status(201).json({ message: "Usuario creado exitosamente.", Usuario: savedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el usuario.", error: error.message });
    }
});

*/


//editar Usuario
router.patch("/editUser/:id", (req, res) => {
    Usuario.findOneAndUpdate(
        {_id: req.params.id },{new: true}
    ).then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({ message: err})
    });
});




// buscar usuario por ID boorrar
/*
router.get("/SerchById/:id", (req, res) => {
    const userId = req.params.id;

    Usuario.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }
            res.status(200).json(user); // Aquí estaba usando `data` en lugar de `user`
        })
        .catch(err => {
            res.status(500).json({ message: "Error al buscar al usuario.", error: err });
        });
});
*/

// get para mostrar todos los usuarios
router.get("/GetAll",(req,res)=> {
    Usuario.find()
        .then(datos => res.json ({Usuario:datos}))
        .catch(error => res.json ({mensaje: error}));

})




// buscar usuario por documento
router.get("/ScherByDocumento", async (req, res) => {
    
    const { documento } = req.body;

    try {

        const user =  await Usuario.findOne({ documento: documento })
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: "Error al buscar al usuario.", error: err });
    }
  
});



//inicio de sesion
router.post("/LoginByUser", (req, res) => {
    const { correo, clave} = req.body;

    Usuario.findOne({ correo: correo})
        .then(existUser => {
            if(existUser){
                //Authenticar datos correo y clave
                if(existUser.clave === clave){
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