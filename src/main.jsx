import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ShoppingBag, Menu, X, Heart, ShieldCheck, Truck, Sparkles, UserRoundCog, Plus, Trash2, Pencil, LogOut, MessageCircle, PackageCheck, Store, Settings, Leaf, Minus, BarChart3 } from 'lucide-react';
import './styles.css';
import { addToCart, categories, clearCart, createOrder, getCart, getOrders, getProducts, getSettings, money, saveOrders, saveProducts, saveSettings, seedData, updateCartItem } from './storage';

seedData();

const ADMIN_EMAIL = 'admin@bloome.com';
const ADMIN_PASSWORD = 'bloome123';

function useStore() {
  const [products, setProducts] = useState(getProducts());
  const [cart, setCart] = useState(getCart());
  const [orders, setOrders] = useState(getOrders());
  const [settings, setSettings] = useState(getSettings());

  const refresh = () => {
    setProducts(getProducts());
    setCart(getCart());
    setOrders(getOrders());
    setSettings(getSettings());
  };

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener('bloome-cart', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('bloome-cart', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const persistProducts = (next) => { saveProducts(next); setProducts(next); };
  const persistOrders = (next) => { saveOrders(next); setOrders(next); };
  const persistSettings = (next) => { saveSettings(next); setSettings(next); };

  return { products, cart, orders, settings, refresh, persistProducts, persistOrders, persistSettings };
}

function App() {
  const store = useStore();
  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [mobileMenu, setMobileMenu] = useState(false);

  const cartCount = store.cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigate = (next, product = null) => {
    setPage(next);
    setSelectedProduct(product);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header page={page} navigate={navigate} cartCount={cartCount} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      {page === 'home' && <Home store={store} navigate={navigate} setCategory={setCategory} />}
      {page === 'shop' && <Shop store={store} navigate={navigate} query={query} setQuery={setQuery} category={category} setCategory={setCategory} />}
      {page === 'product' && <ProductDetails product={selectedProduct} store={store} navigate={navigate} />}
      {page === 'cart' && <Cart store={store} navigate={navigate} />}
      {page === 'checkout' && <Checkout store={store} navigate={navigate} />}
      {page === 'admin' && <Admin store={store} />}
      <Footer navigate={navigate} settings={store.settings} />
      <WhatsAppFloating settings={store.settings} />
    </>
  );
}

function Header({ page, navigate, cartCount, mobileMenu, setMobileMenu }) {
  const links = [
    ['home', 'Início'], ['shop', 'Produtos'], ['cart', 'Carrinho'], ['admin', 'Admin']
  ];
  return (
    <header className="topbar">
      <div className="container nav">
        <button className="brand" onClick={() => navigate('home')} aria-label="Ir para início">
          <img src="/assets/logo-light.jpg" alt="Bloomé" />
        </button>
        <nav className="desktop-nav">
          {links.map(([id, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => navigate(id)}>{label}</button>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => navigate('cart')} aria-label="Abrir carrinho">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          <button className="hamb" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </div>
      {mobileMenu && (
        <div className="mobile-menu">
          {links.map(([id, label]) => <button key={id} onClick={() => navigate(id)}>{label}</button>)}
        </div>
      )}
    </header>
  );
}

function Home({ store, navigate, setCategory }) {
  const featured = store.products.filter((p) => p.active && p.featured).slice(0, 4);
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Leaf size={16} /> Floresça sua melhor versão</span>
            <h1>Perfumes, body splash e beleza feminina com a elegância da Bloomé.</h1>
            <p>Uma loja pensada para vender de forma simples: a cliente escolhe, adiciona ao carrinho e finaliza o pedido pelo WhatsApp.</p>
            <div className="hero-actions">
              <button className="btn primary" onClick={() => navigate('shop')}>Ver produtos</button>
              <button className="btn ghost" onClick={() => navigate('admin')}>Painel da loja</button>
            </div>
          </div>
          <div className="hero-card">
            <img src="/assets/logo-dark.jpg" alt="Identidade visual Bloomé" />
            <div className="hero-mini-card">
              <Sparkles size={20} />
              <strong>Catálogo elegante</strong>
              <span>Visual inspirado em lojas de beleza modernas.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-title">
          <span>Escolha por categoria</span>
          <h2>Produtos para presentear, cuidar e perfumar</h2>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <button key={cat} className="category-card" onClick={() => { setCategory(cat); navigate('shop'); }}>
              <span>{cat}</span>
              <small>Ver seleção</small>
            </button>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-title split">
          <div>
            <span>Vitrine</span>
            <h2>Destaques da Bloomé</h2>
          </div>
          <button className="link-btn" onClick={() => navigate('shop')}>Ver catálogo completo</button>
        </div>
        <div className="product-grid">
          {featured.map((product) => <ProductCard key={product.id} product={product} navigate={navigate} />)}
        </div>
      </section>

      <section className="brand-strip">
        <div className="container benefits">
          <div><Truck /><strong>Entrega combinada</strong><span>Pedido segue direto para o WhatsApp.</span></div>
          <div><ShieldCheck /><strong>Compra simples</strong><span>Sem servidor e fácil de hospedar.</span></div>
          <div><Heart /><strong>Marca elegante</strong><span>Cores e logos da identidade Bloomé.</span></div>
        </div>
      </section>
    </main>
  );
}

function Shop({ store, navigate, query, setQuery, category, setCategory }) {
  const products = useMemo(() => {
    return store.products.filter((p) => {
      const matchesActive = p.active;
      const matchesCategory = category === 'Todos' || p.category === category;
      const text = `${p.name} ${p.description} ${p.category}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      return matchesActive && matchesCategory && matchesQuery;
    });
  }, [store.products, query, category]);

  return (
    <main className="container page">
      <div className="page-heading">
        <span>Marketplace Bloomé</span>
        <h1>Catálogo de produtos</h1>
        <p>Busque por perfume, body splash, hidratante, skincare, maquiagem ou kits.</p>
      </div>
      <div className="filters">
        <label className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produtos..." /></label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Todos</option>
          {categories.map((cat) => <option key={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="product-grid shop-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} navigate={navigate} />)}
      </div>
      {products.length === 0 && <Empty title="Nenhum produto encontrado" text="Tente outra busca ou categoria." />}
    </main>
  );
}

function ProductCard({ product, navigate }) {
  return (
    <article className="product-card">
      <button className="product-image" onClick={() => navigate('product', product)}>
        <img src={product.image} alt={product.name} />
        {product.oldPrice > product.price && <span className="sale">Oferta</span>}
      </button>
      <div className="product-info">
        <span className="product-cat">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          {product.oldPrice > 0 && <del>{money(product.oldPrice)}</del>}
        </div>
        <div className="card-actions">
          <button className="btn small primary" onClick={() => addToCart(product.id)}>Adicionar</button>
          <button className="btn small ghost" onClick={() => navigate('product', product)}>Detalhes</button>
        </div>
      </div>
    </article>
  );
}

function ProductDetails({ product, store, navigate }) {
  const item = product || store.products.find((p) => p.active);
  if (!item) return <Empty title="Produto não encontrado" text="Volte para o catálogo." />;
  return (
    <main className="container page product-detail">
      <div className="detail-image"><img src={item.image} alt={item.name} /></div>
      <div className="detail-copy">
        <span className="product-cat">{item.category}</span>
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <div className="detail-meta">
          <span><strong>Notas:</strong> {item.notes}</span>
          <span><strong>Volume:</strong> {item.volume}</span>
          <span><strong>Estoque:</strong> {item.stock} un.</span>
        </div>
        <div className="price-row big"><strong>{money(item.price)}</strong>{item.oldPrice > 0 && <del>{money(item.oldPrice)}</del>}</div>
        <div className="hero-actions">
          <button className="btn primary" onClick={() => addToCart(item.id)}>Adicionar ao carrinho</button>
          <button className="btn ghost" onClick={() => navigate('shop')}>Continuar comprando</button>
        </div>
      </div>
    </main>
  );
}

function Cart({ store, navigate }) {
  const items = store.cart.map((item) => ({ ...item, product: store.products.find((p) => p.id === item.productId) })).filter((item) => item.product);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return (
    <main className="container page">
      <div className="page-heading"><span>Carrinho</span><h1>Seu pedido Bloomé</h1></div>
      {items.length === 0 ? <Empty title="Seu carrinho está vazio" text="Adicione produtos para finalizar seu pedido." action={<button className="btn primary" onClick={() => navigate('shop')}>Ver produtos</button>} /> : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map(({ product, quantity }) => (
              <div className="cart-item" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div><strong>{product.name}</strong><span>{money(product.price)}</span></div>
                <div className="qty">
                  <button onClick={() => updateCartItem(product.id, quantity - 1)}><Minus size={15} /></button>
                  <span>{quantity}</span>
                  <button onClick={() => updateCartItem(product.id, quantity + 1)}><Plus size={15} /></button>
                </div>
                <button className="danger-icon" onClick={() => updateCartItem(product.id, 0)}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          <aside className="summary-card">
            <h3>Resumo</h3>
            <div className="summary-line"><span>Subtotal</span><strong>{money(total)}</strong></div>
            <div className="summary-line"><span>Entrega</span><strong>A combinar</strong></div>
            <button className="btn primary full" onClick={() => navigate('checkout')}>Finalizar pedido</button>
            <button className="btn ghost full" onClick={clearCart}>Limpar carrinho</button>
          </aside>
        </div>
      )}
    </main>
  );
}

function Checkout({ store, navigate }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', payment: 'Pix', notes: '' });
  const items = store.cart.map((item) => ({ ...item, product: store.products.find((p) => p.id === item.productId) })).filter((item) => item.product);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const disabled = items.length === 0 || !form.name || !form.phone;

  const submit = (e) => {
    e.preventDefault();
    const order = createOrder({ name: form.name, phone: form.phone, address: form.address, city: form.city }, form.payment, form.notes);
    const productsText = order.items.map((item) => `• ${item.quantity}x ${item.name} - ${money(item.price * item.quantity)}`).join('%0A');
    const msg = `Olá, Bloomé! Quero finalizar meu pedido:%0A%0A${productsText}%0A%0ATotal: ${money(order.total)}%0A%0ANome: ${form.name}%0ATelefone: ${form.phone}%0AEndereço: ${form.address}%0ACidade: ${form.city}%0APagamento: ${form.payment}%0AObservações: ${form.notes || 'Nenhuma'}%0A%0ANúmero do pedido: ${order.id}`;
    window.open(`https://wa.me/${store.settings.whatsapp}?text=${msg}`, '_blank');
    alert('Pedido criado! Agora é só confirmar pelo WhatsApp da Bloomé.');
    navigate('home');
  };

  return (
    <main className="container page">
      <div className="page-heading"><span>Checkout</span><h1>Finalize pelo WhatsApp</h1><p>O pedido fica salvo no painel administrativo e uma mensagem é aberta no WhatsApp da loja.</p></div>
      {items.length === 0 ? <Empty title="Carrinho vazio" text="Adicione produtos antes de finalizar." /> : (
        <form className="checkout-layout" onSubmit={submit}>
          <div className="form-card">
            <h3>Dados da cliente</h3>
            <input required placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required placeholder="WhatsApp da cliente" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Endereço de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input placeholder="Cidade/Bairro" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}>
              <option>Pix</option><option>Cartão na entrega</option><option>Dinheiro</option>
            </select>
            <textarea placeholder="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <aside className="summary-card">
            <h3>Resumo do pedido</h3>
            {items.map(({ product, quantity }) => <div className="summary-line" key={product.id}><span>{quantity}x {product.name}</span><strong>{money(product.price * quantity)}</strong></div>)}
            <div className="summary-line total"><span>Total</span><strong>{money(total)}</strong></div>
            <button className="btn primary full" disabled={disabled}>Enviar para WhatsApp</button>
          </aside>
        </form>
      )}
    </main>
  );
}

function Admin({ store }) {
  const [logged, setLogged] = useState(localStorage.getItem('bloome_admin_session_v1') === 'true');
  const [tab, setTab] = useState('dashboard');
  if (!logged) return <AdminLogin setLogged={setLogged} />;
  return (
    <main className="container page admin-page">
      <div className="admin-head">
        <div><span>Painel Bloomé</span><h1>Administração da loja</h1></div>
        <button className="btn ghost" onClick={() => { localStorage.removeItem('bloome_admin_session_v1'); setLogged(false); }}><LogOut size={18} /> Sair</button>
      </div>
      <div className="admin-tabs">
        <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}><BarChart3 size={17} />Resumo</button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><Store size={17} />Produtos</button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><PackageCheck size={17} />Pedidos</button>
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}><Settings size={17} />Configurações</button>
      </div>
      {tab === 'dashboard' && <Dashboard store={store} />}
      {tab === 'products' && <AdminProducts store={store} />}
      {tab === 'orders' && <AdminOrders store={store} />}
      {tab === 'settings' && <AdminSettings store={store} />}
    </main>
  );
}

function AdminLogin({ setLogged }) {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('bloome123');
  const login = (e) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('bloome_admin_session_v1', 'true');
      setLogged(true);
    } else alert('Login inválido. Use admin@bloome.com / bloome123');
  };
  return (
    <main className="container page login-wrap">
      <form className="login-card" onSubmit={login}>
        <img src="/assets/logo-light.jpg" alt="Bloomé" />
        <h1>Painel administrativo</h1>
        <p>Gerencie produtos, pedidos e dados da loja.</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" />
        <button className="btn primary full"><UserRoundCog size={18} /> Entrar</button>
        <small>Acesso de demonstração: admin@bloome.com / bloome123</small>
      </form>
    </main>
  );
}

function Dashboard({ store }) {
  const revenue = store.orders.reduce((sum, order) => sum + order.total, 0);
  return <div className="metric-grid">
    <Metric title="Produtos cadastrados" value={store.products.length} icon={<Store />} />
    <Metric title="Pedidos recebidos" value={store.orders.length} icon={<PackageCheck />} />
    <Metric title="Faturamento simulado" value={money(revenue)} icon={<BarChart3 />} />
  </div>;
}

function Metric({ title, value, icon }) { return <div className="metric-card">{icon}<span>{title}</span><strong>{value}</strong></div>; }

function AdminProducts({ store }) {
  const emptyProduct = { name: '', category: 'Perfumes', price: '', oldPrice: '', stock: '', featured: false, active: true, image: '', description: '', notes: '', volume: '' };
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const edit = (product) => { setEditing(product.id); setForm(product); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const reset = () => { setEditing(null); setForm(emptyProduct); };
  const save = (e) => {
    e.preventDefault();
    const product = { ...form, id: editing || `p${Date.now()}`, price: Number(form.price), oldPrice: Number(form.oldPrice || 0), stock: Number(form.stock || 0) };
    const next = editing ? store.products.map((p) => p.id === editing ? product : p) : [product, ...store.products];
    store.persistProducts(next); reset();
  };
  const remove = (id) => { if (confirm('Remover este produto?')) store.persistProducts(store.products.filter((p) => p.id !== id)); };
  return <div className="admin-grid">
    <form className="form-card" onSubmit={save}>
      <h3>{editing ? 'Editar produto' : 'Novo produto'}</h3>
      <input required placeholder="Nome do produto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((cat) => <option key={cat}>{cat}</option>)}</select>
      <div className="two-cols"><input required type="number" step="0.01" placeholder="Preço" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /><input type="number" step="0.01" placeholder="Preço antigo" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} /></div>
      <div className="two-cols"><input type="number" placeholder="Estoque" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /><input placeholder="Volume" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} /></div>
      <input required placeholder="URL da imagem do produto" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
      <textarea required placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Notas / características" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <label className="check"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Destaque na vitrine</label>
      <label className="check"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Produto ativo</label>
      <div className="two-cols"><button className="btn primary">Salvar</button><button type="button" className="btn ghost" onClick={reset}>Cancelar</button></div>
    </form>
    <div className="admin-list">
      {store.products.map((p) => <div className="admin-row" key={p.id}><img src={p.image} alt={p.name} /><div><strong>{p.name}</strong><span>{p.category} • {money(p.price)} • estoque {p.stock}</span></div><button onClick={() => edit(p)}><Pencil size={17} /></button><button onClick={() => remove(p.id)}><Trash2 size={17} /></button></div>)}
    </div>
  </div>;
}

