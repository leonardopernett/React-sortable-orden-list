const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const Task = require('./Task')
mongoose
  .connect("mongodb://localhost/react-simple", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((db) => console.log("db is connected"))
  .catch((err) => console.log(err));


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors());
app.post('/tasks', async (req,res)=>{
    const task = new Task(req.body);
    task.sorting = await Task.estimatedDocumentCount();
    await task.save();
    res.json('tasks saved')
})

app.get('/tasks', async (req,res)=>{
    const task = await Task.find();
    res.json(task)
})

app.put('/tasks',async  (req,res)=>{
  const taskId= req.body;
  for(let [i, id] of taskId.entries()){
    await Task.updateOne({_id:id}, {sorting:i}) 
  }
  res.json('la lista esta ordenada')
})


app.listen(4000, () => console.log("server on port 4000"));
