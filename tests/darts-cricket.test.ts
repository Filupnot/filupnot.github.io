import { render, fireEvent, screen, cleanup } from "@testing-library/svelte";
import { describe, it, expect, afterEach, vi } from "vitest";
import { tick } from "svelte";
import Page from "../src/routes/games/darts-cricket/+page.svelte";

describe("Darts Cricket scoreboard", () => {
  afterEach(() => {
    cleanup();
  });

  it("cycles marks on tap", async () => {
    vi.useFakeTimers();
    render(Page);

    const cell = screen.getByLabelText("HOME marks for 20");

    expect(cell.querySelector(".mark-icon")).toBeNull();

    await fireEvent.click(cell);
    await vi.runOnlyPendingTimersAsync();
    expect(cell.querySelector(".mark-icon")).not.toBeNull();

    await fireEvent.click(cell);
    await vi.runOnlyPendingTimersAsync();
    expect(cell.querySelector(".mark-icon")).not.toBeNull();

    await fireEvent.click(cell);
    await vi.runOnlyPendingTimersAsync();
    expect(cell.querySelector(".mark-icon")).not.toBeNull();

    await fireEvent.click(cell);
    await vi.runOnlyPendingTimersAsync();
    expect(cell.querySelector(".mark-icon")).toBeNull();

    vi.useRealTimers();
  });

  it("resets the board", async () => {
    render(Page);

    const cell = screen.getByLabelText("AWAY marks for Bull");
    await fireEvent.click(cell);

    expect(cell.querySelector(".mark-icon")).not.toBeNull();

    const resetButton = screen.getByRole("button", { name: "RESET" });
    await fireEvent.click(resetButton);
    const confirmButton = screen.getByRole("button", { name: "ARE YOU SURE?" });
    await fireEvent.click(confirmButton);

    expect(cell.querySelector(".mark-icon")).toBeNull();
  });

  it("cycles correctly with rapid clicks", async () => {
    vi.useFakeTimers();
    render(Page);

    const cell = screen.getByLabelText("HOME marks for 20");

    cell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    cell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await vi.runOnlyPendingTimersAsync();
    await tick();

    let icon = cell.querySelector("img") as HTMLImageElement | null;
    expect(icon?.getAttribute("src")).toContain("/cricket-two.png");

    cell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await vi.runOnlyPendingTimersAsync();
    await tick();

    icon = cell.querySelector("img") as HTMLImageElement | null;
    expect(icon?.getAttribute("src")).toContain("/cricket-three.png");

    cell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await vi.runOnlyPendingTimersAsync();
    await tick();

    icon = cell.querySelector("img") as HTMLImageElement | null;
    expect(icon).toBeNull();

    vi.useRealTimers();
  });
});
