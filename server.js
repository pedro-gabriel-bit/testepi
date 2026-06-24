const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const { cadastrarUsuario,realizarLogin, fichaUsuario } = require('./controllers/authControllers');


app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "public")));

app.get("/",(req,res) =>{
    res.redirect("/index.html");
});

app.post("/cadastro", cadastrarUsuario);

app.post("/ficha",fichaUsuario);

app.post("/login", realizarLogin);




app.listen(PORT, ()=>{
    console.log(`servidor rodando em http://localhost:${PORT}`);
});