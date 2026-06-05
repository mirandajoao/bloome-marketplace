export const STORAGE_KEYS = {
  products: 'bloome_products_v1',
  orders: 'bloome_orders_v1',
  cart: 'bloome_cart_v1',
  admin: 'bloome_admin_session_v1',
  settings: 'bloome_settings_v1'
};

export const categories = ['Perfumes', 'Body Splash', 'Hidratantes', 'Skincare', 'Maquiagem', 'Kits Presente'];

export const defaultProducts = [
  {
    id: 'p001',
    name: 'Perfume Bloomé Essência Floral',
    category: 'Perfumes',
    price: 129.9,
    oldPrice: 159.9,
    stock: 12,
    featured: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
    description: 'Fragrância feminina elegante com notas florais, toque adocicado e acabamento sofisticado.',
    notes: 'Jasmim, baunilha suave e musk branco',
    volume: '100 ml'
  },
  {
    id: 'p002',
    name: 'Body Splash Flor de Baunilha',
    category: 'Body Splash',
    price: 49.9,
    oldPrice: 64.9,
    stock: 20,
    featured: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80',
    description: 'Body splash leve para o dia a dia, perfeito para reaplicar e manter uma sensação de frescor.',
    notes: 'Baunilha, flores brancas e toque ambarado',
    volume: '200 ml'
  },
  {
    id: 'p003',
    name: 'Hidratante Corporal Algodão Doce',
    category: 'Hidratantes',
    price: 39.9,
    oldPrice: 49.9,
    stock: 18,
    featured: false,
    active: true,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=80',
    description: 'Hidratação com textura confortável, fragrância delicada e toque macio na pele.',
    notes: 'Algodão, creme doce e floral limpo',
    volume: '250 ml'
  },
  {
    id: 'p004',
    name: 'Kit Bloomé Presente Especial',
    category: 'Kits Presente',
    price: 179.9,
    oldPrice: 219.9,
    stock: 8,
    featured: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80',
    description: 'Kit com perfume, body splash e embalagem presenteável para surpreender com elegância.',
    notes: 'Seleção sortida Bloomé',
    volume: 'Kit com 3 itens'
  },
  {
    id: 'p005',
    name: 'Sérum Facial Glow',
    category: 'Skincare',
    price: 69.9,
    oldPrice: 0,
    stock: 15,
    featured: false,
    active: true,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
    description: 'Sérum facial para rotina de cuidado diário, com acabamento leve e sensação de pele iluminada.',
    notes: 'Textura leve e rápida absorção',
    volume: '30 ml'
  },
  {
    id: 'p006',
    name: 'Gloss Labial Nude Bloom',
    category: 'Maquiagem',
    price: 29.9,
    oldPrice: 39.9,
    stock: 30,
    featured: false,
    active: true,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
    description: 'Gloss com brilho delicado e tom versátil para compor uma make natural e elegante.',
    notes: 'Nude rosado',
    volume: '8 ml'
  }
];

export const defaultSettings = {
  whatsapp: '5591999999999',
  pixKey: 'chavepix@bloome.com',
  storeName: 'Bloomé',
  deliveryText: 'Entrega local combinada pelo WhatsApp',
  instagram: '@bloome'
};

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export function seedData() {
  if (!localStorage.getItem(STORAGE_KEYS.products)) write(STORAGE_KEYS.products, defaultProducts);
  if (!localStorage.getItem(STORAGE_KEYS.orders)) write(STORAGE_KEYS.orders, []);
  if (!localStorage.getItem(STORAGE_KEYS.cart)) write(STORAGE_KEYS.cart, []);
  if (!localStorage.getItem(STORAGE_KEYS.settings)) write(STORAGE_KEYS.settings, defaultSettings);
}

export const getProducts = () => read(STORAGE_KEYS.products, defaultProducts);
export const saveProducts = (products) => write(STORAGE_KEYS.products, products);
export const getOrders = () => read(STORAGE_KEYS.orders, []);
export const saveOrders = (orders) => write(STORAGE_KEYS.orders, orders);
export const getCart = () => read(STORAGE_KEYS.cart, []);
export const saveCart = (cart) => write(STORAGE_KEYS.cart, cart);
export const getSettings = () => read(STORAGE_KEYS.settings, defaultSettings);
export const saveSettings = (settings) => write(STORAGE_KEYS.settings, settings);

export const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));

export function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity });
  saveCart(cart);
  window.dispatchEvent(new Event('bloome-cart'));
}

export function updateCartItem(productId, quantity) {
  const next = getCart().map((item) => item.productId === productId ? { ...item, quantity } : item).filter((item) => item.quantity > 0);
  saveCart(next);
  window.dispatchEvent(new Event('bloome-cart'));
}

export function clearCart() {
  saveCart([]);
  window.dispatchEvent(new Event('bloome-cart'));
}

export function createOrder(customer, payment, notes) {
  const products = getProducts();
  const cart = getCart();
  const items = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, name: product?.name, price: product?.price, image: product?.image };
  });
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  const order = {
    id: `BLO-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Novo pedido',
    customer,
    payment,
    notes,
    items,
    total
  };
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  clearCart();
  return order;
}
