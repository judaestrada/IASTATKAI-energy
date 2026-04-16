import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../../context/AuthContext';
import { Order } from '../../context/CartContext';

export default function Admin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<(Order & { docId: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersSnap = await getDocs(query(collection(db, 'users')));
        const fetchedUsers = usersSnap.docs.map(docSnap => docSnap.data() as UserProfile);
        setUsers(fetchedUsers);

        const ordersSnap = await getDocs(query(collection(db, 'orders')));
        const fetchedOrders = ordersSnap.docs.map(docSnap => {
          const data = docSnap.data();
          let itemsField = [];
          try {
            itemsField = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
          } catch(e) {}
          return {
            ...data,
            items: itemsField,
            docId: docSnap.id
          } as Order & { docId: string };
        });
        
        // Sort newest first
        fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleStatusChange = async (docId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', docId), { status: newStatus });
      setOrders(prev => prev.map(o => o.docId === docId ? { ...o, status: newStatus as any } : o));
    } catch(err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center text-slate-500">Loading admin dashboard...</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">Admin Dashboard</h1>
        <p className="text-ink-600">Platform overview and management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-ink-900">Registered Users</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {users.map(user => (
              <div key={user.uid} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                <div>
                  <p className="font-medium text-ink-900">{user.name}</p>
                  <p className="text-sm text-ink-600">{user.email}</p>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-md capitalize ${user.role === 'admin' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-700'}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
            {users.length === 0 && <div className="p-4 text-slate-500 text-center">No users found.</div>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-ink-900">Recent Orders</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {orders.map(order => (
              <div key={order.trackingId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                <div>
                  <p className="font-mono font-bold text-ink-900 text-sm">{order.trackingId}</p>
                  <p className="text-sm text-ink-600">${order.total.toLocaleString()} - {order.items.length} items</p>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2 sm:mt-0">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.docId, e.target.value)}
                    className={`px-2 py-1 rounded-md font-medium text-xs border-0 cursor-pointer focus:ring-2 ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <option value="pending_payment">Pending Payment</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            ))}
            {orders.length === 0 && <div className="p-4 text-slate-500 text-center">No orders found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
