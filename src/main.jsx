import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ShoppingBag, Search, X, Plus, Minus, Menu, Truck, ShieldCheck, RefreshCw, Check, SlidersHorizontal } from 'lucide-react';
import './styles.css';
import './ticker.css';
import BrandTicker from './BrandTicker';

const money = n => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
const photo = (id, width = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const products = [
  { id: 1, name: 'Polera Essential', subtitle: 'Oversize · Blanco', category: 'Poleras', price: 24990, image: photo('photo-1521572163474-6864f9cf17ab'), tag: 'BEST SELLER', color: '#f0efeb', sizes: ['S', 'M', 'L', 'XL'], colors: ['#e7e5dc', '#262626', '#82836c'] },
  { id: 2, name: 'Hoodie de la Calle', subtitle: 'Heavyweight · Negro', category: 'Polerones', price: 44990, image: photo('photo-1556821840-3a63f95609a7'), tag: 'NUEVO', color: '#e9e8e3', sizes: ['S', 'M', 'L', 'XL'], colors: ['#343434', '#b1ad9b'] },
  { id: 3, name: 'Cargo Territorio', subtitle: 'Relaxed fit · Arena', category: 'Pantalones', price: 39990, image: photo('photo-1473966968600-fa801b869a1a'), tag: '', color: '#e5e4df', sizes: ['38', '40', '42', '44'], colors: ['#b3aa93', '#33352e', '#151515'] },
  { id: 4, name: 'Jockey Sin Permiso', subtitle: 'Ajustable · Negro', category: 'Accesorios', price: 16990, image: photo('photo-1588850561407-ed78c282e89b'), tag: 'EL TOQUE FINAL', color: '#eceae5', sizes: ['Única'], colors: ['#252525', '#bfb6a2'] },
];
const categories = ['Todo', 'Poleras', 'Polerones', 'Pantalones', 'Accesorios'];

function App() {
  const [category, setCategory] = useState('Todo');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState(null);
  const [size, setSize] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [toast, setToast] = useState('');
  const [cart, setCart] = useState(() => {
    try { const data = JSON.parse(localStorage.getItem('mdh-cart') || '[]'); return Array.isArray(data) ? data.filter(i => products.some(p => p.id === i.id && p.sizes.includes(i.size)) && Number.isInteger(i.qty) && i.qty > 0 && i.qty <= 20) : []; } catch { return []; }
  });
  const dialogRef = useRef(null);
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const total = cart.reduce((n, i) => n + products.find(p => p.id === i.id).price * i.qty, 0);
  const modalOpen = !!selected || cartOpen;
  useEffect(() => { try { localStorage.setItem('mdh-cart', JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3000); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('button')?.focus();
    const key = e => {
      if (e.key === 'Escape') { setSelected(null); setCartOpen(false); }
      if (e.key === 'Tab') {
        const elements = [...dialogRef.current.querySelectorAll('button:not(:disabled), input, select, a[href]')];
        const first = elements[0], last = elements.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', key); previous?.focus(); };
  }, [modalOpen, selected, checkout]);
  const goShop = (value = 'Todo') => { setCategory(value); setMenuOpen(false); document.getElementById('coleccion').scrollIntoView({ behavior: 'smooth' }); };
  const openProduct = p => { setSelected(p); setSize(p.sizes.length === 1 ? p.sizes[0] : ''); };
  const add = () => {
    if (!size) return;
    const existing = cart.find(i => i.id === selected.id && i.size === size);
    if (existing?.qty >= 20) { setToast('Máximo 20 unidades por talla.'); return; }
    setCart(old => existing ? old.map(i => i.id === selected.id && i.size === size ? { ...i, qty: i.qty + 1 } : i) : [...old, { id: selected.id, size, qty: 1 }]);
    setToast(`${selected.name} se sumó a tu bolsa`); setSelected(null);
  };
  const changeQty = (id, itemSize, delta) => setCart(old => old.map(i => i.id === id && i.size === itemSize ? { ...i, qty: Math.min(20, i.qty + delta) } : i).filter(i => i.qty > 0));
  const visible = products.filter(p => (category === 'Todo' || p.category === category) && `${p.name} ${p.category} ${p.subtitle}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : a.id - b.id);

  return <>
    <div className="announcement"><span>DE SANTIAGO PA’ TODO CHILE</span><span>ENVÍO GRATIS EN COMPRAS SOBRE $80.000 <ArrowUpRight size={12} /></span><span>STREETWEAR CON IDENTIDAD</span></div>
    <header className="header">
      <a href="#" className="logo" aria-label="Melodía del Hampa, inicio"><span className="logo-symbol">m<span>h</span>✳</span><span>MELODÍA<br />DEL HAMPA<span className="logo-dot">®</span></span></a>
      <nav aria-label="Navegación principal"><a href="#coleccion" onClick={() => setCategory('Todo')}>La colección</a><a href="#coleccion" onClick={() => setCategory('Polerones')}>Nuevo drop <span className="nav-dot" /></a><a href="#nosotros">La esencia</a></nav>
      <div className="header-actions"><button className="icon-button" aria-label="Buscar productos" onClick={() => { setSearchOpen(!searchOpen); goShop(); }}><Search size={21} /></button><button className="bag-button" onClick={() => { setCartOpen(true); setCheckout(false); }} aria-label={`Abrir bolsa, ${count} productos`}><ShoppingBag size={20} /><span className="bag-label">Mi bolsa</span><span className="bag-count">{count}</span></button><button className="icon-button mobile-menu" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
    </header>
    {menuOpen && <nav className="mobile-nav">{categories.map(c => <button key={c} onClick={() => goShop(c)}>{c === 'Todo' ? 'La colección' : c}<ArrowUpRight size={16} /></button>)}<a href="#nosotros" onClick={() => setMenuOpen(false)}>La esencia</a></nav>}
    <main>
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="little-star">✳</span> INDEPENDIENTE. CHILENO. SIN PERMISO.</div><h1>DE LA CALLE.<br /><span>CON CLASE.</span></h1><p>No seguimos la moda. Le ponemos el ritmo.<br />Ropa con actitud pa’ los que son de verdad.</p><button className="primary-button" onClick={() => goShop()}>EXPLORAR EL DROP <ArrowUpRight size={22} /></button><div className="hero-bottom"><span className="mini-cross">✳</span><span>DISEÑADO EN CHILE<br /><b>Hecho para hacer ruido.</b></span><span className="edition">VOL. 01 / 2026</span></div></div>
        <div className="hero-visual"><img className="hero-photo" src={photo('photo-1523398002811-999ca8dec234', 1400)} alt="Estilo urbano con chaqueta denim y polerón, colección Melodía del Hampa" fetchPriority="high" /><div className="photo-shade" /><span className="vertical-caption">SANTIAGO, CHILE — 33°26′ S 70°39′ O</span><div className="drop-sticker"><span>NO ES MODA</span><strong>ES<br />IDENTIDAD.</strong><span>MDH® — EST. 2026</span></div><div className="photo-bottom"><span>EL BARRIO TIENE<br /><b>SU PROPIO CÓDIGO.</b></span><span className="photo-arrow"><ArrowUpRight size={28} /></span></div><span className="image-counter">01 — 04</span></div>
      </section>
      <BrandTicker />
      <section className="collection section-wrap" id="coleccion"><div className="section-heading"><div><span className="eyebrow muted">EL UNIFORME ES SER TÚ</span><h2>LO QUE ESTÁ SONANDO<span>↗</span></h2></div><span className="collection-note">Pocas palabras. Buenas prendas.<br />Encuentra tu próxima fija.</span></div>
        <div className="filter-row"><div className="category-tabs" role="group" aria-label="Filtrar por categoría">{categories.map(c => <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}{c === 'Todo' && <small>04</small>}</button>)}</div><label className="sort-label"><SlidersHorizontal size={15} /><select aria-label="Ordenar productos" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Destacados</option><option value="low">Menor precio</option><option value="high">Mayor precio</option></select></label></div>
        {searchOpen && <div className="search-field"><Search size={20} /><input autoFocus placeholder="Busca tu próxima fija…" aria-label="Buscar en el catálogo" value={query} onChange={e => setQuery(e.target.value)} /><button className="icon-button" aria-label="Cerrar búsqueda" onClick={() => { setSearchOpen(false); setQuery(''); }}><X size={18} /></button></div>}
        <div className="product-grid">{visible.map(p => <article className="product-card" key={p.id}><button className="product-image" style={{ backgroundColor: p.color }} onClick={() => openProduct(p)} aria-label={`Ver ${p.name}`}><img src={p.image} alt={p.name} loading="lazy" /><span className={`product-tag ${p.tag === 'NUEVO' ? 'lime' : ''}`}>{p.tag}</span><span className="product-add"><Plus size={22} /></span></button><div className="product-info"><button onClick={() => openProduct(p)}>{p.name}</button><strong>{money(p.price)}</strong></div><p className="product-subtitle">{p.subtitle}</p><div className="swatches" aria-label="Paleta de la colección">{p.colors.map(c => <span key={c} style={{ background: c }} />)}<span className="product-fit">{p.category === 'Accesorios' ? 'TALLA ÚNICA' : 'FIT CON ACTITUD'}</span></div></article>)}</div>
        {!visible.length && <div className="empty-results"><Search size={32} /><h3>No encontramos esa prenda.</h3><p>Prueba con otro nombre o categoría.</p><button className="text-button" onClick={() => { setQuery(''); setCategory('Todo'); }}>Ver toda la colección <ArrowRight size={17} /></button></div>}
        <div className="collection-bottom"><span>BUENAS PRENDAS. CERO DISFRACES.</span><span>01—04 / DROP 001</span></div>
      </section>
      <section className="brand-section" id="nosotros"><div className="brand-mark" aria-hidden="true">✳</div><div><span className="eyebrow">MÁS QUE UNA MARCA, UNA FORMA DE SER.</span><h2>LA FICHA NO SE COMPRA.<br /><span>SE LLEVA PUESTA.</span></h2><p>Del barrio a donde querai llegar. Melodía del Hampa nace de la mezcla que nos hace únicos: calle, música y estilo propio. Sin pedir permiso. Sin perder la esencia.</p></div><span className="brand-signature">CON RESPETO.<br />CON ACTITUD.<br /><b>CON IDENTIDAD.</b><ArrowUpRight size={38} /></span></section>
      <section className="benefits section-wrap"><div><Truck /><span><strong>De Arica a Punta Arenas</strong><small>Despachos a todo Chile</small></span></div><div><ShieldCheck /><span><strong>Prendas con identidad</strong><small>Detalles que hacen la diferencia</small></span></div><div><RefreshCw /><span><strong>Encuentra tu fit</strong><small>Revisa las medidas antes de elegir</small></span></div></section>
    </main>
    <footer><a href="#" className="footer-wordmark">MELODÍA DEL HAMPA<span>®</span></a><div className="footer-bottom"><span>© 2026 MDH. De la calle, con clase.</span><span>SANTIAGO, CHILE <span className="chile-dot" /></span><a href="#coleccion">Vuelve al drop <ArrowUpRight size={14} /></a></div></footer>
    {toast && <div className="toast" role="status"><Check size={18} />{toast}</div>}
    {modalOpen && <div className="modal-backdrop" onClick={() => { setSelected(null); setCartOpen(false); }}>
      {selected ? <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-title" ref={dialogRef} onClick={e => e.stopPropagation()}><button className="modal-close icon-button" aria-label="Cerrar producto" onClick={() => setSelected(null)}><X /></button><img className="modal-product-photo" src={selected.image} alt={selected.name} /><div className="modal-copy"><span className="eyebrow muted">DROP 001 / {selected.category.toUpperCase()}</span><h2 id="product-title">{selected.name}</h2><p>{selected.subtitle}</p><strong className="modal-price">{money(selected.price)}</strong><p className="product-description">Una fija para tu rotación de todos los días. Estilo relajado, identidad propia y toda la actitud del barrio.</p><label className="size-label">ELIGE TU TALLA <span>{size || 'Selecciona una'}</span></label><div className="size-options">{selected.sizes.map(s => <button key={s} aria-pressed={size === s} className={size === s ? 'chosen' : ''} onClick={() => setSize(s)}>{s}</button>)}</div><button className="primary-button" disabled={!size} onClick={add}>AGREGAR A MI BOLSA <Plus size={20} /></button><small className="demo-note">Catálogo de muestra · Imágenes referenciales</small></div></section> : <section className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" ref={dialogRef} onClick={e => e.stopPropagation()}><div className="cart-heading"><h2 id="cart-title">TU BOLSA <span>({count})</span></h2><button className="icon-button" aria-label="Cerrar bolsa" onClick={() => setCartOpen(false)}><X /></button></div>{!cart.length ? <div className="empty-cart"><ShoppingBag size={52} strokeWidth={1} /><h3>Falta tu próxima fija.</h3><p>Tu bolsa está esperando un poco de actitud.</p><button className="primary-button" onClick={() => { setCartOpen(false); goShop(); }}>EXPLORAR EL DROP <ArrowRight size={20} /></button></div> : <><div className="shipping-progress"><p>{total >= 80000 ? '¡Tu bolsa ya tiene envío gratis!' : `Te faltan ${money(80000 - total)} para envío gratis.`}</p><div><span style={{ width: `${Math.min(100, total / 800)}%` }} /></div></div><div className="cart-items">{cart.map(i => { const p = products.find(p => p.id === i.id); return <article className="cart-item" key={`${i.id}-${i.size}`}><img src={p.image} alt={p.name} /><div><h3>{p.name}</h3><p>Talla {i.size}</p><div className="quantity"><button aria-label={`Quitar una unidad de ${p.name}, talla ${i.size}`} onClick={() => changeQty(i.id, i.size, -1)}><Minus size={14} /></button><span>{i.qty}</span><button disabled={i.qty >= 20} aria-label={`Sumar una unidad de ${p.name}, talla ${i.size}`} onClick={() => changeQty(i.id, i.size, 1)}><Plus size={14} /></button></div></div><strong>{money(p.price * i.qty)}</strong></article>; })}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(total)}</strong></div><div><span>Envío</span><span>{total >= 80000 ? 'Gratis' : 'Por calcular'}</span></div><p>Valores en pesos chilenos.</p>{checkout ? <div className="checkout-message" role="status"><strong>Estás en la tienda de demostración.</strong><p>Tu bolsa está guardada. El pago y los despachos se habilitarán cuando la tienda abra; no se ha generado un pedido ni un cobro.</p></div> : <button className="primary-button" onClick={() => setCheckout(true)}>CONTINUAR <ArrowRight size={20} /></button>}<small className="demo-note">Vista previa · Compras aún no habilitadas</small></div></>}</section>}
    </div>}
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
