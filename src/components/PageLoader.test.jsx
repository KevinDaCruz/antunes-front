import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageLoader from "./PageLoader";

describe("PageLoader", () => {
  it("announces the loading state to assistive technology", () => {
    render(<PageLoader />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Chargement en cours…")).toBeInTheDocument();
  });
});
