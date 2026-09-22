import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import { useAuth } from "../hooks/useAuth";
import { apiRequest, ApiError } from "../utils/apiClient";

function getOtherParticipant(conversation, currentUserId) {
  return conversation.participants.find(
    (participant) => participant._id !== currentUserId,
  );
}

function formatMessageTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Messages() {
  const { user, token, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [draftMessage, setDraftMessage] = useState("");

  const activeConversationId = searchParams.get("conversationId");

  const loadConversations = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiRequest("/conversations", { token });
      setConversations(data.conversations);

      if (!activeConversationId && data.conversations.length > 0) {
        setSearchParams({ conversationId: data.conversations[0]._id });
      }
    } catch {
      setErrorMessage("Impossible de charger tes conversations.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const activeConversation =
    conversations.find(
      (conversation) => conversation._id === activeConversationId,
    ) ?? conversations[0];

  async function handleMessageSubmit(event) {
    event.preventDefault();

    const trimmedMessage = draftMessage.trim();

    if (!trimmedMessage || !activeConversation) {
      return;
    }

    setErrorMessage("");

    try {
      const data = await apiRequest(
        `/conversations/${activeConversation._id}/messages`,
        { method: "POST", body: { content: trimmedMessage }, token },
      );

      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          conversation._id === data.conversation._id
            ? data.conversation
            : conversation,
        ),
      );
      setDraftMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Le message n'a pas pu être envoyé.",
      );
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container messages-page my-4 text-center">
        <SeoHead
          title="Messagerie"
          description="Gère tes conversations sur Antunes."
          noIndex
        />
        <h1 className="h2 mb-3">Messagerie</h1>
        <p className="text-muted mb-4">
          Connecte-toi pour voir et envoyer tes messages.
        </p>
        <Link to="/login" className="btn btn-primary fx-neon">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="container messages-page my-4">
      <SeoHead
        title="Messagerie"
        description="Gère tes conversations avec acheteurs et vendeurs sur Antunes."
        noIndex
      />

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

      {errorMessage ? (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-muted">Chargement de tes conversations...</p>
      ) : conversations.length === 0 ? (
        <section className="favorites-empty-state" role="alert">
          <h2 className="h5 mb-2">Aucune conversation pour le moment</h2>
          <p className="text-muted mb-0">
            Contacte un vendeur depuis une annonce pour démarrer une
            discussion.
          </p>
        </section>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="list-group shadow-sm messages-list messages-list-modern">
              {conversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(
                  conversation,
                  user.id,
                );
                const lastMessage =
                  conversation.messages[conversation.messages.length - 1];

                return (
                  <button
                    key={conversation._id}
                    type="button"
                    className={`list-group-item list-group-item-action messages-list-item ${
                      conversation._id === activeConversation?._id
                        ? "is-active"
                        : ""
                    }`}
                    onClick={() =>
                      setSearchParams({ conversationId: conversation._id })
                    }
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h2 className="h6 mb-1">{otherParticipant?.pseudo}</h2>
                    </div>
                    <p className="mb-1 text-muted small">
                      {conversation.product?.name}
                    </p>
                    <small>{lastMessage?.content ?? ""}</small>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card shadow-sm border-0 h-100 messages-thread-card">
              <div className="card-body d-flex flex-column gap-3">
                <div className="messages-thread-header">
                  <h2 className="h5 mb-1">
                    {getOtherParticipant(activeConversation, user.id)?.pseudo}
                  </h2>
                  <p className="text-muted mb-0">
                    {activeConversation.product?.name}
                  </p>
                </div>

                <div className="messages-thread-body mb-0 flex-grow-1 d-flex flex-column gap-2">
                  {activeConversation.messages.map((message) => (
                    <article
                      key={message._id}
                      className={`message-bubble ${
                        message.sender === user.id ? "from-me" : "from-them"
                      }`}
                    >
                      <p className="mb-1">{message.content}</p>
                      <small>{formatMessageTime(message.createdAt)}</small>
                    </article>
                  ))}
                </div>

                <form
                  className="d-flex gap-2 messages-compose-form"
                  onSubmit={handleMessageSubmit}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Écrire un message..."
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                  />
                  <button type="submit" className="btn btn-primary fx-neon">
                    Envoyer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
