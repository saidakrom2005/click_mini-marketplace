const { useState, useEffect } = React;

function loadCartFromStorage(){
  try{
    const raw = localStorage.getItem('cart_v1');
    return raw ? JSON.parse(raw) : [];
  }catch(e){return []}
}

function saveCartToStorage(cart){
  localStorage.setItem('cart_v1', JSON.stringify(cart));
}

function CartItem({item, onRemove}){
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} />
      <div className="item-meta">
        <div style={{fontSize:13,fontWeight:600}}>{item.title}</div>
        <div className="small">Price: ${item.price.toFixed(2)}</div>
        <div className="small">Qty: {item.quantity}</div>
      </div>
      <div className="item-actions">
        <div style={{fontWeight:700}}>${(item.price * item.quantity).toFixed(2)}</div>
        <button className="btn btn-ghost" onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </div>
  );
}

function CartList({items, onRemove}){
  if(items.length === 0) return <div className="empty">Cart is empty</div>;
  return (
    <div className="cart-list">
      {items.map(it => (
        <CartItem key={it.id} item={it} onRemove={onRemove} />
      ))}
    </div>
  );
}

function CartApp(){
  const [cart, setCart] = useState(() => loadCartFromStorage());

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  useEffect(() => {
    function handleAdd(e){
      const product = e.detail;
      setCart(prev => {
        const found = prev.find(p => p.id === product.id);
        if(found){
          return prev.map(p => p.id === product.id ? {...p, quantity: p.quantity + 1} : p);
        }
        const newItem = { id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 };
        return [newItem, ...prev];
      });
    }
    window.addEventListener('cart-add', handleAdd);
    return () => window.removeEventListener('cart-add', handleAdd);
  }, []);

  function handleRemove(id){
    setCart(prev => prev.filter(p => p.id !== id));
  }

  const totalCount = cart.reduce((s,i)=>s+i.quantity,0);
  const totalSum = cart.reduce((s,i)=>s + i.quantity * i.price,0);

  return (
    <div>
      <div className="cart-header">
        <h2>Cart</h2>
        <div className="small">Items: {totalCount}</div>
      </div>
      <CartList items={cart} onRemove={handleRemove} />
      <div className="total-row">
        <div className="small">Total</div>
        <div style={{fontWeight:800}}>${totalSum.toFixed(2)}</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('cart-root')).render(<CartApp />);
