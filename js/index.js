const usuario = prompt("Qual o seu nome?");

const bemVindo = document.getElementById("bemVindo")
bemVindo.innerHTML = `Seja bem-vindo(a), ${usuario}!`





for (let i = 0; i < produtos.length; i++) {
    produtos.innerHTML += `<div class = 'item'>
                                            <span>${produtos[i]}</span>
                                            <div>
                                                <button onclick= "editarItem(${i})">✏️</button>
                                               <button onclick="excluirItem(${i})">🗑️</button>
                                               </div>`
}

function adicionarProduto(){
    let novoProduto = document.getElementById("novoProduto")

    let texto = novoProduto.value.trim()

    if(texto == "") {
        alert("Preencha o campo!!")
    }
    else{
        produtos.push(texto)


    }

    novoProduto.value = ""
}

function excluirProduto(index){

}

function editarProduto(index){
    let texto = prompt(`Informe o novo nome do produto ${produtos[index]}`)
    texto = texto.trim()

    if(texto == ""){
        alert("Campo vazio, preencha o campo!!!")
    }
    else{
        produtos[index] = texto
    }
}
