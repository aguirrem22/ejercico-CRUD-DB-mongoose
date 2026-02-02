// const express = require("express");
// const router = express.Router();
// const User = require("../models/task"); 


// router.post("/create", async(req, res) => {
//     try {
//         const task = await Task.create(req.body);
//         res.status(201).send(task);
//     } catch (error) {
//         console.error(error);
//         res
//             .status(500)
//             .send({ message: "Hay un problema para crear la tarea" });
//     }
// });

// router.get("/", async (req, res) => {
//     try {
//         const tasks = await Task.find();
//         res.status(200).send(tasks);
//     }
//     catch (error) {
//         console.error(error);
//         res
//             .status(500)
//             .send({ message: "Hay un problema para obtener las tareas" });
//     }           
// });

// router.get("/id/:_id", async (req, res) => {
//     try {
//         const task =
//             await Task.findById(req.params._id);
//         res.status(200).send(task);
//     }               
//     catch (error) {
//         console.error(error);
//         res     
//         .status(500)
//         .send({ message: "Hay un problema para obtener la tarea por id" });
//     }   
// }); 
// router.put("/markAsCompleted/:_id", async (req, res) => {
//     try {
//         const task =
//             await Task.findByIdAndUpdate(
//                 req.params._id,
//                 { completed: true },        
//                 { new: true }
//             );
//         res.status(200).send(task);
//     }   
//     catch (error) {
//         console.error(error);
//         res     
//         .status(500)
//         .send({ message: "Hay un problema para marcar la tarea como completada" });
//     }   
// });

// router.put("/id/:_id", async (req, res) => {    
//     try {   
//         const task =
//             await Task      .findByIdAndUpdate(
//                 req.params._id,
//                 { title: req.body.title },              
//                 { new: true }
//             );
//         res.status(200).send(task);
//     }   
//     catch (error) {
//         console.error(error);
//         res     
//         .status(500)
//         .send({ message: "Hay un problema para actualizar la tarea" });
//     }   
// }); 
// router.delete("/id/:_id", async (req, res) => {
//     try {
//         await Task.findByIdAndDelete(req.params._id);
//         res.status(200).send({ message: "Tarea eliminada exitosamente" });
//     }
//     catch (error) {
//         console.error(error);
//         res
//             .status(500)
//             .send({ message: "Hay un problema para eliminar la tarea" });
//     }       
// });

// module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task');

const router = express.Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);


router.post('/create', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'El campo "title" es obligatorio y debe ser un string no vacío',
      });
    }

    const task = await Task.create({ title: title.trim() });
    return res.status(201).json({ ok: true, data: task });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Error al crear la tarea', details: err.message });
  }
});


router.get('/', async (_req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.json({ ok: true, data: tasks });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Error al obtener las tareas', details: err.message });
  }
});


router.get('/id/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidId(_id)) {
      return res.status(400).json({ ok: false, message: 'ID inválido' });
    }

    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).json({ ok: false, message: 'Tarea no encontrada' });
    }

    return res.json({ ok: true, data: task });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Error al buscar la tarea', details: err.message });
  }
});


router.put('/markAsCompleted/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidId(_id)) {
      return res.status(400).json({ ok: false, message: 'ID inválido' });
    }

    const updated = await Task.findByIdAndUpdate(
      _id,
      { $set: { completed: true } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ ok: false, message: 'Tarea no encontrada' });
    }

    return res.json({ ok: true, data: updated });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Error al marcar la tarea como completada', details: err.message });
  }
});


router.put('/id/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidId(_id)) {
      return res.status(400).json({ ok: false, message: 'ID inválido' });
    }


    const { title } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'El campo "title" es obligatorio y debe ser un string no vacío',
      });
    }

    const updated = await Task.findByIdAndUpdate(
      _id,
      { $set: { title: title.trim() } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ ok: false, message: 'Tarea no encontrada' });
    }

    return res.json({ ok: true, data: updated });
  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Error al actualizar la tarea', details: err.message });
  }
});

router.delete('/id/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidId(_id)) {
      return res.status(400).json({ ok: false, message: 'ID inválido' });
    }

    const deleted = await Task.findByIdAndDelete(_id);
    if (!deleted) {
      return res.status(404).json({ ok: false, message: 'Tarea no encontrada' });
    }   
    return res.json({ ok: true, message: 'Tarea eliminada exitosamente' });
    } catch (err) {
    return res.status(500).json({ ok: false, message: 'Error al eliminar la tarea', details: err.message });
  } 
});

module.exports = router;

