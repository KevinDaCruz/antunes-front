function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center" role="status">
      <div
        className="size-12 animate-spin rounded-full border-4 border-ink border-t-pink"
        aria-hidden="true"
      ></div>
      <span className="sr-only">Chargement en cours…</span>
    </div>
  );
}

export default PageLoader;
