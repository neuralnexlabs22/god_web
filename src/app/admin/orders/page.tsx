"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  X,
  ExternalLink,
  ShieldCheck,
  Truck,
  IndianRupee,
} from "lucide-react";

export interface OrderRecord {
  id: string;
  total_amount: number;
  subtotal?: number;
  discount_amount?: number;
  currency?: string;
  status: string;
  payment_status: string;
  payment_method: string;
  fulfillment_status?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  shipping_address?: any;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders?limit=100");
      const json = await res.json();
      if (json.orders) {
        setOrders(json.orders);
      }
    } catch (err) {
      console.warn("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateFulfillment = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          fulfillment_status: newStatus,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, fulfillment_status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, fulfillment_status: newStatus } : null));
        }
      }
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Payment filter
      if (paymentFilter !== "all" && order.payment_status !== paymentFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const idMatch = order.id?.toLowerCase().includes(query);
        const nameMatch = order.customer_name?.toLowerCase().includes(query);
        const phoneMatch = order.customer_phone?.toLowerCase().includes(query);
        const rzpMatch =
          order.razorpay_payment_id?.toLowerCase().includes(query) ||
          order.razorpay_order_id?.toLowerCase().includes(query);

        let addressMatch = false;
        if (order.shipping_address) {
          const str =
            typeof order.shipping_address === "string"
              ? order.shipping_address.toLowerCase()
              : JSON.stringify(order.shipping_address).toLowerCase();
          addressMatch = str.includes(query);
        }

        return idMatch || nameMatch || phoneMatch || rzpMatch || addressMatch;
      }

      return true;
    });
  }, [orders, paymentFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = orders.length;
    const paid = orders.filter(
      (o) => o.payment_status === "captured" || o.payment_status === "paid"
    );
    const revenue = paid.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const pendingPayment = orders.filter(
      (o) => o.payment_status === "pending" || o.payment_status === "pending_verification"
    ).length;

    return { total, paidCount: paid.length, revenue, pendingPayment };
  }, [orders]);

  const parseShipping = (order: OrderRecord) => {
    if (!order.shipping_address) return {};
    if (typeof order.shipping_address === "string") {
      try {
        return JSON.parse(order.shipping_address);
      } catch {
        return { address: order.shipping_address };
      }
    }
    return order.shipping_address;
  };

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#c9a227]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold uppercase tracking-wider text-white">
                Orders & Payments
              </h1>
              <p className="text-xs text-zinc-400">
                Track Razorpay online transactions, WhatsApp orders & fulfillments
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#c9a227]" : ""}`} />
          Refresh Orders
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#0e0e0e] border border-white/5 p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Total Orders
          </span>
          <p className="text-2xl font-serif font-bold text-white">{stats.total}</p>
        </div>

        <div className="rounded-2xl bg-[#0e0e0e] border border-[#c9a227]/30 p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#c9a227]">
            Verified Revenue
          </span>
          <p className="text-2xl font-serif font-bold text-white">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-2xl bg-[#0e0e0e] border border-white/5 p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-green-400">
            Paid / Captured
          </span>
          <p className="text-2xl font-serif font-bold text-green-400">{stats.paidCount}</p>
        </div>

        <div className="rounded-2xl bg-[#0e0e0e] border border-white/5 p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Pending Payment
          </span>
          <p className="text-2xl font-serif font-bold text-amber-400">{stats.pendingPayment}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0a0a0a] border border-white/5 rounded-2xl p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer name, phone, or Razorpay ID..."
            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#c9a227]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All" },
            { id: "captured", label: "Captured / Paid" },
            { id: "pending", label: "Pending" },
            { id: "failed", label: "Failed" },
            { id: "refunded", label: "Refunded" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPaymentFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                paymentFilter === tab.id
                  ? "bg-[#c9a227] text-black font-bold"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-zinc-500 text-xs flex flex-col items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-[#c9a227]" />
            Loading orders & payment records...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No orders found matching the filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Payment</th>
                  <th className="py-3.5 px-4 font-semibold">Gateway Ref</th>
                  <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const details = parseShipping(order);
                  const isPaid =
                    order.payment_status === "captured" || order.payment_status === "paid";
                  const isFailed = order.payment_status === "failed";
                  const fulfillment = order.fulfillment_status || "pending";

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {order.id}
                        <div className="text-[10px] font-normal text-zinc-500">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {order.customer_name || details.customer_name || "Guest Customer"}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {order.customer_phone || details.customer_phone || "—"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#c9a227]">
                          ₹{Number(order.total_amount).toLocaleString("en-IN")}
                        </span>
                        <div className="text-[10px] text-zinc-500 capitalize">
                          {order.payment_method === "razorpay"
                            ? "Razorpay Online"
                            : order.payment_method}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? "bg-green-500/15 text-green-400 border border-green-500/30"
                              : isFailed
                              ? "bg-red-500/15 text-red-400 border border-red-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {order.payment_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                        {order.razorpay_payment_id ? (
                          <span className="text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            {order.razorpay_payment_id}
                          </span>
                        ) : order.razorpay_order_id ? (
                          <span className="text-zinc-500">{order.razorpay_order_id}</span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={fulfillment}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleUpdateFulfillment(order.id, e.target.value)}
                          className="bg-black border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-[#c9a227]"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white hover:border-white/30 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#0a0a0a] border border-[#c9a227]/30 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#c9a227] uppercase tracking-widest font-bold">
                  Order Specification
                </span>
                <h2 className="text-xl font-serif font-bold text-white">{selectedOrder.id}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Financial & Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Total Amount</span>
                <p className="text-lg font-bold text-[#c9a227]">
                  ₹{Number(selectedOrder.total_amount).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Payment Status</span>
                <p className="text-xs font-bold text-white capitalize mt-1">
                  {selectedOrder.payment_status}
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Method</span>
                <p className="text-xs font-bold text-white capitalize mt-1">
                  {selectedOrder.payment_method}
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Fulfillment</span>
                <p className="text-xs font-bold text-white capitalize mt-1">
                  {selectedOrder.fulfillment_status || "pending"}
                </p>
              </div>
            </div>

            {/* Razorpay Gateway Audit */}
            {(selectedOrder.razorpay_order_id || selectedOrder.razorpay_payment_id) && (
              <div className="bg-[#c9a227]/5 border border-[#c9a227]/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#c9a227]">
                  <ShieldCheck className="h-4 w-4" />
                  Razorpay Transaction Audit Trail
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 text-[10px] block">Razorpay Order ID</span>
                    <span className="text-white">
                      {selectedOrder.razorpay_order_id || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] block">Razorpay Payment ID</span>
                    <span className="text-green-400 font-bold">
                      {selectedOrder.razorpay_payment_id || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Customer & Delivery Information */}
            {(() => {
              const details = parseShipping(selectedOrder);
              return (
                <div className="space-y-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2 text-xs">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                      Customer & Shipping Details
                    </h3>
                    <p className="text-zinc-300">
                      <span className="text-zinc-500">Name:</span>{" "}
                      {selectedOrder.customer_name || details.customer_name || "—"}
                    </p>
                    <p className="text-zinc-300">
                      <span className="text-zinc-500">Phone:</span>{" "}
                      {selectedOrder.customer_phone || details.customer_phone || "—"}
                    </p>
                    <p className="text-zinc-300">
                      <span className="text-zinc-500">Address:</span>{" "}
                      {details.address || "—"}
                    </p>
                    {details.coupon_code && (
                      <p className="text-green-400">
                        <span className="text-zinc-500">Coupon Code:</span>{" "}
                        {details.coupon_code} (-₹{details.discount_amount || 0})
                      </p>
                    )}
                  </div>

                  {/* Items snapshot */}
                  {Array.isArray(details.items) && details.items.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                        Ordered Devotional Items ({details.items.length})
                      </h3>
                      <div className="divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
                        {details.items.map((item: any, idx: number) => (
                          <div key={idx} className="p-3 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-semibold text-white">{item.name}</p>
                              <p className="text-[11px] text-zinc-500">
                                {item.size || "Standard"} · {item.frame || "22KT Gold Frame"} · Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="font-bold text-[#c9a227]">
                              ₹{(Number(item.unitPrice || item.price) * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

