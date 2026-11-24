import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Send } from "lucide-react";
import SeoHead from "../components/SeoHead";
import {
  getCategoryIllustration,
  getCategoryStyle,
} from "../constants/categories";
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
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <SeoHead
          title="Messagerie"
          description="Gère tes conversations sur Antunes."
          noIndex
        />
        <h1 className="text-5xl">Messagerie</h1>
        <p className="mt-4 font-semibold text-ink-soft">
          Connecte-toi pour voir et envoyer tes messages.
        </p>
        <Link to="/login" className="btn-pink mt-8">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10">
      <SeoHead
        title="Messagerie"
        description="Gère tes conversations avec acheteurs et vendeurs sur Antunes."
        noIndex
      />

      <h1 className="text-5xl md:text-6xl">Messages</h1>

      {errorMessage ? (
        <div className="alert-error mt-6" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <p className="mt-6 font-semibold">Chargement de tes conversations...</p>
      ) : conversations.length === 0 ? (
        <section className="card mt-8 p-10 text-center" role="alert">
          <img
            src="/illustrations/smartphones.svg"
            alt=""
            width="112"
            height="112"
            className="mx-auto size-28 -rotate-6"
          />
          <h2 className="mt-4 text-2xl">Aucune conversation pour le moment</h2>
          <p className="mt-2 font-semibold text-ink-soft">
            Contacte un vendeur depuis une annonce pour démarrer une discussion.
          </p>
        </section>
      ) : (
        <div className="mt-8 grid overflow-hidden rounded-(--radius-card) bg-white text-ink brutal md:grid-cols-[320px_1fr]">
          <ul
            className="border-b-3 border-ink md:border-r-3 md:border-b-0"
            aria-label="Conversations"
          >
            {conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(
                conversation,
                user.id,
              );
              const lastMessage =
                conversation.messages[conversation.messages.length - 1];
              const isActive = conversation._id === activeConversation?._id;
              const { tint } = getCategoryStyle(conversation.product?.category);

              return (
                <li key={conversation._id}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 border-b-2 border-ink p-4 text-left ${
                      isActive ? "bg-yellow text-ink" : "hover:bg-cream"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() =>
                      setSearchParams({ conversationId: conversation._id })
                    }
                  >
                    <span
                      className={`grid size-12 shrink-0 place-items-center rounded-xl border-2 border-ink ${tint}`}
                    >
                      <img
                        src={getCategoryIllustration(
                          conversation.product?.category,
                        )}
                        alt=""
                        width="36"
                        height="36"
                        className="size-9"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-extrabold">
                        {otherParticipant?.pseudo}
                      </span>
                      <span className="block truncate text-sm font-semibold opacity-75">
                        {conversation.product?.name}
                      </span>
                      <span className="block truncate text-xs font-medium opacity-75">
                        {lastMessage?.content ?? ""}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <section
            className="flex min-h-[520px] flex-col"
            aria-label="Conversation"
          >
            <header className="flex items-center gap-3 border-b-3 border-ink p-4">
              <span className="grid size-11 place-items-center rounded-full border-2 border-ink bg-lilac font-black text-ink">
                {(
                  getOtherParticipant(activeConversation, user.id)?.pseudo ??
                  "?"
                )
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-sans text-base font-extrabold">
                  {getOtherParticipant(activeConversation, user.id)?.pseudo}
                </h2>
                <p className="truncate text-sm font-semibold opacity-75">
                  {activeConversation.product?.name}
                </p>
              </div>
              {activeConversation.product?._id ? (
                <Link
                  to={`/product/${activeConversation.product._id}`}
                  className="btn-white ml-auto !py-2 text-sm"
                >
                  Voir l&apos;annonce
                </Link>
              ) : null}
            </header>

            <div
              className="flex-1 bg-cream p-6"
              role="log"
              aria-label="Messages"
            >
              <ol className="flex flex-col gap-4">
                {activeConversation.messages.map((message) => {
                  const isMine = message.sender === user.id;
                  return (
                    <li
                      key={message._id}
                      className={`max-w-md rounded-2xl border-2 border-ink px-4 py-3 text-ink shadow-brutal-sm ${
                        isMine
                          ? "self-end rounded-br-sm bg-pink"
                          : "self-start rounded-bl-sm bg-white"
                      }`}
                    >
                      <p className="font-semibold">{message.content}</p>
                      <p className="mt-1 text-right text-xs font-bold">
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <form
              className="flex gap-3 border-t-3 border-ink p-4"
              onSubmit={handleMessageSubmit}
            >
              <label htmlFor="message-draft" className="sr-only">
                Ton message
              </label>
              <input
                id="message-draft"
                type="text"
                className="field"
                placeholder="Écrire un message..."
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
              />
              <button type="submit" className="btn-ink" aria-label="Envoyer">
                <Send className="size-5" aria-hidden="true" />
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Messages;
