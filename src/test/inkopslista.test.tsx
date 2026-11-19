import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// The shopping list has no "Köpt" category: a ticked item leaves the list, and an
// item marked used in Mitt kök lands in "Att köpa" instead.
async function renderPage(path: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient: new QueryClient() },
  });
  await router.load();
  render(<RouterProvider router={router} />);
}

describe("Inköpslista", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows only Att köpa and Handla igen — no Köpt category", async () => {
    await renderPage("/inkopslista");

    expect(await screen.findByRole("heading", { name: "Att köpa" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Handla igen" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Köpt" })).toBeNull();
  });

  it("ticking an item takes it out of the list", async () => {
    await renderPage("/inkopslista");

    fireEvent.click(await screen.findByRole("checkbox", { name: "Bröd" }));

    await waitFor(() => expect(screen.queryByRole("checkbox", { name: "Bröd" })).toBeNull());
    expect(screen.getByRole("checkbox", { name: "Kaffe" })).toBeInTheDocument();
  });

  it("marking an item used in Mitt kök puts it in the shopping list", async () => {
    await renderPage("/kok");

    fireEvent.click(await screen.findByRole("button", { name: "Markera Mjölk som använd" }));

    const stored = JSON.parse(localStorage.getItem("stocked-v1") ?? '{"shop":[]}');
    expect(stored.shop.some((s: { name: string }) => s.name === "Mjölk")).toBe(true);
  });
});
