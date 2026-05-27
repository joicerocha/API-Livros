const api = "http://localhost:3000/livros";

const livrosContainer = document.getElementById("livrosContainer");
const form = document.getElementById("livroForm");
const pesquisa = document.getElementById("pesquisa");

function salvarLocalStorage(livros) {
  localStorage.setItem("livros", JSON.stringify(livros));
}

function pegarLocalStorage() {
  return JSON.parse(localStorage.getItem("livros")) || [];
}

async function sincronizarStorage() {

  const resposta = await fetch(api);
  const livrosApi = await resposta.json();

  if (livrosApi.length === 0) {

    const livrosStorage = pegarLocalStorage();

    for (const livro of livrosStorage) {

      await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(livro)
      });
    }
  }
}

async function carregarLivros() {

  const resposta = await fetch(api);
  const livros = await resposta.json();

  salvarLocalStorage(livros);

  livrosContainer.innerHTML = "";

  const textoPesquisa = pesquisa.value.toLowerCase();

  const livrosFiltrados = livros.filter(livro =>
    livro.titulo.toLowerCase().includes(textoPesquisa)
  );

  livrosFiltrados.forEach(livro => {

    livrosContainer.innerHTML += `
      <div class="card">

        <h2>${livro.titulo}</h2>

        <p><strong>Autor:</strong> ${livro.autor}</p>

        <p><strong>Categoria:</strong> ${livro.categoria}</p>

        <p><strong>Páginas:</strong> ${livro.paginas}</p>

        <div class="actions">

          <button 
            class="edit" 
            onclick="editarLivro(${livro.id})"
          >
            Editar
          </button>

          <button 
            class="delete" 
            onclick="deletarLivro(${livro.id})"
          >
            Excluir
          </button>

        </div>

      </div>
    `;
  });
}

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const id = document.getElementById("id").value;

  const livro = {
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    categoria: document.getElementById("categoria").value,
    paginas: document.getElementById("paginas").value
  };

  if (id) {

    await fetch(`${api}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(livro)
    });

  } else {

    await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(livro)
    });

  }

  form.reset();

  document.getElementById("id").value = "";

  carregarLivros();
});


async function deletarLivro(id) {

  await fetch(`${api}/${id}`, {
    method: "DELETE"
  });

  carregarLivros();
}

async function editarLivro(id) {

  const resposta = await fetch(`${api}/${id}`);
  const livro = await resposta.json();

  document.getElementById("id").value = livro.id;
  document.getElementById("titulo").value = livro.titulo;
  document.getElementById("autor").value = livro.autor;
  document.getElementById("categoria").value = livro.categoria;
  document.getElementById("paginas").value = livro.paginas;
}

sincronizarStorage().then(() => {
  carregarLivros();
});

pesquisa.addEventListener("input", carregarLivros);