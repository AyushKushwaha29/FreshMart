import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api, { getErrorMessage } from "../../services/api";
import { currency } from "../../utils/formatters";

const initialForm = {
  name: "",
  description: "",
  shortDescription: "",
  price: "",
  discountPrice: "",
  stock: "",
  category: "",
  unit: "Kg",
  availability: true,
  isFeatured: false,
  origin: "",
  images: []
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");

  const loadData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([api.get("/products?limit=100"), api.get("/categories")]);
      setProducts(productsResponse.data.data);
      setCategories(categoriesResponse.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const uploadFiles = async (files) => {
    if (!files.length) {
      return [];
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    const { data } = await api.post("/uploads/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data.data;
  };

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock: Number(form.stock)
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", payload);
        toast.success("Product created successfully");
      }

      setForm(initialForm);
      setEditingId("");
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || "",
      price: product.price,
      discountPrice: product.discountPrice || "",
      stock: product.stock,
      category: product.category?._id || "",
      unit: product.unit,
      availability: product.availability,
      isFeatured: product.isFeatured,
      origin: product.origin || "",
      images: product.images || []
    });
  };

  const removeProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2.5rem] p-6">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">{editingId ? "Edit product" : "Add a new product"}</h1>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submitForm}>
          <Input label="Name" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={form.name} />
          <Input label="Short description" onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))} value={form.shortDescription} />
          <Input label="Price" onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} type="number" value={form.price} />
          <Input label="Discount price" onChange={(event) => setForm((current) => ({ ...current, discountPrice: event.target.value }))} type="number" value={form.discountPrice} />
          <Input label="Stock" onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} type="number" value={form.stock} />
          <Input label="Origin" onChange={(event) => setForm((current) => ({ ...current, origin: event.target.value }))} value={form.origin} />
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Category
            <select
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              value={form.category}
            >
              <option value="">Choose category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Unit
            <select
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
              onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
              value={form.unit}
            >
              {["Kg", "Gram", "Piece", "Dozen", "Bundle"].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Description
            <textarea
              className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              value={form.description}
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Upload images
            <input
              className="rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700"
              multiple
              onChange={async (event) => {
                try {
                  const uploaded = await uploadFiles(event.target.files);
                  setForm((current) => ({ ...current, images: uploaded }));
                  toast.success("Images uploaded");
                } catch (error) {
                  toast.error(getErrorMessage(error));
                }
              }}
              type="file"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <input checked={form.isFeatured} onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))} type="checkbox" />
            Featured product
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <input checked={form.availability} onChange={(event) => setForm((current) => ({ ...current, availability: event.target.checked }))} type="checkbox" />
            Available in stock
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button type="submit">{editingId ? "Update product" : "Create product"}</Button>
            {editingId && (
              <Button onClick={() => { setEditingId(""); setForm(initialForm); }} type="button" variant="secondary">
                Cancel edit
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-6">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Product inventory</h2>
        <div className="mt-5 space-y-4">
          {products.map((product) => (
            <div className="rounded-4xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" key={product._id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    alt={product.name}
                    className="h-20 w-20 rounded-3xl bg-brand-50 object-cover p-2 dark:bg-brand-950/30"
                    src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80"}
                  />
                  <div>
                    <p className="font-display text-xl font-bold text-slate-900 dark:text-white">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {product.category?.name} · {product.stock} in stock · {currency(product.discountPrice || product.price)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit(product)} variant="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => removeProduct(product._id)} variant="ghost">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

