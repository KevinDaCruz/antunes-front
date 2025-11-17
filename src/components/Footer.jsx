function Footer() {
  return (
    <footer className="bg-light text-center text-muted border-top mt-auto py-3">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Antunes. Tous droits réservés.
        </p>
        <p className="mb-0">Projet de mémoire - Kevin Da Cruz</p>
      </div>
    </footer>
  );
}

export default Footer;
