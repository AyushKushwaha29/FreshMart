
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatCard from "../../components/admin/StatCard";
import api, { getErrorMessage } from "../../services/api";
import { currency } from "../../utils/formatters";


const COLORS = [
  "#16a34a",
  "#2563eb",
  "#f97316",
  "#e11d48",
  "#9333ea"
];


export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState({ dailySales: [], topProducts: [] });
  const [revenue, setRevenue] = useState([]);
  const paymentData = revenue.map((item) => ({
  name: item._id,
  value: item.total
}));
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [salesResponse, revenueResponse] = await Promise.all([api.get("/admin/analytics/sales"), api.get("/admin/revenue")]);
        setAnalytics(salesResponse.data.data);
        setRevenue(revenueResponse.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Sales analytics</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Revenue visibility for day-to-day operations and planning.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {revenue.map((item) => (
          <StatCard currencyMode key={item._id} label={`${item._id} revenue`} value={item.total} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
      <div className="glass-panel rounded-[2.5rem] p-6">

  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
    Revenue Trend
  </h2>

  <div className="mt-6 h-[350px]">

    <ResponsiveContainer width="100%" height="100%">

      <LineChart data={analytics.dailySales}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="_id" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#16a34a"
          strokeWidth={4}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>
</div>

        <div className="glass-panel rounded-[2.5rem] p-6">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Top products</h2>
          <div className="mt-6 space-y-4">
            {analytics.topProducts.map((product) => (
              <div className="rounded-4xl bg-white/70 p-4 dark:bg-slate-900/60" key={product._id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{product._id}</p>
                    <p className="mt-1 text-sm text-slate-500">{product.quantity} units sold</p>
                  </div>
                  <p className="font-semibold text-brand-700 dark:text-brand-200">{currency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  );
}
