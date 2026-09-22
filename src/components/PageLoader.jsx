function PageLoader() {
  return (
    <div
      className="d-flex justify-content-center align-items-center page-loader"
      role="status"
    >
      <div className="spinner-border text-primary" aria-hidden="true"></div>
      <span className="visually-hidden">Chargement en cours…</span>
    </div>
  );
}

export default PageLoader;
