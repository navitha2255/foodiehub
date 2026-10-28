import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { getErrorMessage } from '../utils/getErrorMessage';

const MAX_QUANTITY = 20;

function Cart() {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const [busyId, setBusyId] = useState<number | null>(null);

  const run = async (id: number, action: () => Promise<void>) => {
    setBusyId(id);
    try {
      await action();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Remove all items from your cart?')) return;
    try {
      await clearCart();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Add some tasty food to get started.</p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <button onClick={handleClear} className="text-sm font-medium text-red-600 hover:underline">
          Clear cart
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-100">
                {item.food.imageUrl && (
                  <img
                    src={item.food.imageUrl}
                    alt={item.food.name}
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{item.food.name}</h2>
                <p className="text-sm text-gray-500">₹{item.food.price} each</p>
                {!item.food.isAvailable && (
                  <p className="text-xs font-medium text-red-600">
                    Not available now. Remove it to place your order.
                  </p>
                )}

                <div className="mt-2 flex items-center gap-3">
                  <button
                    disabled={busyId === item.id}
                    onClick={() =>
                      run(item.id, () =>
                        item.quantity > 1
                          ? updateItem(item.id, item.quantity - 1)
                          : removeItem(item.id),
                      )
                    }
                    className="rounded-full border border-gray-300 p-1 hover:bg-brand-100 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    disabled={busyId === item.id || item.quantity >= MAX_QUANTITY}
                    onClick={() => run(item.id, () => updateItem(item.id, item.quantity + 1))}
                    className="rounded-full border border-gray-300 p-1 hover:bg-brand-100 disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-brand-600">
                  ₹{(item.food.price * item.quantity).toFixed(2)}
                </p>
                <button
                  disabled={busyId === item.id}
                  onClick={() => run(item.id, () => removeItem(item.id))}
                  className="mt-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Items</dt>
              <dd>{cart.totalItems}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd>₹{cart.subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Delivery</dt>
              <dd className="text-green-600">Free</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd className="text-brand-600">₹{cart.subtotal.toFixed(2)}</dd>
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-6 block rounded-full bg-brand-600 py-3 text-center font-semibold text-white hover:bg-brand-700"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;