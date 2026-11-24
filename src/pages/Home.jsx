import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeEuro,
  Leaf,
  LockKeyhole,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import ConditionBadge from "../components/ConditionBadge";
import SeoHead from "../components/SeoHead";
import { useProducts } from "../hooks/useProducts";
import { HEADER_CATEGORIES } from "../constants/navigation";
import {
  getCategoryIllustration,
  getCategoryStyle,
} from "../constants/categories";

const LATEST_PRODUCTS_COUNT = 8;
const QUICK_SEARCHES = ["iPhone", "MacBook", "PS5", "RTX", "AirPods"];
const MARQUEE_CATEGORIES = [
  "Smartphones",
  "PC portables",
  "Consoles",
  "Cartes graphiques",
  "Audio",
  "Composants",
  "Manettes",
];

const STEPS = [
  {
    title: "Publie en 2 minutes",
    description:
      "Titre, marque, état et prix : ton annonce est en ligne, gratuitement.",
    icon: <Plus className="size-6" aria-hidden="true" />,
    tint: "bg-yellow",
  },
  {
    title: "Échange en confiance",
    description:
      "Pose tes questions au vendeur grâce à la messagerie intégrée.",
    icon: <MessageCircle className="size-6" aria-hidden="true" />,
    tint: "bg-sky",
  },
  {
    title: "Paie en sécurité",
    description:
      "Le paiement passe par Stripe. L'annonce passe en « Vendu » automatiquement.",
    icon: <ShieldCheck className="size-6" aria-hidden="true" />,
    tint: "bg-mint",
  },
];

const PROMISES = [
  {
    title: "Prix transparent",
    description:
      "Les frais de protection (5 % + 0,70 €) sont affichés sur chaque annonce. Pour un SSD à 110 €, tu paies 116,20 €, rien de plus.",
    icon: <BadgeEuro className="size-6" aria-hidden="true" />,
    tint: "bg-pink",
  },
  {
    title: "Paiement sécurisé",
    description:
      "Ta carte est saisie sur la page de paiement de Stripe : Antunes ne voit ni ne stocke jamais tes données bancaires.",
    icon: <LockKeyhole className="size-6" aria-hidden="true" />,
    tint: "bg-sky",
  },
  {
    title: "Données protégées",
    description:
      "Aucun traceur sans ton accord. Exporte ou supprime tes données à tout moment depuis ton compte.",
    icon: <ShieldCheck className="size-6" aria-hidden="true" />,
    tint: "bg-mint",
  },
];

function catalogLink(category) {
  return `/catalog?category=${encodeURIComponent(category)}`;
}

