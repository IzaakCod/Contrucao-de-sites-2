// Dados usados pela página
let produtos = [];
let categoriaSelecionada = "Todas";
const enderecoApi = "https://dummyjson.com/products";

// Pergunta o nome e mostra uma saudação
const nomeUsuario = prompt("Qual é o seu nome?");
const saudacao = document.getElementById("bemVindo");
saudacao.textContent = "Seja bem-vindo(a), " + (nomeUsuario || "visitante") + "!";

// Busca os produtos na API quando a página abre
async function carregarProdutos() {
    try {
        const resposta = await axios.get(enderecoApi);
        produtos = resposta.data.products;
        mostrarCategorias();
        mostrarProdutos();
    } catch (erro) {
        document.getElementById("itens").innerHTML =
            "<p class='empty-state'>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>";
    }
}

// Mostra uma opção para cada categoria encontrada
function mostrarCategorias() {
    const lista = document.getElementById("categoriasLista");
    const categorias = ["Todas"];

    for (let i = 0; i < produtos.length; i++) {
        const categoria = produtos[i].category;

        if (!categorias.includes(categoria)) {
            categorias.push(categoria);
        }
    }

    lista.innerHTML = "";

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];
        let quantidade = 0;

        for (let j = 0; j < produtos.length; j++) {
            if (categoria === "Todas" || produtos[j].category === categoria) {
                quantidade++;
            }
        }

        const classeAtiva = categoria === categoriaSelecionada ? "active" : "";
        lista.innerHTML += `
            <button class="category-chip ${classeAtiva}" onclick="filtrarCategoria('${categoria}')">
                <span class="category-icon">✦</span>
                <span>
                    <strong>${categoria}</strong>
                    <small>${quantidade} produtos</small>
                </span>
            </button>`;
    }
}

// Aplica o filtro escolhido
function filtrarCategoria(categoria) {
    categoriaSelecionada = categoria;
    mostrarCategorias();
    mostrarProdutos();
}

// Mostra os produtos na tela
function mostrarProdutos() {
    const lista = document.getElementById("itens");
    const contador = document.getElementById("contadorProdutos");
    let produtosMostrados = 0;

    lista.innerHTML = "";

    for (let i = 0; i < produtos.length; i++) {
        const produto = produtos[i];

        if (categoriaSelecionada !== "Todas" && produto.category !== categoriaSelecionada) {
            continue;
        }

        produtosMostrados++;
        const imagem = produto.thumbnail || "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80";
        const preco = Number(produto.price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        lista.innerHTML += `
            <article class="product-card">
                <div class="product-image-wrap">
                    <img class="product-image" src="${imagem}" alt="${produto.title}" loading="lazy">
                    <span class="category-tag">${produto.category}</span>
                </div>
                <div class="product-info">
                    <h3>${produto.title}</h3>
                    <p class="product-description">${produto.description}</p>
                    <div class="product-bottom">
                        <span class="price">${preco}</span>
                        <div class="card-actions">
                            <button onclick="editarProduto(${i})">Editar</button>
                            <button onclick="excluirProduto(${i})">Excluir</button>
                        </div>
                    </div>
                </div>
            </article>`;
    }

    contador.textContent = produtosMostrados + " produtos";

    if (produtosMostrados === 0) {
        lista.innerHTML = "<p class='empty-state'>Nenhum produto nesta categoria ainda.</p>";
    }
}

// Cadastra um produto quando o formulário é enviado
document.getElementById("formProduto").addEventListener("submit", adicionarProduto);

async function adicionarProduto(evento) {
    evento.preventDefault();

    const nome = document.getElementById("novoProduto").value.trim();
    const descricao = document.getElementById("descricaoProduto").value.trim();
    const categoria = document.getElementById("categoriaProduto").value.trim();
    const preco = Number(document.getElementById("precoProduto").value);
    const imagem = document.getElementById("imagemProduto").value.trim();

    if (nome === "" || descricao === "" || categoria === "" || preco <= 0) {
        alert("Preencha os campos e informe um preço maior que zero.");
        return;
    }

    try {
        const resposta = await axios.post(enderecoApi + "/add", {
            title: nome,
            description: descricao,
            category: categoria,
            price: preco,
            thumbnail: imagem
        });

        produtos.unshift(resposta.data);
        categoriaSelecionada = "Todas";
        document.getElementById("formProduto").reset();
        mostrarCategorias();
        mostrarProdutos();
        alert("Produto adicionado. A API de demonstração não salva a mudança permanentemente.");
    } catch (erro) {
        alert("Não foi possível cadastrar o produto.");
    }
}

// Altera os dados de um produto usando perguntas simples
async function editarProduto(indice) {
    const produto = produtos[indice];
    const nome = prompt("Nome:", produto.title);

    if (nome === null) return;

    const descricao = prompt("Descrição:", produto.description);
    if (descricao === null) return;

    const categoria = prompt("Categoria:", produto.category);
    if (categoria === null) return;

    const preco = Number(prompt("Preço:", produto.price));

    if (nome.trim() === "" || descricao.trim() === "" || categoria.trim() === "" || preco <= 0) {
        alert("Confira os campos e informe um preço válido.");
        return;
    }

    try {
        const resposta = await axios.patch(enderecoApi + "/" + produto.id, {
            title: nome.trim(),
            description: descricao.trim(),
            category: categoria.trim(),
            price: preco
        });

        produtos[indice] = resposta.data;
        mostrarCategorias();
        mostrarProdutos();
        alert("Produto atualizado. A API não salva a mudança permanentemente.");
    } catch (erro) {
        alert("Não foi possível editar o produto.");
    }
}

// Remove um produto da lista
async function excluirProduto(indice) {
    const produto = produtos[indice];

    if (!confirm("Deseja excluir " + produto.title + "?")) {
        return;
    }

    try {
        await axios.delete(enderecoApi + "/" + produto.id);
        produtos.splice(indice, 1);
        mostrarCategorias();
        mostrarProdutos();
        alert("Produto removido. A API não salva a mudança permanentemente.");
    } catch (erro) {
        alert("Não foi possível excluir o produto.");
    }
}

carregarProdutos();
