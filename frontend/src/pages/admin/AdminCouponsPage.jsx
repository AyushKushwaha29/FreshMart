import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api, { getErrorMessage } from "../../services/api";

const initialForm = {
  code: "",
  description: "",
  discountType: "percent",
  discountValue: "",
  minOrderValue: "",
  maxDiscount: "",
  startsAt: "",
  endsAt: "",
  usageLimit: 1000,
  perUserLimit: 1,
  isActive: true
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");

  const loadCoupons = async () => {
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue || 0),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: Number(form.usageLimit),
        perUserLimit: Number(form.perUserLimit)
      };

      if (editingId) {
        await api.put(`/coupons/${editingId}`, payload);
        toast.success("Coupon updated");
      } else {
        await api.post("/coupons", payload);
        toast.success("Coupon created");
      }

      setEditingId("");
      setForm(initialForm);
      await loadCoupons();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      await loadCoupons();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2.5rem] p-6">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">{editingId ? "Edit coupon" : "Create coupon"}</h1>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submitForm}>
          <Input label="Code" onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} value={form.code} />
          <Input label="Description" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description} />
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Discount type
            <select
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
              onChange={(event) => setForm((current) => ({ ...current, discountType: event.target.value }))}
              value={form.discountType}
            >
              <option value="percent">Percent</option>
              <option value="flat">Flat</option>
            </select>
          </label>
          <Input label="Discount value" onChange={(event) => setForm((current) => ({ ...current, discountValue: event.target.value }))} type="number" value={form.discountValue} />
          <Input label="Minimum order" onChange={(event) => setForm((current) => ({ ...current, minOrderValue: event.target.value }))} type="number" value={form.minOrderValue} />
          <Input label="Max discount" onChange={(event) => setForm((current) => ({ ...current, maxDiscount: event.target.value }))} type="number" value={form.maxDiscount} />
          <Input label="Starts at" onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))} type="datetime-local" value={form.startsAt} />
          <Input label="Ends at" onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))} type="datetime-local" value={form.endsAt} />
          <Input label="Usage limit" onChange={(event) => setForm((current) => ({ ...current, usageLimit: event.target.value }))} type="number" value={form.usageLimit} />
          <Input label="Per user limit" onChange={(event) => setForm((current) => ({ ...current, perUserLimit: event.target.value }))} type="number" value={form.perUserLimit} />
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit">{editingId ? "Update coupon" : "Create coupon"}</Button>
            {editingId && (
              <Button onClick={() => { setEditingId(""); setForm(initialForm); }} type="button" variant="secondary">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div className="glass-panel rounded-[2rem] p-5" key={coupon._id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">{coupon.code}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{coupon.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditingId(coupon._id);
                    setForm({
                      code: coupon.code,
                      description: coupon.description,
                      discountType: coupon.discountType,
                      discountValue: coupon.discountValue,
                      minOrderValue: coupon.minOrderValue,
                      maxDiscount: coupon.maxDiscount || "",
                      startsAt: coupon.startsAt?.slice(0, 16),
                      endsAt: coupon.endsAt?.slice(0, 16),
                      usageLimit: coupon.usageLimit,
                      perUserLimit: coupon.perUserLimit,
                      isActive: coupon.isActive
                    });
                  }}
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button onClick={() => deleteCoupon(coupon._id)} variant="ghost">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

