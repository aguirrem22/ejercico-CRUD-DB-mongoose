const express = require('express')
const app = express()
app.listen(3000,()=>{
  console.log('Node.js esta escuchando en el puerto 3000' )
})
app.get('/', (req, res)=>{
  res.send('HOLA MUNDO EXPRESS!!')
})
module.exports = app;   