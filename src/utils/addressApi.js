const ADDRESS_API_BASE_URL = "https://api-adresse.data.gouv.fr/search/";

export async function searchAddress(query, signal) {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const url = `${ADDRESS_API_BASE_URL}?q=${encodeURIComponent(query)}&limit=5`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les suggestions d'adresse.");
  }

  const data = await response.json();

  return data.features.map((feature) => ({
    id: feature.properties.id,
    label: feature.properties.label,
  }));
}
