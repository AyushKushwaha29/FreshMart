import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../../services/api";
import { shortDate } from "../../utils/formatters";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const { data } = await api.get("/admin/customers");
        setCustomers(data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };

    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Customer management</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A simple CRM view for the first FreshMart release.</p>
      </div>
      <div className="glass-panel overflow-hidden rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-brand-50 text-sm uppercase tracking-[0.2em] text-brand-700 dark:bg-brand-950/30 dark:text-brand-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr className="border-t border-slate-200 dark:border-slate-800" key={customer._id}>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{customer.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{customer.mobile}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{customer.email || "Not set"}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{shortDate(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

