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
    direccion:{
        
        type: String,
        required: true
    },
    telefono:{
        type: String,
        required: true
    },
    correo:{
        type: String,
        required: true
    },
    tipodedocumento:{
        type: String,
        required: true
    },
    documento:{
        type: Number,
        required: true
    },
    rol:{
        type: String,
        required: true
    },

    //se agregan los atriburos de espeialidadessasssssssssssssssss12
    Especialidades: {
        idEspecialidades:{
            type:Number,
            required:true
        }, 
    },
    estado:{
        type: String,
        required: true
    },
    fechanacimiento:{
        type: Date,
        required: true
    },
    tiposangre:{
        type: String,
        required: true
    },
    clave:{
        type: String,
        required: true
    },
   
    Ubicacion: {
        idUbicacion:{
            type:Number,
            required:true,
        }
    }

    
});

export default mongoose.model("Usuarios", UsuariosSchema);
