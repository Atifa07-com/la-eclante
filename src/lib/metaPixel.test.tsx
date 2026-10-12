import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Link, MemoryRouter, useLocation } from "react-router-dom";
import { useMetaPixelPageView } from "./metaPixel";

function RouteProbe() {
  useMetaPixelPageView();
  const location = useLocation();

  return (
    <>
      <span>{location.pathname}</span>
      <Link to="/shop">Shop</Link>
    </>
  );
}

afterEach(() => {
  cleanup();
  delete window.fbq;
});

describe("useMetaPixelPageView", () => {
  it("tracks the initial route and client-side navigation", async () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(
      <MemoryRouter initialEntries={["/"]}>
        <RouteProbe />
      </MemoryRouter>,
    );

    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenNthCalledWith(1, "track", "PageView");

    fireEvent.click(screen.getByRole("link", { name: "Shop" }));

    await waitFor(() => expect(fbq).toHaveBeenCalledTimes(2));
    expect(fbq).toHaveBeenNthCalledWith(2, "track", "PageView");
  });

  it("silently skips tracking when fbq is unavailable", () => {
    expect(() =>
      render(
        <MemoryRouter initialEntries={["/"]}>
          <RouteProbe />
        </MemoryRouter>,
      ),
    ).not.toThrow();
  });
});