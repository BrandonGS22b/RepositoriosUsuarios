import express from 'express';
import cors from 'cors';
import { conexionDB } from './DB/conexion.js';
import rutaUsuarios from './router/usuariorouter.js';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Permitir solicitudes solo desde localhost:3000
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permitir los métodos HTTP especificados
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/usuarios", rutaUsuarios);

conexionDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto: ", PORT);
});