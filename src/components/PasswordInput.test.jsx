import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import PasswordInput from "./PasswordInput";

describe("PasswordInput", () => {
  it("hides the value by default", () => {
    render(<PasswordInput id="password" value="secret" onChange={() => {}} />);

    expect(document.getElementById("password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(
      screen.getByRole("button", { name: "Afficher le mot de passe" }),
    ).toBeInTheDocument();
  });

  it("reveals and hides the value when the toggle button is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordInput id="password" value="secret" onChange={() => {}} />);

    const toggleButton = screen.getByRole("button", {
      name: "Afficher le mot de passe",
    });
    await user.click(toggleButton);

    expect(document.getElementById("password")).toHaveAttribute(
      "type",
      "text",
    );
    expect(
      screen.getByRole("button", { name: "Masquer le mot de passe" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Masquer le mot de passe" }),
    );

    expect(document.getElementById("password")).toHaveAttribute(
      "type",
      "password",
    );
  });
});
