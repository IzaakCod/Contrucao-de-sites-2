const usuario = prompt("Qual o seu nome?");

const bemVindo = document.getElementById("bemVindo")
bemVindo.innerHTML = `Seja bem-vindo(a), ${usuario}!`

let produtos = []

async function listaProdutos() {
    try {
        const resposta = await axios.get('https://dummyjson.com/products')
        produtos = resposta.data.products
        exibirProdutos()
    }
    catch (erro) {
        console.error("Erro ao buscar produtos:", erro);
    }
}

function exibirProdutos() {
    const itens = document.getElementById("itens")
    itens.innerHTML = ""

    for (let i = 0; i < produtos.length; i++) {
        itens.innerHTML += `
        <div class = 'item'>
            <span>${produtos[i]}</span>
            <div>
                <button onclick= "editarProduto(${i})">✏️</button>
                <button onclick="excluirProduto(${i})">🗑️</button>
            </div>
                                               </div>`
    }
}

function adicionarProduto() {
    let novoProduto = document.getElementById("novoProduto")
    let texto = novoProduto.value.trim()

    if (texto == "") {
        alert("Preencha o campo!!")
    }
    else {
        produtos.push(texto)
    }
    novoProduto.value = ""

    exibirProdutos()
}

function editarProduto(index) {
    let texto = prompt(`Informe o novo nome do produto ${produtos[index]}`)
    
    texto = texto.trim()

    if (texto == "") {
        alert("Campo vazio, preencha o campo!!!")
    }
    else {
        produtos[index] = texto
    }
    exibirProdutos();
}

function excluirProduto(index) {
    produtos.splice(index, 1);
    exibirProdutos();
}

/* async function () {
    try {
        const response = await axios.get(url);
        // processar produtos 
    } catch (error) {
        console.error(error);
        // informar o usuário 
    }
} */