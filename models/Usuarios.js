import mongoose from 'mongoose'


const UsuariosSchema = new mongoose.Schema({
    codigo:{
        type: String,
        required: true
    },
    nombres:{
        type: String,
        required: true
    },
    apellidos:{
        type: String,
        required: true
    },

    tipoDocumento:{
        type: String,
        required: true
    },
    documento:{
        type: String,
        required: true
    },

    
    direccion:{
        
        type: String,
        required: true
    },
    ubicacion: {
        idUbicacion:{
            type:String,
            required:true,
        },
        departamento:{
            type:String,
            required:true,
        },
        municipio:{
            type:String,
            required:true,
        },
        codigoUbicacion:{
            type:String,
            required:true,
        },
    },
    telefono:{
        type: String,
        required: true
    },
    rol:{
        type: String,
        required: true
    },
   
    especialidad: {
        idEspecialidades:{
            type:String,
            required:true,
        }, 
        especialidad:{
            type:String,
            required:true,
        }, 
    },
  
    //se agregan los atriburos de espeialidadessasssssssssssssssss12

    estado:{
        type: String,
        required: true
    },
    fechaNacimiento:{
        type: Date,
        required: true
    },
    tipoSangre:{
        type: String,
        required: true
    },
    correo:{
        type: String,
        required: true
    },
    clave:{
        type: String,
        required: true
    },
   
   

    
});

export default mongoose.model("Usuarios", UsuariosSchema);
