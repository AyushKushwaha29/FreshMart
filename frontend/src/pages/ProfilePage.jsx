import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import api, { getErrorMessage } from "../services/api";

const initialAddress = {
  fullName: "",
  mobile: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  tag: "Home",
  isDefault: false
};

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(initialAddress);

  const loadAddresses = async () => {
    try {
      const { data } = await api.get("/addresses");
      setAddresses(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

useEffect(() => {
  if (!user) return;

  setProfile({
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile || ""
  });
}, [user]);

  const saveProfile = async (event) => {
    event.preventDefault();
    await updateProfile(profile);
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    try {
      await api.post("/addresses", addressForm);
      toast.success("Address saved successfully");
      setAddressForm(initialAddress);
      await loadAddresses();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success("Address removed");
      await loadAddresses();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const setDefault = async (id) => {
    try {
      await api.patch(`/addresses/${id}/default`);
      await loadAddresses();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="section-space">
      <div className="page-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-[2.5rem] p-6">
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
          <form className="mt-6 space-y-4" onSubmit={saveProfile}>
            <Input label="Full name" onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} value={profile.name} />
           <Input
  label="Email"
  type="email"
  value={profile.email}
  readOnly
/>
            <Input
  label="Mobile number"
  value={profile.mobile}
  onChange={(event) =>
    setProfile((current) => ({
      ...current,
      mobile: event.target.value
    }))
  }
/>
            <Button className="w-full" loading={loading} type="submit">
              Save profile
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-[2.5rem] p-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Saved addresses</h2>
            <div className="mt-5 space-y-4">
              {addresses.map((address) => (
                <div className="rounded-4xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" key={address._id}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{address.fullName} · {address.tag}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {address.line1}, {address.city}, {address.state} - {address.postalCode}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button onClick={() => setDefault(address._id)} variant="secondary">
                          Make default
                        </Button>
                      )}
                      <Button onClick={() => deleteAddress(address._id)} variant="ghost">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2.5rem] p-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Add a new address</h2>
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={saveAddress}>
              {Object.entries(addressForm).map(([key, value]) => {
                if (["country", "tag", "isDefault"].includes(key)) {
                  return null;
                }

                return (
                  <Input
                    key={key}
                    label={key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}
                    onChange={(event) => setAddressForm((current) => ({ ...current, [key]: event.target.value }))}
                    value={value}
                  />
                );
              })}
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input
                  checked={addressForm.isDefault}
                  onChange={(event) => setAddressForm((current) => ({ ...current, isDefault: event.target.checked }))}
                  type="checkbox"
                />
                Make default
              </label>
              <Button className="md:col-span-2" type="submit">
                Save address
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