function Home() {
  const { products } = useProducts();
  const latestProducts = products.slice(0, LATEST_PRODUCTS_COUNT);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmedValue = searchValue.trim();
    navigate(
      trimmedValue
        ? `/catalog?search=${encodeURIComponent(trimmedValue)}`
        : "/catalog",
    );
  }

  return (
    <>
      <SeoHead
        title="Achète et revends ta tech d'occasion en confiance"
        description="Antunes, la marketplace pour acheter et revendre smartphones, PC, consoles et composants électroniques d'occasion ou reconditionnés en toute confiance."
      />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pt-12 pb-16 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
        <div className="min-w-0">
          <p className="eyebrow">
            <span className="size-2.5 rounded-full border-2 border-ink bg-pink" />
            Place de marché tech de seconde main
          </p>
          <h1 className="mt-6 text-[2.9rem] leading-[1.02] sm:text-6xl lg:text-[5.4rem]">
            La tech a{" "}
            <span className="my-1 inline-block -rotate-2 rounded-xl border-3 border-ink bg-pink px-3 pb-1 text-ink shadow-brutal">
              plusieurs
            </span>{" "}
            vies.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed font-medium text-ink-soft">
            Achète et revends smartphones, ordinateurs, consoles et composants
            entre particuliers. Le prix total s&apos;affiche dès l&apos;annonce,
            et le paiement est sécurisé par Stripe.
          </p>

          <form
            className="mt-8 flex max-w-xl items-stretch gap-3"
            role="search"
            onSubmit={handleSearchSubmit}
          >
            <label htmlFor="hero-search" className="sr-only">
              Que recherches-tu ?
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="hero-search"
                type="search"
                placeholder="Que recherches-tu ?"
                className="field h-full !pl-12 !text-base shadow-brutal-sm"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </div>
            <button type="submit" className="btn-ink !px-4 sm:!px-6">
              <Search className="size-5 sm:hidden" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Rechercher</span>
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {QUICK_SEARCHES.map((term) => (
              <Link
                key={term}
                to={`/catalog?search=${encodeURIComponent(term)}`}
                className="chip"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="relative mx-auto hidden w-full max-w-xl grid-cols-2 gap-5 text-ink md:grid"
          aria-hidden="true"
        >
          <div className="row-span-2 flex flex-col justify-between rounded-2xl bg-sky p-6 pb-24 brutal">
            <ConditionBadge condition="Reconditionné" />
            <img
              src="/illustrations/smartphones.svg"
              alt=""
              width="224"
              height="224"
              className="mx-auto my-4 size-56 -rotate-6"
            />
            <div>
              <p className="text-sm font-bold">iPhone 15 Pro</p>
              <p className="text-4xl font-black">950 €</p>
            </div>
          </div>
          <div className="rounded-2xl bg-mint p-5 brutal">
            <img
              src="/illustrations/consoles.svg"
              alt=""
              width="128"
              height="128"
              className="mx-auto size-32 rotate-3"
            />
            <p className="mt-2 text-sm font-bold">
              PS5 Slim · <span className="font-black">400 €</span>
            </p>
          </div>
          <div className="rounded-2xl bg-yellow p-5 brutal">
            <img
              src="/illustrations/cartes-graphiques.svg"
              alt=""
              width="128"
              height="128"
              className="mx-auto size-32 -rotate-3"
            />
            <p className="mt-2 text-sm font-bold">
              RTX 4070 · <span className="font-black">430 €</span>
            </p>
          </div>
          <div className="absolute -bottom-7 -left-8 flex rotate-[-4deg] items-center gap-3 rounded-2xl bg-white p-4 brutal">
            <span className="grid size-11 place-items-center rounded-full border-2 border-ink bg-pink">
              <BadgeEuro className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold text-ink-muted">
                Total affiché avant paiement
              </p>
              <p className="text-[15px] font-black">
                950 € + 48,20 € de protection
              </p>
            </div>
          </div>
        </div>
      </section>

      <div
        className="overflow-hidden border-y-3 border-ink bg-ink py-3 text-cream"
        aria-hidden="true"
      >
        <div className="animate-defilement flex w-max gap-6 text-2xl font-black tracking-tight uppercase">
          {[...MARQUEE_CATEGORIES, ...MARQUEE_CATEGORIES].map(
            (category, index) => (
              <span key={index} className="flex items-center gap-6">
                {category}
                <span className="text-pink">✦</span>
              </span>
            ),
          )}
        </div>
      </div>

      <section
        className="mx-auto mt-20 max-w-7xl px-6"
        aria-labelledby="categories-title"
      >
        <div className="flex items-end justify-between gap-4">
          <h2 id="categories-title" className="text-4xl md:text-5xl">
            Explorer par catégorie
          </h2>
          <Link
            to="/catalog"
            className="btn-white hidden !py-2.5 sm:inline-flex"
          >
            Tout le catalogue
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {HEADER_CATEGORIES.map((category, index) => (
            <li key={category}>
              <Link
                to={catalogLink(category)}
                className={`group flex flex-col items-center gap-3 rounded-2xl p-4 pb-5 text-center text-ink brutal press ${getCategoryStyle(category).tint}`}
              >
                <img
                  src={getCategoryIllustration(category)}
                  alt=""
                  width="80"
                  height="80"
                  loading="lazy"
                  className={`size-20 transition group-hover:scale-110 ${index % 2 ? "rotate-3" : "-rotate-3"}`}
                />
                <span className="text-[15px] font-extrabold">{category}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mx-auto mt-24 max-w-7xl px-6"
        aria-labelledby="latest-title"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Fraîchement publiées</p>
            <h2 id="latest-title" className="mt-3 text-4xl md:text-5xl">
              Dernières annonces
            </h2>
          </div>
          <Link
            to="/catalog"
            className="btn-white shrink-0 !py-2.5 whitespace-nowrap"
          >
            Voir tout
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {latestProducts.length > 0 ? (
          <div className="mt-9 grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-4">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="alert-info mt-9">
            Aucune annonce pour le moment : sois le premier à vendre !
          </p>
        )}
      </section>

      <section
        className="mx-auto mt-24 max-w-7xl px-6"
        aria-labelledby="steps-title"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="steps-title" className="text-4xl md:text-5xl">
            Comment ça marche&nbsp;?
          </h2>
          <Link to="/sell" className="btn-pink">
            <Plus className="size-4.5" aria-hidden="true" />
            Vendre un appareil
          </Link>
        </div>
        <ol className="mt-9 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ title, description, icon, tint }, index) => (
            <li key={title} className="card relative p-7">
              <span className="absolute -top-5 right-6 grid size-12 place-items-center rounded-full border-3 border-ink bg-white text-xl font-black text-ink">
                {index + 1}
              </span>
              <span
                className={`grid size-14 place-items-center rounded-xl border-3 border-ink text-ink ${tint}`}
              >
                {icon}
              </span>
              <h3 className="mt-5 text-2xl">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed font-medium text-ink-soft">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="mx-auto mt-24 max-w-7xl px-6"
        aria-labelledby="impact-title"
      >
        <div className="grid items-center gap-10 rounded-3xl bg-yellow p-8 text-ink brutal md:grid-cols-[auto_1fr] md:p-14">
          <p
            className="text-[6.5rem] leading-none font-black tracking-tighter md:text-[9rem]"
            aria-hidden="true"
          >
            80<span className="text-pink">%</span>
          </p>
          <div>
            <h2
              id="impact-title"
              className="text-3xl leading-tight md:text-4xl"
            >
              <span className="sr-only">80 % </span>
              de l&apos;empreinte carbone du numérique vient de la fabrication
              des appareils.
            </h2>
            <p className="mt-4 max-w-2xl font-medium">
              Garder un appareil plus longtemps, puis lui trouver un nouveau
              propriétaire, reste le geste le plus efficace. Source : étude
              ADEME et Arcep, 2022.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/sell" className="btn-pink">
                <Leaf className="size-4.5" aria-hidden="true" />
                Vendre ce que je n&apos;utilise plus
              </Link>
              <Link to="/catalog" className="btn-white">
                Acheter d&apos;occasion
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto mt-24 max-w-7xl px-6"
        aria-labelledby="promises-title"
      >
        <h2 id="promises-title" className="max-w-3xl text-4xl md:text-5xl">
          Acheter entre particuliers, sans mauvaise surprise
        </h2>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {PROMISES.map(({ title, description, icon, tint }) => (
            <div key={title} className="card p-7">
              <span
                className={`grid size-14 place-items-center rounded-xl border-3 border-ink text-ink ${tint}`}
              >
                {icon}
              </span>
              <h3 className="mt-5 text-2xl">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed font-medium text-ink-soft">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