function AdminOrders({ store }) {
  const updateStatus = (id, status) => store.persistOrders(store.orders.map((order) => order.id === id ? { ...order, status } : order));
  return <div className="orders-list">
    {store.orders.length === 0 && <Empty title="Nenhum pedido ainda" text="Os pedidos finalizados aparecerão aqui." />}
    {store.orders.map((order) => <div className="order-card" key={order.id}>
      <div className="order-head"><div><strong>{order.id}</strong><span>{new Date(order.createdAt).toLocaleString('pt-BR')}</span></div><select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}><option>Novo pedido</option><option>Em separação</option><option>Entregue</option><option>Cancelado</option></select></div>
      <p><strong>Cliente:</strong> {order.customer.name} • {order.customer.phone}</p>
      <p><strong>Endereço:</strong> {order.customer.address || 'A combinar'} - {order.customer.city}</p>
      {order.items.map((item) => <div className="summary-line" key={item.productId}><span>{item.quantity}x {item.name}</span><strong>{money(item.price * item.quantity)}</strong></div>)}
      <div className="summary-line total"><span>Total</span><strong>{money(order.total)}</strong></div>
    </div>)}
  </div>;
}

function AdminSettings({ store }) {
  const [form, setForm] = useState(store.settings);
  const save = (e) => { e.preventDefault(); store.persistSettings(form); alert('Configurações salvas.'); };
  return <form className="form-card settings-form" onSubmit={save}>
    <h3>Configurações da loja</h3>
    <input placeholder="Nome da loja" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
    <input placeholder="WhatsApp com DDI e DDD" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
    <input placeholder="Chave Pix" value={form.pixKey} onChange={(e) => setForm({ ...form, pixKey: e.target.value })} />
    <input placeholder="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
    <textarea placeholder="Texto de entrega" value={form.deliveryText} onChange={(e) => setForm({ ...form, deliveryText: e.target.value })} />
    <button className="btn primary">Salvar configurações</button>
  </form>;
}

function Empty({ title, text, action }) { return <div className="empty"><img src="/assets/leaf-dark.jpg" alt="Bloomé" /><h2>{title}</h2><p>{text}</p>{action}</div>; }

function Footer({ navigate, settings }) {
  return <footer className="footer"><div className="container footer-grid"><div><img src="/assets/logo-light.jpg" alt="Bloomé" /><p>Perfumes, body splash e cuidado feminino para florescer sua melhor versão.</p></div><div><strong>Loja</strong><button onClick={() => navigate('shop')}>Produtos</button><button onClick={() => navigate('cart')}>Carrinho</button><button onClick={() => navigate('admin')}>Admin</button></div><div><strong>Contato</strong><span>WhatsApp: {settings.whatsapp}</span><span>Instagram: {settings.instagram}</span><span>{settings.deliveryText}</span></div></div></footer>;
}

function WhatsAppFloating({ settings }) { return <a className="whatsapp" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={24} /></a>; }

createRoot(document.getElementById('root')).render(<App />);
