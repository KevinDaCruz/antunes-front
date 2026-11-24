import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import SeoHead from "../components/SeoHead";
import { useProducts } from "../hooks/useProducts";
import { HEADER_CATEGORIES } from "../constants/navigation";

const CONDITIONS = ["Neuf", "Reconditionné", "Bon état", "Occasion"];

const SORT_LABELS = {
  recent: "Plus récents",
  priceAsc: "Prix croissant",
  priceDesc: "Prix décroissant",
};

function Catalog() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const condition = searchParams.get("condition") ?? "";
  const sortBy = searchParams.get("sort") ?? "recent";
  const searchQuery = searchParams.get("search") ?? "";

  function updateFilter(key, value) {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    setSearchParams(nextParams);
  }

  function handleResetFilters() {
    setSearchParams({});
  }

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category) {
      result = result.filter((product) => product.category === category);
    }

    if (condition) {
      result = result.filter((product) => product.condition === condition);
    }

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.brand.toLowerCase().includes(normalizedQuery),
      );
    }

    if (sortBy === "priceAsc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, category, condition, searchQuery, sortBy]);

  const resultsCount = `${filteredProducts.length} annonce${
    filteredProducts.length > 1 ? "s" : ""
  }`;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10">
      <SeoHead
        title="Catalogue tech d'occasion et reconditionnée"
        description="Parcours toutes les annonces tech : smartphones, PC, consoles, composants et accessoires d'occasion ou reconditionnés, à filtrer par catégorie et par état, à trier par prix."
      />

      <nav
        className="text-sm font-bold text-ink-muted"
        aria-label="Fil d'Ariane"
      >
        <Link to="/" className="hover:underline">
          Accueil
        </Link>{" "}
        / <span className="text-ink">Catalogue</span>
      </nav>
      <h1 className="mt-4 text-5xl md:text-6xl">
        {searchQuery ? `Résultats pour « ${searchQuery} »` : "Catalogue"}
      </h1>

      <div
        className="mt-6 flex gap-2 overflow-x-auto pb-2"
        role="group"
        aria-label="Filtrer par catégorie"
      >
        <button
          type="button"
          className={`chip shrink-0 ${category ? "" : "!bg-yellow"}`}
          aria-pressed={!category}
          onClick={() => updateFilter("category", "")}
        >
          Toutes
        </button>
        {HEADER_CATEGORIES.map((categoryOption) => (
          <button
            key={categoryOption}
            type="button"
            className={`chip shrink-0 ${category === categoryOption ? "!bg-yellow" : ""}`}
            aria-pressed={category === categoryOption}
            onClick={() => updateFilter("category", categoryOption)}
          >
            {categoryOption}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside
          className="card h-fit space-y-5 p-6 lg:sticky lg:top-44"
          aria-label="Filtres"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Filtres</h2>
            <SlidersHorizontal className="size-5" aria-hidden="true" />
          </div>
          <div>
            <label htmlFor="condition" className="label">
              État
            </label>
            <select
              id="condition"
              className="field"
              value={condition}
              onChange={(event) =>
                updateFilter("condition", event.target.value)
              }
            >
              <option value="">Tous</option>
              {CONDITIONS.map((conditionOption) => (
                <option key={conditionOption} value={conditionOption}>
                  {conditionOption}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="label">
              Trier par
            </label>
            <select
              id="sort"
              className="field"
              value={sortBy}
              onChange={(event) => updateFilter("sort", event.target.value)}
            >
              <option value="recent">{SORT_LABELS.recent}</option>
              <option value="priceAsc">{SORT_LABELS.priceAsc}</option>
              <option value="priceDesc">{SORT_LABELS.priceDesc}</option>
            </select>
          </div>
          <button
            className="btn-white w-full"
            type="button"
            onClick={handleResetFilters}
          >
            Réinitialiser
          </button>
        </aside>

        <section aria-label="Résultats">
          <p className="text-[15px] font-bold" aria-live="polite">
            <span className="font-black">{resultsCount}</span> · Tri :{" "}
            {SORT_LABELS[sortBy].toLowerCase()}
          </p>
          {filteredProducts.length === 0 ? (
            <div className="card mt-6 p-10 text-center" role="alert">
              <img
                src="/illustrations/manettes.svg"
                alt=""
                width="112"
                height="112"
                className="mx-auto size-28 rotate-6"
              />
              <h3 className="mt-4 text-2xl">Aucune annonce ne correspond</h3>
              <p className="mt-2 font-semibold text-ink-soft">
                Essaie d&apos;élargir tes filtres ou de modifier ta recherche.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-5 md:gap-7 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Catalog;
