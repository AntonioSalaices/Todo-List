const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const PORT= process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// mysql
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'todos'
});

// Rutas
app.get('/', (req, res)=>{
    res.send("Bienvenido a mi API de todos en Express");
});

// Todas las tareas
app.get('/todos', (req, res)=>{
    const sql= "SELECT * FROM tasks";
    connection.query(sql, (error, results)=>{
        if(error) throw error;
        res.json(results);
    });
});


// Obtener una tarea
app.get('/todos/:id', (req, res)=>{
    const {id} = req.params;
    const sql = `SELECT * FROM tasks WHERE id=${id}`;
    connection.query(sql, (error, result)=>{
        if(error) throw error;
        if(result.length >0){
            res.json(result);
        }else{
            res.send("No hay resultado");
        }
    });

});

// Registrar tarea
app.post('/todos/add', (req, res)=>{
    sql = "INSERT INTO tasks SET ?";
    const TodoObject ={
        name: req.body.name,
        done: 0
    }
    console.log(TodoObject);
    connection.query(sql, TodoObject, error =>{
        if(error) throw error;
        res.send("Tarea creada");        
    });
});

// Actualizar estado de tarea
app.put('/todos/:id', (req, res)=>{
    const {id} = req.params;
    const sql1 = `SELECT * FROM tasks WHERE id=${id}`;
    connection.query(sql1, (error, result)=>{
        if(error) throw error;
        if(result.length >0){
        let status = result[0].done;    
            if(status == 0){
                const done=1;
                const sql = `UPDATE tasks SET done='${done}' WHERE id=${id}`;
                connection.query(sql, error =>{
                    if(error) throw error;
                    res.send("Status de tarea actualizado");        
                });
            }else{
                const done=0;
                const sql = `UPDATE tasks SET done='${done}' WHERE id=${id}`;
                connection.query(sql, error =>{
                    if(error) throw error;
                    res.send("Status de tarea actualizado");        
                });
            }
        }else{
            res.send("No hay resultado");
        }
    }); 
});

// Actualizar tarea
app.put('/todos/:id/edit', (req, res)=>{
    const {id} = req.params;
    const {name} = req.body;
    console.log("recibo: "+name);
    const sql = `UPDATE tasks SET name='${name}' WHERE id=${id}`;
    connection.query(sql, error =>{
        if(error) throw error;
        res.send("Tarea actualizada");        
    });
});

// Eliminar tarea
app.delete('/todos/:id', (req, res)=>{
    const {id} = req.params;
    const sql = `DELETE FROM tasks WHERE id=${id}`;
    connection.query(sql, error =>{
        if(error) throw error;
        res.send("Tarea eliminada");        
    });
});

// Checando conexión
connection.connect(error=>{
    if(error) throw error;
    console.log('\x1b[33m%s\x1b[0m',"Database server running");
})

app.listen(PORT, ()=> console.log('\x1b[32m%s\x1b[0m',`Server running on port ${PORT}`));