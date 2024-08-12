class Product {
  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createRootElement(tag, cssClass, attribute) {
    const rootEl = document.createElement(tag);
    if (cssClass) {
      rootEl.className = cssClass;
    }
    if (attribute && attribute.length > 0) {
      for (const attr of attribute) {
        rootEl.setAttribute(attr.name, attr.value);
      }
    }
    console.log(rootEl);
    const hookEl = document.getElementById(this.hookId);
    if (hookEl) {
      hookEl.append(rootEl);
    } else {
      console.error(`Element with ID "${this.hookId}" not found.`);
    }
    return rootEl;
  }
}

class ProductList extends Component {
  constructor(renderHookId) {
    super(renderHookId);
    this.#fetchProducts();
  }

  #fetchProducts() {
    this.products = [
      new Product(
        "A Pillow",
        "https://www.betterlivingaustralia.com.au/cdn/shop/products/Spare_Parts_-_Website_images_-_Untitled_Page_263f5a9b-9ec7-4854-b801-757e6a8b14ad.jpeg?v=1565828557",
        "A Soft Pillow",
        19.99
      ),
      new Product(
        "A Carpet",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ardabil_Carpet.jpg/397px-Ardabil_Carpet.jpg",
        "A carpet which you might like - or not.",
        89.99
      ),
    ];
    this.renderProducts();
  }
  renderProducts() {
    for (const prod of this.products) {
      const productItem = new ProductItem(prod, "prod-list");
    }
  }
  render() {
    const prodList = this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-list"),
    ]);
    if (this.products && this.product.length > 0) {
      this.renderProducts();
    }
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "product-item");
    prodEl.innerHTML = `
      <div>
        <img src="${this.product.imageUrl}" alt="${this.product.title}" >
        <div class="product-item__content">
          <h2>${this.product.title}</h2>
          <h3>\$${this.product.price}</h3>
          <p>${this.product.description}</p>
          <button>Add to Cart</button>
        </div>
      </div>
    `;
    const addCartButton = prodEl.querySelector("button");
    addCartButton.addEventListener("click", this.addToCart.bind(this));
  }
}

class ShoppingCart extends Component {
  items = [];

  constructor(renderHookId) {
    super(renderHookId);
  }

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce((preValue, curItem) => {
      return preValue + curItem.price;
    }, 0);
    return sum;
  }

  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  orderProduct() {
    console.log(this.items);
  }

  render() {
    const cartEl = this.createRootElement("section", "cart");
    cartEl.innerHTML = `
      <h2>Total: \$${0}</h2>
      <button>Order Now</button>
    `;
    const orderButton = cartEl.querySelector("button");
    orderButton.addEventListener("click", this.orderProduct.bind(this));
    this.totalOutput = cartEl.querySelector("h2");
  }
}

class Shop extends Component {
  constructor() {
    super();
  }
  render() {
    this.cart = new ShoppingCart("app");
    new ProductList("app");
  }
}

class App {
  static cartForApp;

  static init() {
    const shop = new Shop();
    this.cartForApp = shop.cart;
  }

  static addProductToCart(product) {
    this.cartForApp.addProduct(product);
  }
}

App.init();
