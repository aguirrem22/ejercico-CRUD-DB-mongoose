// const express = require('express');
// const router = express.Router();
// const tasksRoutes = require('./routes/tasks');

// router.use('/', tasksRoutes);

// module.exports = router;
// index.js // Añadiremos nuestro servidor, conexión a la base de datos y uniremos el resto de la aplicación
const express = require('express');
const app = express();
const PORT = 3000;
const { dbConnection } = require('./config/config');
const routes = require('./routes/tasks');

app.use(express.json());

app.use('/', routes);

dbConnection();

app.listen(PORT, () => console.log(`servidor escuchando en el puerto ${PORT}`));