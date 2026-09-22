export const FAKE_TOKEN = "fake-jwt-token";

export const DEMO_USER = {
  id: "user-1",
  pseudo: "kevintech",
  email: "kevin@example.com",
  firstName: "Kevin",
  lastName: "Da Cruz",
};

export const DEMO_SELLER = {
  _id: "user-2",
  pseudo: "TechHunter75",
  createdAt: "2023-01-01T00:00:00.000Z",
};

export const DEMO_CONVERSATIONS = [
  {
    _id: "conversation-1",
    participants: [
      { _id: DEMO_USER.id, pseudo: DEMO_USER.pseudo },
      { _id: "user-3", pseudo: "TechHunter75" },
    ],
    product: { _id: "product-3", name: "Console Sony PS5 Slim" },
    messages: [
      {
        _id: "message-1",
        sender: "user-3",
        content: "Salut, elle est toujours disponible ?",
        createdAt: "2026-01-01T10:12:00.000Z",
      },
    ],
  },
  {
    _id: "conversation-2",
    participants: [
      { _id: DEMO_USER.id, pseudo: DEMO_USER.pseudo },
      { _id: "user-4", pseudo: "PixelStore" },
    ],
    product: { _id: "product-2", name: "Raspberry Pi 4 Model B" },
    messages: [
      {
        _id: "message-2",
        sender: "user-4",
        content: "Je peux l'envoyer demain matin.",
        createdAt: "2026-01-01T18:40:00.000Z",
      },
    ],
  },
];

export const DEMO_PRODUCTS = [
  {
    _id: "product-1",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphones",
    condition: "Reconditionné",
    price: 950,
    description: "iPhone 15 Pro reconditionné, écran et batterie vérifiés.",
    imageUrl: "https://placehold.co/600x600.png?text=iPhone+15",
    seller: DEMO_SELLER,
  },
  {
    _id: "product-2",
    name: "Raspberry Pi 4 Model B",
    brand: "Raspberry Pi",
    category: "Composants",
    condition: "Neuf",
    price: 65,
    description: "Raspberry Pi 4 Model B neuf sous blister.",
    imageUrl: "https://placehold.co/600x600.png?text=Raspberry+Pi",
    seller: DEMO_SELLER,
  },
  {
    _id: "product-3",
    name: "Console Sony PS5 Slim",
    brand: "Sony",
    category: "Consoles",
    condition: "Bon état",
    price: 400,
    description: "PS5 Slim en bon état, boîte d'origine.",
    imageUrl: "https://placehold.co/600x600.png?text=PS5+Slim",
    seller: DEMO_SELLER,
  },
  {
    _id: "product-4",
    name: "SSD Interne Samsung 980 Pro 1To",
    brand: "Samsung",
    category: "SSD & stockage",
    condition: "Neuf",
    price: 110,
    description: "SSD NVMe Samsung 980 Pro 1To neuf.",
    imageUrl: "https://placehold.co/600x600.png?text=Samsung+SSD",
    seller: DEMO_SELLER,
  },
];
