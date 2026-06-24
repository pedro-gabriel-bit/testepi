const path = require('path');

// Arrays dos objetos
const usuarios = [];
const fichas = [];

// Função para cadastrar usuario
function cadastrarUsuario(req, res) {
    const { nome, email, senha, tipo, cref, especialidade } = req.body;

    if (!nome || !email || !senha) {
        return res.send(`
            <h1>Erro ao realizar cadastro</h1>
            <p>Preencha todos os campos</p>
            <a href="/cadastro.html">Voltar</a>
        `);
    }

    // Se for professor, exige CREF e especialidade
    if (tipo === "professor" && (!cref || !especialidade)) {
        return res.send(`
            <h1>Erro ao realizar cadastro</h1>
            <p>Preencha os campos de CREF e Especialidade</p>
            <a href="/cadastro.html">Voltar</a>
        `);
    }

    const usuarioExistente = usuarios.find((usuario) => usuario.email === email);

    if (usuarioExistente) {
        return res.redirect("/cadastro?erro=email");
    }

    const novoUsuario = {
        id: Date.now(),
        nome,
        email,
        senha, // ⚠️ Ideally use bcrypt to hash before storing
        tipo: tipo || "usuario",
    };

    // Só adiciona os campos extras se for professor
    if (novoUsuario.tipo === "professor") {
        novoUsuario.cref = cref;
        novoUsuario.especialidade = especialidade;
    }

    usuarios.push(novoUsuario);
    console.log("Usuários cadastrados:", usuarios);

    res.redirect(`/ficha.html?email=${encodeURIComponent(email)}`);
}

// Função para preencher a ficha
function fichaUsuario(req, res) {
    const { idade, altura, peso, objetivo, nivel, email } = req.body;

    // Valida campos obrigatórios
    if (!idade || !altura || !peso || !objetivo || !nivel || !email) {
        return res.send(`
            <h1>Erro ao preencher ficha</h1>
            <p>Preencha todos os campos</p>
            <a href="/ficha.html">Voltar</a>
        `);
    }

    const usuarioEncontrado = usuarios.find((u) => u.email === email);

    if (!usuarioEncontrado) {
        return res.send("Usuário não encontrado");
    }

    // Evita ficha duplicada — atualiza se já existir
    const fichaExistente = fichas.find((f) => f.usuarioEmail === email);

    if (fichaExistente) {
        Object.assign(fichaExistente, { idade, altura, peso, objetivo, nivel });
    } else {
        fichas.push({
            usuarioEmail: email,
            idade,
            altura,
            peso,
            objetivo,
            nivel,
        });
    }

    console.log("Fichas:", fichas);
    return res.redirect("/login.html");
}

// Função para realizar login
function realizarLogin(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.redirect("/login?erro=campos");
    }

    const usuarioEncontrado = usuarios.find(
        (usuario) => usuario.email === email && usuario.senha === senha
    );

    if (!usuarioEncontrado) {
        return res.redirect("/login?erro=senha");
    }

    // ✅ Bug fix: redireciona em caso de sucesso
    return res.redirect("/dashboard.html");
}

module.exports = {
    cadastrarUsuario,
    fichaUsuario,
    realizarLogin,
};