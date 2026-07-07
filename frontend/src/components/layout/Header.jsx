import { MoonStar, Search, ShoppingCart, SunMedium, UserRound, Heart, LayoutDashboard, Leaf } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../ui/Button";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="page-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" to="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">FreshMart</p>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Fruits + Veggies</p>
            </div>
          </Link>
          <button
            className="rounded-2xl border border-slate-200 p-3 text-slate-700 dark:border-slate-700 dark:text-slate-200 lg:hidden"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="button"
          >
            {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>
        </div>

        <form className="flex flex-1 items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900" onSubmit={submitSearch}>
          <Search className="h-5 w-5 text-slate-400" />
          <input
            className="w-full bg-transparent text-sm outline-none"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search mangoes, spinach, apples..."
            value={search}
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <nav className="hidden items-center gap-2 lg:flex">
            <NavLink className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800" to="/">
              Home
            </NavLink>
            <NavLink className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800" to="/products">
              Shop
            </NavLink>
            <NavLink className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800" to="/orders">
              Orders
            </NavLink>
          </nav>
          <button
            className="hidden rounded-2xl border border-slate-200 p-3 text-slate-700 dark:border-slate-700 dark:text-slate-200 lg:block"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="button"
          >
            {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>
          <Link className="relative rounded-2xl border border-slate-200 p-3 text-slate-700 dark:border-slate-700 dark:text-slate-200" to="/wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link className="relative rounded-2xl border border-slate-200 p-3 text-slate-700 dark:border-slate-700 dark:text-slate-200" to="/cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link className="rounded-2xl border border-slate-200 p-3 text-slate-700 dark:border-slate-700 dark:text-slate-200" to="/admin">
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              )}
              <Link className="rounded-2xl border border-slate-200 p-3 text-slate-700 dark:border-slate-700 dark:text-slate-200" to="/profile">
                <UserRound className="h-5 w-5" />
              </Link>
              <Button onClick={logout} variant="secondary">
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

