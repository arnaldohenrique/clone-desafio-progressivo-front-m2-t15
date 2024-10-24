const url = "http://localhost:3000/produtos";

async function products() {
  const response = await axios.get(url);

  return response.data;
}

function createProducts({ id, nome, imagem, preco, vegano }) {
  if (vegano) {
    return `
    <a href="./product.html?id=${id}" class="products__list--item">
      <img src="${imagem}" alt="">
      <h3 class="products__list--price">R$ ${(preco.por / 100).toFixed(
        2
      )} <span>R$ ${(preco.de / 100).toFixed(2)}</span></h3>
      <h4 class="products__list--name">${nome}</h4>
      <div class="product__tag">
          <img src="./image/Plant.png" alt="vegano">
          <span>Vegano</span>
      </div>
    </a>`;
  } else {
    return `
    <a href="./product.html?id=${id}" class="products__list--item">
      <img src="${imagem}" alt="">
      <h3 class="products__list--price">R$ ${(preco.por / 100).toFixed(
        2
      )} <span>R$ ${(preco.de / 100).toFixed(2)}</span></h3>
      <h4 class="products__list--name">${nome}</h4>
      <div class="product__tag">
          <img src="./image/Cow.png" alt="lactose">
          <span>Contém lactose</span>
      </div>
    </a>`;
  }
}

async function insertProducts() {
  const productsList = await products();
  let productClassicoHTML = "";
  let productGeladoHTML = "";
  const productsElement = document.querySelectorAll(".products__list");

  productsList.forEach((product) => {
    if (product.categoria == "classicos") {
      productClassicoHTML += createProducts(product);
    }
    if (product.categoria == "gelados") {
      productGeladoHTML += createProducts(product);
    }
  });

    productsElement[0].innerHTML = productClassicoHTML;
    productsElement[1].innerHTML = productGeladoHTML;
};

insertProducts();