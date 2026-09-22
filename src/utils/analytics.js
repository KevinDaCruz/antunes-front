const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initAnalytics() {
  if (!MEASUREMENT_ID || typeof document === "undefined") {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  function gtag(...args) {
    window.dataLayer.push(args);
  }

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);
}
