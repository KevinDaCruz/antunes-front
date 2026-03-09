import { useState } from "react";

function Messages() {
  const conversations = [
    {
      id: 1,
      seller: "TechHunter75",
      product: "Console Sony PS5 Slim",
      excerpt: "Salut, elle est toujours disponible ?",
      date: "Aujourd'hui",
    },
    {
      id: 2,
      seller: "PixelStore",
      product: "SSD Samsung 980 Pro 1To",
      excerpt: "Je peux l'envoyer demain matin.",
      date: "Hier",
    },
  ];

  const [activeConversationId, setActiveConversationId] = useState(
    conversations[0]?.id ?? null,
  );

  const activeConversation =
    conversations.find(
      (conversation) => conversation.id === activeConversationId,
    ) ?? conversations[0];

  const mockMessages = [
    {
      id: "m1",
      from: "them",
      content: activeConversation?.excerpt ?? "Bonjour 👋",
      time: "10:12",
    },
    {
      id: "m2",
      from: "me",
      content: "Oui parfait, je suis intéressé.",
      time: "10:14",
    },
  ];

  return (
    <div className="container messages-page my-4">
      <section className="messages-hero mb-4">
        <div>
          <p className="messages-kicker mb-2">Communication instantanée</p>
          <h1 className="h2 mb-2">Messagerie</h1>
          <p className="text-muted mb-0">
            Gère tes discussions avec acheteurs et vendeurs depuis une interface
            claire et rapide.
          </p>
        </div>
        <div className="messages-hero-chips">
          <span className="messages-chip">
            {conversations.length} conversations
          </span>
          <span className="messages-chip">Réponse rapide</span>
          <span className="messages-chip">Historique centralisé</span>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="list-group shadow-sm messages-list messages-list-modern">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`list-group-item list-group-item-action messages-list-item ${
                  conversation.id === activeConversationId ? "is-active" : ""
                }`}
                onClick={() => setActiveConversationId(conversation.id)}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h2 className="h6 mb-1">{conversation.seller}</h2>
                  <small className="text-muted">{conversation.date}</small>
                </div>
                <p className="mb-1 text-muted small">{conversation.product}</p>
                <small>{conversation.excerpt}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 h-100 messages-thread-card">
            <div className="card-body d-flex flex-column gap-3">
              <div className="messages-thread-header">
                <h2 className="h5 mb-1">{activeConversation?.seller}</h2>
                <p className="text-muted mb-0">{activeConversation?.product}</p>
              </div>

              <div className="messages-thread-body mb-0 flex-grow-1 d-flex flex-column gap-2">
                {mockMessages.map((message) => (
                  <article
                    key={message.id}
                    className={`message-bubble ${
                      message.from === "me" ? "from-me" : "from-them"
                    }`}
                  >
                    <p className="mb-1">{message.content}</p>
                    <small>{message.time}</small>
                  </article>
                ))}
              </div>

              <form className="d-flex gap-2 messages-compose-form">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Écrire un message..."
                />
                <button type="submit" className="btn btn-primary fx-neon">
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
