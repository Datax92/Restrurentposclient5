import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "@/axios/axiosInstace";
import { getSocket, connectSocket } from "@/config/socket.config";
import {
    CheckCircle2, Clock, ChefHat, Package, XCircle,
    ArrowLeft, RefreshCcw, UtensilsCrossed, Phone
} from "lucide-react";

/* ── status config ── */
const STATUSES = [
    { key: "Pending",    label: "Order Received",  icon: Clock,         color: "text-amber-400",    bg: "bg-amber-500/20",  border: "border-amber-500" },
    { key: "Preparing",  label: "Being Prepared",  icon: ChefHat,       color: "text-blue-400",     bg: "bg-blue-500/20",   border: "border-blue-500" },
    { key: "Ready",      label: "Ready to Collect!", icon: Package,     color: "text-green-400",    bg: "bg-green-500/20",  border: "border-green-500" },
    { key: "Completed",  label: "Completed",        icon: CheckCircle2,  color: "text-teal-400",     bg: "bg-teal-500/20",   border: "border-teal-500" },
];
const CANCELLED = { key: "Cancelled", label: "Order Cancelled", icon: XCircle, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500" };

const getStatusIndex = (s) => STATUSES.findIndex(st => st.key === s);

const Rs = (n) => `Rs ${Number(n).toLocaleString()}`;

export default function OrderTracking() {
    const { orderId }     = useParams();
    const [order,    setOrder]   = useState(null);
    const [loading,  setLoading] = useState(true);
    const [error,    setError]   = useState("");
    const [pulse,    setPulse]   = useState(false);   // flash on update

    /* ── fetch order ── */
    const fetchOrder = async () => {
        try {
            const res = await axiosInstance.get(`/orders/track/${orderId}`);
            setOrder(res.data.order);
            setError("");
        } catch (e) {
            setError(e.response?.data?.message || "Order not found");
        } finally {
            setLoading(false);
        }
    };

    /* ── connect socket & join order room ── */
    useEffect(() => {
        fetchOrder();

        let socket;
        try {
            connectSocket();
            socket = getSocket();

            socket.emit("join-room", `order:${orderId}`);

            socket.on("orderStatusUpdate", (updatedOrder) => {
                if (updatedOrder.orderId === orderId) {
                    setOrder(updatedOrder);
                    setPulse(true);
                    setTimeout(() => setPulse(false), 1500);

                    // Browser notification if order is Ready
                    if (updatedOrder.status === "Ready" && Notification.permission === "granted") {
                        new Notification("🍽️ Your order is ready!", {
                            body: `Order ${orderId} is ready for collection!`,
                            icon: "/favicon.ico"
                        });
                    }
                }
            });
        } catch (err) {
            console.error("Socket tracking error:", err);
        }

        return () => {
            if (socket) {
                socket.emit("leave-room", `order:${orderId}`);
                socket.off("orderStatusUpdate");
            }
        };
    }, [orderId]);

    /* ── request notification permission ── */
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    /* ── RENDER ── */
    const currentStatus = order?.status;
    const isCancelled   = currentStatus === "Cancelled";
    const statusConf    = isCancelled ? CANCELLED : (STATUSES.find(s => s.key === currentStatus) || STATUSES[0]);
    const statusIndex   = getStatusIndex(currentStatus);
    const StatusIcon    = statusConf.icon;

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center px-4 py-10">

            {/* ── Header ── */}
            <div className="w-full max-w-lg mb-8">
                <Link to="/menu" className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors text-sm mb-6">
                    <ArrowLeft className="size-4" /> Back to menu
                </Link>
                <div className="flex items-center gap-3">
                    <div className="size-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <ChefHat className="size-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Order Tracker</h1>
                        <p className="text-zinc-400 text-sm font-mono">{orderId}</p>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="w-full max-w-lg bg-zinc-800 rounded-2xl p-10 flex items-center justify-center">
                    <RefreshCcw className="size-8 text-amber-400 animate-spin" />
                </div>
            )}

            {error && (
                <div className="w-full max-w-lg bg-zinc-800 rounded-2xl p-8 text-center border border-red-500/30">
                    <XCircle className="size-12 text-red-400 mx-auto mb-3" />
                    <p className="text-red-400 font-semibold text-lg">{error}</p>
                    <p className="text-zinc-500 text-sm mt-2">Check the order ID and try again</p>
                    <Link to="/menu" className="mt-6 inline-flex items-center gap-2 bg-amber-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl">
                        Order Again
                    </Link>
                </div>
            )}

            {order && !error && (
                <div className={`w-full max-w-lg space-y-5 transition-all ${pulse ? "scale-[1.01]" : ""}`}>

                    {/* ── Big Status Card ── */}
                    <div className={`rounded-2xl border-2 ${statusConf.border} ${statusConf.bg} p-8 text-center`}>
                        <StatusIcon className={`size-16 mx-auto mb-4 ${statusConf.color} ${currentStatus === "Ready" ? "animate-bounce" : ""}`} />
                        <h2 className={`text-3xl font-extrabold ${statusConf.color}`}>{statusConf.label}</h2>
                        <p className="text-zinc-400 text-sm mt-2">Hi {order.clientName} 👋</p>
                        {currentStatus === "Ready" && (
                            <div className="mt-4 bg-green-500/30 rounded-xl p-3 border border-green-500/50">
                                <p className="text-green-300 font-semibold text-lg">🎉 Your order is ready!</p>
                                <p className="text-green-400 text-sm mt-1">Please collect it from the counter</p>
                            </div>
                        )}
                        {currentStatus === "Preparing" && (
                            <p className="text-zinc-400 text-sm mt-3">Our kitchen is working on your order ⏳</p>
                        )}
                        {currentStatus === "Pending" && (
                            <p className="text-zinc-400 text-sm mt-3">Your order is in the queue 📋</p>
                        )}
                    </div>

                    {/* ── Progress Steps ── */}
                    {!isCancelled && (
                        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-6">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Order Progress</h3>
                            <div className="relative">
                                {/* connector line */}
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-zinc-700" />
                                <div
                                    className="absolute left-4 top-4 w-0.5 bg-amber-500 transition-all duration-700"
                                    style={{ height: `${Math.min(100, (statusIndex / (STATUSES.length - 1)) * 100)}%` }}
                                />
                                <div className="space-y-8 relative">
                                    {STATUSES.map((s, idx) => {
                                        const done   = statusIndex >= idx;
                                        const active = statusIndex === idx;
                                        const Ic     = s.icon;
                                        return (
                                            <div key={s.key} className="flex items-start gap-4 pl-0">
                                                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${
                                                    done
                                                        ? `${s.bg} ${s.border}`
                                                        : "bg-zinc-800 border-zinc-600"
                                                }`}>
                                                    <Ic className={`size-4 ${done ? s.color : "text-zinc-600"}`} />
                                                </div>
                                                <div className="pt-0.5">
                                                    <p className={`font-semibold ${done ? "text-white" : "text-zinc-600"}`}>{s.label}</p>
                                                    {active && <p className="text-xs text-amber-400 mt-0.5 animate-pulse">● Current status</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Order Items ── */}
                    <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                            <UtensilsCrossed className="size-4 inline mr-2" />Your Items
                        </h3>
                        <div className="space-y-2">
                            {order.items?.map((item, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-zinc-300 text-sm">{item.name} <span className="text-zinc-500">× {item.quantity}</span></span>
                                    <span className="text-amber-400 text-sm font-medium">{Rs(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-zinc-700 mt-4 pt-4 flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-amber-400">{Rs(order.totalAmount)}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-zinc-500">
                            <span>Type: {order.type}</span>
                            <span>Payment on {order.type === "Takeaway" ? "pickup" : "table"}</span>
                        </div>
                    </div>

                    {/* ── Contact ── */}
                    <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-4 flex items-center gap-3">
                        <Phone className="size-5 text-amber-400 shrink-0" />
                        <div className="text-sm">
                            <p className="text-zinc-400">Need help? Call us</p>
                            <p className="text-white font-semibold">+92-300-0000000</p>
                        </div>
                    </div>

                    {/* ── Live indicator ── */}
                    <p className="text-center text-xs text-zinc-600 flex items-center justify-center gap-2">
                        <span className="size-2 rounded-full bg-green-500 animate-pulse inline-block" />
                        Live tracking — updates automatically
                    </p>
                </div>
            )}
        </div>
    );
}
