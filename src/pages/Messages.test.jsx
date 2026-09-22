import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../test/test-utils";
import Messages from "./Messages";
import { createApiMock } from "../test/mockApi";
import { DEMO_CONVERSATIONS, DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

const meRoute = {
  method: "GET",
  pattern: /^\/auth\/me$/,
  handler: () => ({ status: 200, json: { user: DEMO_USER } }),
};

const listConversationsRoute = {
  method: "GET",
  pattern: /^\/conversations$/,
  handler: () => ({
    status: 200,
    json: { conversations: DEMO_CONVERSATIONS },
  }),
};

function seedAuthenticatedSession() {
  window.localStorage.setItem(
    "antunes-auth",
    JSON.stringify({ token: FAKE_TOKEN, user: DEMO_USER }),
  );
}

describe("Messages", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      listConversationsRoute,
    ]);
  });

  it("shows the first conversation's thread by default", async () => {
    renderWithProviders(<Messages />);

    expect(
      await screen.findByText("Console Sony PS5 Slim", {
        selector: ".messages-thread-header p",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Salut, elle est toujours disponible ?", {
        selector: ".message-bubble p",
      }),
    ).toBeInTheDocument();
  });

  it("switches thread when selecting another conversation", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Messages />);
    await screen.findByText("Console Sony PS5 Slim", {
      selector: ".messages-thread-header p",
    });

    await user.click(screen.getByRole("button", { name: /PixelStore/ }));

    expect(
      screen.getByText("Je peux l'envoyer demain matin.", {
        selector: ".message-bubble p",
      }),
    ).toBeInTheDocument();
  });

  it("appends a sent message to the active thread", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      listConversationsRoute,
      {
        method: "POST",
        pattern: /^\/conversations\/conversation-1\/messages$/,
        handler: ({ body }) => ({
          status: 201,
          json: {
            conversation: {
              ...DEMO_CONVERSATIONS[0],
              messages: [
                ...DEMO_CONVERSATIONS[0].messages,
                {
                  _id: "message-new",
                  sender: DEMO_USER.id,
                  content: body.content,
                  createdAt: new Date().toISOString(),
                },
              ],
            },
          },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderWithProviders(<Messages />);
    await screen.findByText("Console Sony PS5 Slim", {
      selector: ".messages-thread-header p",
    });

    await user.type(
      screen.getByPlaceholderText("Écrire un message..."),
      "C'est encore dispo ?",
    );
    await user.click(screen.getByRole("button", { name: "Envoyer" }));

    expect(
      await screen.findByText("C'est encore dispo ?", {
        selector: ".message-bubble p",
      }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Écrire un message...")).toHaveValue(
      "",
    );
  });
});
