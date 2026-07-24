import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axios/axiosInstace";
import { toast } from "sonner";
import {
    ShoppingCart, Plus, Minus, Trash2, ChefHat,
    User, Phone, ArrowRight, X, Search, Loader2, UtensilsCrossed
} from "lucide-react";

/* ─── tiny helpers ─── */
const Rs = (n) => `Rs ${Number(n).toLocaleString()}`;

export default function OnlineOrder() {
    const navigate = useNavigate();

    /* menu data */
    const [categories, setCategories]   = useState([]);
    const [items,       setItems]       = useState([]);
    const [activeCat,   setActiveCat]   = useState("");
    const [search,      setSearch]      = useState("");
    const [loading,     setLoading]     = useState(true);

    /* cart */
    const [cart, setCart] = useState([]);

    /* checkout form */
    const [showCheckout, setShowCheckout] = useState(false);
    const [form, setForm]                 = useState({ name: "", phone: "", type: "Takeaway" });
    const [placing,  setPlacing]          = useState(false);

    /* ── fetch menu ── */
    useEffect(() => {
        (async () => {
            try {
                const [catRes, itemRes] = await Promise.all([
                    axiosInstance.get("/menu/category?page=1&limit=100"),
                    axiosInstance.get("/menu/item?page=1&limit=200"),
                ]);
                const cats  = catRes.data?.categories  || catRes.data?.data  || [];
                const menus = itemRes.data?.menuItems  || itemRes.data?.data  || [];
                setCategories(cats);
                setItems(menus);
                if (cats.length) setActiveCat(cats[0]._id);
            } catch {
                toast.error("Failed to load menu");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ── filtered items ── */
    const filteredItems = items.filter(item => {
        const matchCat    = activeCat ? item.category === activeCat || item.category?._id === activeCat : true;
        const matchSearch = search ? item.name.toLowerCase().includes(search.toLowerCase()) : true;
        return matchCat && matchSearch && item.isAvailable !== false;
    });

    /* ── cart helpers ── */
    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(c => c._id === item._id);
            if (existing) return prev.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c);
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const changeQty = (id, delta) => {
        setCart(prev =>
            prev.map(c => c._id === id ? { ...c, qty: c.qty + delta } : c)
               .filter(c => c.qty > 0)
        );
    };

    const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const cartCount = cart.reduce((s, c) => s + c.qty, 0);

    /* ── place order ── */
    const placeOrder = async () => {
        if (!form.name.trim() || !form.phone.trim()) return toast.error("Please fill in your name and phone number");
        if (form.phone.replace(/\D/g, "").length < 10) return toast.error("Enter a valid phone number");
        setPlacing(true);
        try {
            const payload = {
                clientName:  form.name.trim(),
                clientPhone: form.phone.trim(),
                type:        form.type,
                items: cart.map(c => ({ menuItem: c._id, quantity: c.qty }))
            };
            const res = await axiosInstance.post("/orders/public", payload);
            const orderId = res.data.order.orderId;
            toast.success("Order placed! Redirecting to tracking…");
            setTimeout(() => navigate(`/track/${orderId}`), 1000);
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to place order");
        } finally {
            setPlacing(false);
        }
    };

    /* ─────────────── RENDER ─────────────── */
    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans">

            {/* ── Hero Header ── */}
            <header className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-zinc-700 px-6 py-5 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                        <ChefHat className="size-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Tasty Station</h1>
                        <p className="text-xs text-zinc-400">Order online — ready when you arrive</p>
                    </div>
                </div>
                <button
                    onClick={() => cart.length && setShowCheckout(true)}
                    className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg"
                >
                    <ShoppingCart className="size-5" />
                    <span className="hidden sm:inline">Basket</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 size-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                    <span className="font-bold">{Rs(cartTotal)}</span>
                </button>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">

                {/* ── Left: Menu ── */}
                <div className="flex-1 min-w-0">

                    {/* Search */}
                    <div className="relative mb-5">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search menu…"
                            className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Category tabs */}
                    {!search && (
                        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    onClick={() => setActiveCat(cat._id)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all border ${
                                        activeCat === cat._id
                                            ? "bg-amber-500 text-zinc-950 border-amber-500"
                                            : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-amber-500 hover:text-amber-400"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Items grid */}
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <Loader2 className="size-10 text-amber-500 animate-spin" />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center py-24 text-zinc-500">
                            <UtensilsCrossed className="size-12 mb-3" />
                            <p className="text-lg font-medium">No items found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredItems.map(item => {
                                const inCart = cart.find(c => c._id === item._id);
                                return (
                                    <div key={item._id} className="bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 hover:border-amber-500/50 transition-all group">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-40 bg-zinc-700 flex items-center justify-center">
                                                <UtensilsCrossed className="size-12 text-zinc-500" />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-white">{item.name}</h3>
                                            {item.description && (
                                                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-amber-400 font-bold">{Rs(item.price)}</span>
                                                {!inCart ? (
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-sm transition-all"
                                                    >
                                                        <Plus className="size-4" /> Add
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => changeQty(item._id, -1)} className="size-7 bg-zinc-700 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors">
                                                            <Minus className="size-3" />
                                                        </button>
                                                        <span className="font-bold w-5 text-center">{inCart.qty}</span>
                                                        <button onClick={() => changeQty(item._id, +1)} className="size-7 bg-amber-500 hover:bg-amber-400 rounded-lg flex items-center justify-center transition-colors">
                                                            <Plus className="size-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Right: Cart sidebar (desktop) ── */}
                <div className="hidden lg:flex flex-col w-80 shrink-0">
                    <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 sticky top-24">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <ShoppingCart className="size-5 text-amber-400" /> Your Order
                        </h2>
                        {cart.length === 0 ? (
                            <p className="text-zinc-500 text-sm text-center py-8">Add items to get started</p>
                        ) : (
                            <>
                                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                    {cart.map(c => (
                                        <div key={c._id} className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{c.name}</p>
                                                <p className="text-xs text-amber-400">{Rs(c.price)}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => changeQty(c._id, -1)} className="size-6 bg-zinc-700 rounded-md flex items-center justify-center hover:bg-red-500 transition-colors">
                                                    <Minus className="size-3" />
                                                </button>
                                                <span className="w-4 text-center text-sm font-bold">{c.qty}</span>
                                                <button onClick={() => changeQty(c._id, +1)} className="size-6 bg-amber-500 rounded-md flex items-center justify-center hover:bg-amber-400 transition-colors">
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-zinc-700 mt-4 pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-amber-400">{Rs(cartTotal)}</span>
                                </div>
                                <button
                                    onClick={() => setShowCheckout(true)}
                                    className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                                >
                                    Checkout <ArrowRight className="size-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Checkout Modal ── */}
            {showCheckout && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

                        <div className="flex items-center justify-between p-5 border-b border-zinc-700">
                            <h2 className="text-xl font-bold">Confirm Order</h2>
                            <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Your details */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Your Details</h3>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                        <input
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            placeholder="Your name *"
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                        <input
                                            value={form.phone}
                                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                            placeholder="Phone number *"
                                            type="tel"
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Order type */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Order Type</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Takeaway", "Dine-in"].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setForm(f => ({ ...f, type: t }))}
                                            className={`py-3 rounded-xl border font-medium transition-all ${
                                                form.type === t
                                                    ? "bg-amber-500 border-amber-500 text-zinc-950"
                                                    : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-amber-500"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Order summary */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Order Summary</h3>
                                <div className="bg-zinc-800 rounded-xl p-4 space-y-2">
                                    {cart.map(c => (
                                        <div key={c._id} className="flex justify-between text-sm">
                                            <span className="text-zinc-300">{c.name} × {c.qty}</span>
                                            <span className="text-amber-400 font-medium">{Rs(c.price * c.qty)}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-zinc-700 pt-2 mt-2 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span className="text-amber-400">{Rs(cartTotal)}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1">Payment on {form.type === "Takeaway" ? "pickup" : "the table"}</p>
                                </div>
                            </div>

                            <button
                                onClick={placeOrder}
                                disabled={placing}
                                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-zinc-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-lg"
                            >
                                {placing ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
                                {placing ? "Placing Order…" : "Place Order"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
