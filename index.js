// index.js
const express = require('express');
const cors = require('cors'); // Importa o pacote CORS
const app = express();
const port = 3000;

// Habilita o CORS para todas as rotas
app.use(cors());

// Middleware para permitir JSON no corpo das requisições
app.use(express.json());

app.use(express.static('public'));

// Dados em memória (exemplo de livros)
let livros = [
  { 
    id: 1, 
    titulo: "Dom Casmurro", 
    autor: "Machado de Assis", 
    categoria: "Romance", 
    paginas: 256 
  },

  { 
    id: 2, 
    titulo: "O Hobbit", 
    autor: "J.R.R. Tolkien", 
    categoria: "Fantasia", 
    paginas: 310 
  },

  { 
    id: 3, 
    titulo: "It: A Coisa", 
    autor: "Stephen King", 
    categoria: "Terror", 
    paginas: 1104 
  }
];


// Rota GET para obter um livro pelo ID
app.get('/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const livro = livros.find(l => l.id === id);

  if (livro) {
    res.json(livro);
  } else {
    res.status(404).json({ error: "Livro não encontrado" });
  }
});


// Rota GET para obter todos os livros
app.get('/livros', (req, res) => {
  res.json(livros);
});


// Rota POST para adicionar um novo livro
app.post('/livros', (req, res) => {

  const novoLivro = {
    id: Date.now(),
    titulo: req.body.titulo,
    autor: req.body.autor,
    categoria: req.body.categoria,
    paginas: req.body.paginas
  };

  livros.push(novoLivro);

  res.status(201).json(novoLivro);
});


// Rota PUT para atualizar um livro existente
app.put('/livros/:id', (req, res) => {

  const id = parseInt(req.params.id);
  const livro = livros.find(l => l.id === id);

  if (livro) {

    livro.titulo = req.body.titulo || livro.titulo;
    livro.autor = req.body.autor || livro.autor;
    livro.categoria = req.body.categoria || livro.categoria;
    livro.paginas = req.body.paginas || livro.paginas;

    res.json(livro);

  } else {

    res.status(404).json({ error: "Livro não encontrado" });

  }
});


// Rota DELETE para excluir um livro
app.delete('/livros/:id', (req, res) => {

  const id = parseInt(req.params.id);
  const index = livros.findIndex(l => l.id === id);

  if (index !== -1) {

    livros.splice(index, 1);
    res.status(204).send();

  } else {

    res.status(404).json({ error: "Livro não encontrado" });

  }
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

