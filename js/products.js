const params = new URLSearchParams(window.location.search);
const idProduto = params.get('id');
const url = 'http://localhost:3000/produtos/'
let observation = null
let botao = null
let botaoPlus = null
let botaoMinus = null
let botaoValue = null
let observacao = ''

async function produto()  {
    const response = await axios.get(`${url}${idProduto}`);
    return response.data;
}

function criarProduto({ id, nome, imagem, descricao, preco, vegano }) {

  if (vegano) {
      return `
      <div class="product__container--image">
        <img src="${imagem}" class="product__image" alt="produto ${id}">
      </div>
      <div class="product__data">
        <h1 class="product__title">${nome}</h1>
        <h2 class="product__price">R$ ${(preco.por / 100).toFixed(2)}</h2>
        <div class="product__tag">
          <img src="./image/Plant.png" alt="planta">
          <span>Vegano</span>
        </div>
        <p class="product__description">${descricao}</p>
        <form>
          <section class="product__observation">
            <label for="observation">Observações sobre o pedido</label>
            <textarea rows="3" name="observation" id="observation"
              placeholder="Digite suas observações. Ex.: Enviar açúcar"></textarea>
          </section>
          <div class="product__buy">
            <section class="product__quantity">
              <button class="product__quantity--minus">
                <img src="./image/Minus.svg" alt="mais um">
              </button>
              <input type="text" readonly minlength="1" maxlength="2" class="product__quantity--input" value="1">
              <button class="product__quantity--plus">
                <img src="./image/Plus.svg" alt="menos um">
              </button>
            </section>
            <button type="button" class="product__button">
              Comprar
            </button>
          </div>
        </form>
      </div>
      `
  } else {
      return `
      <div class="product__container--image">
        <img src="${imagem}" class="product__image" alt="produto ${id}">
      </div>
      <div class="product__data">
        <h1 class="product__title">${nome}</h1>
        <h2 class="product__price">R$ ${(preco.por / 100).toFixed(2)}</h2>
        <div class="product__tag">
          <img src="./image/Cow.png" alt="Cow">
          <span>Contém lactose</span>
        </div>
        <p class="product__description">${descricao}</p>
        <form>
          <section class="product__observation">
            <label for="observation">Observações sobre o pedido</label>
            <textarea rows="3" name="observation" id="observation"
              placeholder="Digite suas observações. Ex.: Enviar açúcar"></textarea>
          </section>
          <div class="product__buy">
            <section class="product__quantity">
              <button class="product__quantity--minus">
                <img src="./image/Minus.svg" alt="mais um">
              </button>
              <input type="text" readonly minlength="1" maxlength="2" class="product__quantity--input" value="1">
              <button class="product__quantity--plus">
                <img src="./image/Plus.svg" alt="menos um">
              </button>
            </section>
            <button type="button" class="product__button">
              Comprar
            </button>
          </div>
        </form>
      </div>
      `
  }
}

async function inserirProduto(){
  const produtoCafe = await produto();
  const produtoHTML = criarProduto(produtoCafe)
  const produtoElemento = document.querySelector('.product');
  
  produtoElemento.innerHTML = produtoHTML;

  botaoPlus = document.querySelector('.product__quantity--plus')
  botaoMinus = document.querySelector('.product__quantity--minus')
  botaoValue = document.querySelector('.product__quantity--input')

  botaoPlus.onclick = function(event){
    event.preventDefault()
    if(botaoValue.value < 99){
      botaoValue.value++
    }
  }

  botaoMinus.onclick = function(event){
    event.preventDefault()
    if(botaoValue.value > 1){
      botaoValue.value--
    }
  }

  observation = document.querySelector('#observation')
  botao = document.querySelector('.product__button')

  observation.onkeyup = function(event){
    observacao = event.target.value
  }

  botao.onclick = async function(){
    try {
      const response = await axios.get('http://localhost:3000/carrinho')
      
      let produto = response.data.find((produto) => produto.idProduto == produtoCafe.id)
      
      if(produto){
        axios.put(`http://localhost:3000/carrinho/${produto.id}`, {
        "id": produtoCafe.id,
        "idProduto": produtoCafe.id,
        "nome": produtoCafe.nome,
        "imagem": produtoCafe.imagem,
        "preco": produtoCafe.preco,
        "vegano": produtoCafe.vegano,
        "quantidade": Number(produto.quantidade) + Number(botaoValue.value),
        "observacao": observacao
        })
      }else{
        axios.post(`http://localhost:3000/carrinho`, {
          "idProduto": produtoCafe.id,
          "nome": produtoCafe.nome,
          "imagem": produtoCafe.imagem,
          "preco": produtoCafe.preco,
          "vegano": produtoCafe.vegano,
          "quantidade": Number(botaoValue.value),
          "observacao": observacao
        })
      }     
    } catch (error) {
      console.log(error)
    }
  }
}

inserirProduto()