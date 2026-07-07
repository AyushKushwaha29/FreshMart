import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api, { getErrorMessage } from "../../services/api";

const initialForm = {
  name: "",
  description: "",
  displayOrder: 0
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");

  const loadCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder)
      };

      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
        toast.success("Category updated");
      } else {
        await api.post("/categories", payload);
        toast.success("Category created");
      }
      setForm(initialForm);
      setEditingId("");
      await loadCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const removeCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      await loadCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[2.5rem] p-6">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">{editingId ? "Edit category" : "Create category"}</h1>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submitForm}>
          <Input label="Name" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={form.name} />
          <Input label="Display order" onChange={(event) => setForm((current) => ({ ...current, displayOrder: event.target.value }))} type="number" value={form.displayOrder} />
          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Description
            <textarea
              className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              value={form.description}
            />
          </label>
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit">{editingId ? "Update category" : "Create category"}</Button>
            {editingId && (
              <Button onClick={() => { setEditingId(""); setForm(initialForm); }} type="button" variant="secondary">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-6">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Existing categories</h2>
        <div className="mt-5 space-y-4">
          {categories.map((category) => (
            <div className="rounded-4xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" key={category._id}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-display text-xl font-bold text-slate-900 dark:text-white">{category.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{category.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingId(category._id);
                      setForm({
                        name: category.name,
                        description: category.description,
                        displayOrder: category.displayOrder || 0
                      });
                    }}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button onClick={() => removeCategory(category._id)} variant="ghost">
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

