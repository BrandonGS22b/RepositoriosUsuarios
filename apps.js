
import express from 'express'
import cors from 'cors'
import {conexionDB} from './DB/conexion.js'
import rutaUsuarios from './router/usuariorouter.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use("/usuarios", rutaUsuarios);






conexionDB();



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto: ", PORT);
});
