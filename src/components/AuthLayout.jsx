// Gabarit des pages d'authentification : un panneau de marque (masqué sur
// mobile) à côté de la carte du formulaire. Le panneau garde la même taille
// quelle que soit la longueur du formulaire (connexion courte, inscription
// longue) et reste visible pendant le défilement.
function AuthLayout({ panelTitle, panelPoints = [], children }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-12 lg:grid-cols-2">
      <div className="relative hidden h-fit overflow-hidden rounded-3xl bg-pink p-10 text-ink brutal lg:sticky lg:top-44 lg:flex lg:min-h-[520px] lg:flex-col lg:justify-between">
        <img
          src="/brand/antunes-symbole.svg"
          alt=""
          width="96"
          height="96"
          className="size-24 -rotate-6"
        />
        <img
          src="/illustrations/consoles.svg"
          alt=""
          width="192"
          height="192"
          className="absolute -top-6 -right-8 size-48 rotate-12"
        />
        <div className="mt-16">
          <p className="text-5xl leading-[1.02] font-black tracking-tight">
            {panelTitle}
          </p>
          <ul className="mt-8 space-y-3">
            {panelPoints.map(({ icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 rounded-xl border-2 border-ink bg-white px-4 py-3 text-[15px] font-bold"
              >
                {icon}
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card h-fit p-8 md:p-10">{children}</div>
    </div>
  );
}

export default AuthLayout;
