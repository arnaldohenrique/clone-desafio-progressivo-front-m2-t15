const cart = document.querySelector(".link__quantity");
const carrinho = document.querySelector(".carrinho");
const fechar = document.querySelector(".fechar");
let urlCarrinho = "http://localhost:3000/carrinho";

async function getCarrinho(url) {
  const response = await axios.get(url);
  return response.data;
}

function criarProdutoNoCarrinho({
  id,
  idProduto,
  nome,
  imagem,
  preco,
  vegano,
  quantidade,
}) {
  if (vegano) {
    return `
    <div class="carrinho__main__item--produto">
      <img src="${imagem}" alt="${idProduto}">
      <div style="width: 100%; padding-left: 8px;">
        <div class="carrinho__main__item--descricao">
          <div class="carrinho__main__item--nome">
            <p>${nome}</p>
            <div class="carrinho__main__item--vegano flex">
              <img src="image/Plant.svg" alt="planta">
              <p>Vegano</p>
            </div>
          </div>
          <img src="image/Trash.svg" class="lixeira" id="${id}" alt="lata de lixo">
        </div>
        <div class="carrinho__main__item--preco flex" style="padding-top: 16px;">
          <div class="carrinho__main__item--preco">
            <p>R$</p>
            <p>${(preco.por / 100).toFixed(2)}</p>
          </div>
          <div class="carrinho__main__item--quantidade flex">
            <img src="image/Minus.svg" class="minus" id="${id}" alt="menos">
            <input type="text" readonly minlength="1" maxlength="2" class="quantidade" value="${quantidade}">
            <img src="image/Plus.svg" class="plus" id="${id}" alt="mais">
          </div>
        </div>
      </div>
    </div>
    `;
  } else {
    return `
    <div class="carrinho__main__item--produto">
      <img src="${imagem}" alt="${idProduto}">
      <div style="width: 100%; padding-left: 8px;">
        <div class="carrinho__main__item--descricao">
          <div class="carrinho__main__item--nome">
            <p>${nome}</p>
            <div class="carrinho__main__item--vegano flex">
              <img src="image/Cow.svg" alt="vaca">
              <p>Contém lactose</p>
            </div>
          </div>
          <img src="image/Trash.svg" class="lixeira" id="${id}" alt="lata de lixo">
        </div>
        <div class="carrinho__main__item--preco flex" style="padding-top: 16px;">
          <div class="carrinho__main__item--preco">
            <p>R$</p>
            <p>${(preco.por / 100).toFixed(2)}</p>
          </div>
          <div class="carrinho__main__item--quantidade flex">
            <img src="image/Minus.svg" class="minus" id="${id}" alt="menos">
            <input type="text" readonly minlength="1" maxlength="2" class="quantidade" value="${quantidade}">
            <img src="image/Plus.svg" class="plus" id="${id}" alt="mais">
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

async function insertProducts() {
  const ListagemDoCarrinho = await getCarrinho(urlCarrinho);
  let carrinhoHTML = "";
  const carrinhoElemento = document.querySelector(".carrinho__main__item");

  ListagemDoCarrinho.forEach((product) => {
    carrinhoHTML += criarProdutoNoCarrinho(product);
  });

  carrinhoElemento.innerHTML = carrinhoHTML;

  const minus = document.querySelectorAll(".minus");
  const plus = document.querySelectorAll(".plus");
  const lixeira = document.querySelectorAll(".lixeira");
  const lixeiraAll = document.querySelector(".carrinho__main__quantidade--excluir")
  const quantidadeItens = document.querySelector(".carrinho__main__quantidade--item")
  let subtotal = document.querySelector(".carrinho__main__valor--subtotal--total");
  let total = document.querySelector(".carrinho__main__valor--total--total");

  async function somaTudo() {
    const somando = await getCarrinho(urlCarrinho)
    let somandoSubtotal = 0
    somando.forEach(element => {
      somandoSubtotal += element.preco.por * element.quantidade
    });
    totalTotal = (somandoSubtotal / 100).toFixed(2)
    subtotal.innerHTML = `R$${totalTotal}`
    total.innerHTML = `R$${totalTotal}`
  }
  somaTudo()

  async function itens() {
    let oneItem = 1
    let quantidadeItensNoCarrinho = await getCarrinho(urlCarrinho)

    quantidadeItensNoCarrinho = quantidadeItensNoCarrinho.length

    if(quantidadeItensNoCarrinho == oneItem){
      quantidadeItens.innerHTML = `${quantidadeItensNoCarrinho} Item`
    }else {
      quantidadeItens.innerHTML = `${quantidadeItensNoCarrinho} Itens`
    }
  }
  itens()

  lixeiraAll.onclick = async function() {

    const excluirProduto = await getCarrinho(urlCarrinho);

    if(excluirProduto){
      excluirProduto.forEach(element => {
        axios.delete(`${urlCarrinho}/${element.id}`)
      });    
    }
  }


  lixeira.forEach((e) => {
    e.onclick = async function(event) {
      let NovaUrl = `${urlCarrinho}/${event.target.id}`;

      const excluirProduto = await getCarrinho(NovaUrl);

      if(excluirProduto){
        axios.delete(NovaUrl)
      }
    }
  })

  minus.forEach((e) => {
    e.onclick = async function(event) {
      if (event.target.nextElementSibling.value > 1) {
        event.target.nextElementSibling.value--;

        let NovaUrl = `${urlCarrinho}/${event.target.id}`;

        const produtoQuantidadeModificado = await getCarrinho(NovaUrl);
        const {id, idProduto, nome, imagem, preco, vegano, observacao} = produtoQuantidadeModificado
        if(produtoQuantidadeModificado){
          axios.put(NovaUrl, {
          "id": id,
          "idProduto": idProduto,
          "nome": nome,
          "imagem": imagem,
          "preco": preco,
          "vegano": vegano,
          "quantidade": Number(event.target.nextElementSibling.value),
          "observacao": observacao
          })
        }
      }
    };
  });

  plus.forEach((e) => {
    e.onclick = async function(event) {
      if (event.target.previousElementSibling.value < 99) {
        event.target.previousElementSibling.value++;

        let NovaUrl = `${urlCarrinho}/${event.target.id}`;

        const produtoQuantidadeModificado = await getCarrinho(NovaUrl);
        const {id, idProduto, nome, imagem, preco, vegano, observacao} = produtoQuantidadeModificado
        if(produtoQuantidadeModificado){
          axios.put(NovaUrl, {
          "id": id,
          "idProduto": idProduto,
          "nome": nome,
          "imagem": imagem,
          "preco": preco,
          "vegano": vegano,
          "quantidade": Number(event.target.previousElementSibling.value),
          "observacao": observacao
          })
        }
      }
    };
  });
}

cart.onclick = function () {
  carrinho.style.display = "flex";
  insertProducts();
};

fechar.onclick = function () {
  carrinho.style.display = "none";
};
