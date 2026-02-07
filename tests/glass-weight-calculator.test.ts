import { render, fireEvent, screen, cleanup } from "@testing-library/svelte";
import { describe, it, expect, afterEach } from "vitest";
import Page from "../src/routes/ren/glass-weight-calculator/+page.svelte";

describe("Glass Weight Calculator", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with default empty state", () => {
    render(Page);

    expect(screen.getByText("Glass Weight Calculator")).toBeInTheDocument();
    expect(screen.getByTestId("imperial-panel")).toBeInTheDocument();
    expect(screen.getByTestId("metric-panel")).toBeInTheDocument();
  });

  it("shows imperial panel by default on mobile toggle", () => {
    render(Page);

    const imperialTab = screen.getByTestId("imperial-tab");
    const metricTab = screen.getByTestId("metric-tab");

    expect(imperialTab).toHaveAttribute("aria-selected", "true");
    expect(metricTab).toHaveAttribute("aria-selected", "false");
  });

  it("switches to metric panel when metric tab is clicked", async () => {
    render(Page);

    const metricTab = screen.getByTestId("metric-tab");
    await fireEvent.click(metricTab);

    expect(metricTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("imperial-tab")).toHaveAttribute("aria-selected", "false");
  });

  it("calculates imperial weight when dimensions and thickness are provided", async () => {
    render(Page);

    const lengthInput = screen.getByTestId("imperial-length");
    const widthInput = screen.getByTestId("imperial-width");
    const thicknessSelect = screen.getByTestId("imperial-thickness-0");

    await fireEvent.input(lengthInput, { target: { value: "48" } });
    await fireEvent.input(widthInput, { target: { value: "36" } });
    await fireEvent.change(thicknessSelect, { target: { value: "0.25" } });

    const weightCell = screen.getByTestId("imperial-weight-0");
    const totalCell = screen.getByTestId("imperial-total");

    // 48 × 36 × 0.25 × 158 / 1728 = 39.5 → rounds to 40
    expect(weightCell).toHaveTextContent("40");
    expect(totalCell).toHaveTextContent("40");
  });

  it("calculates metric weight when dimensions and thickness are provided", async () => {
    render(Page);

    const lengthInput = screen.getByTestId("metric-length");
    const widthInput = screen.getByTestId("metric-width");
    const thicknessSelect = screen.getByTestId("metric-thickness-0");

    await fireEvent.input(lengthInput, { target: { value: "1000" } });
    await fireEvent.input(widthInput, { target: { value: "1000" } });
    await fireEvent.change(thicknessSelect, { target: { value: "10" } });

    const weightCell = screen.getByTestId("metric-weight-0");
    const totalCell = screen.getByTestId("metric-total");

    // 1000 × 1000 × 10 × 2531 / 1e9 = 25.31 → rounds to 25
    expect(weightCell).toHaveTextContent("25");
    expect(totalCell).toHaveTextContent("25");
  });

  it("sums multiple lites correctly", async () => {
    render(Page);

    const lengthInput = screen.getByTestId("imperial-length");
    const widthInput = screen.getByTestId("imperial-width");
    const thickness0 = screen.getByTestId("imperial-thickness-0");
    const thickness1 = screen.getByTestId("imperial-thickness-1");

    await fireEvent.input(lengthInput, { target: { value: "48" } });
    await fireEvent.input(widthInput, { target: { value: "36" } });
    await fireEvent.change(thickness0, { target: { value: "0.25" } }); // ~40 lbs
    await fireEvent.change(thickness1, { target: { value: "0.375" } }); // ~59 lbs

    const totalCell = screen.getByTestId("imperial-total");

    // 40 + 59 = 99
    expect(totalCell).toHaveTextContent("99");
  });

  it("clears imperial table when clear button is clicked", async () => {
    render(Page);

    const lengthInput = screen.getByTestId("imperial-length") as HTMLInputElement;
    const widthInput = screen.getByTestId("imperial-width") as HTMLInputElement;
    const thicknessSelect = screen.getByTestId("imperial-thickness-0") as HTMLSelectElement;

    await fireEvent.input(lengthInput, { target: { value: "48" } });
    await fireEvent.input(widthInput, { target: { value: "36" } });
    await fireEvent.change(thicknessSelect, { target: { value: "0.25" } });

    expect(lengthInput.value).toBe("48");

    const clearButton = screen.getAllByRole("button", { name: "Clear Table" })[0];
    await fireEvent.click(clearButton);

    expect(lengthInput.value).toBe("");
    expect(widthInput.value).toBe("");
    expect(screen.getByTestId("imperial-total")).toHaveTextContent("0");
  });

  it("shows 0 weight when no thickness is selected", () => {
    render(Page);

    // All weight cells should show 0 by default
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`imperial-weight-${i}`)).toHaveTextContent("0");
      expect(screen.getByTestId(`metric-weight-${i}`)).toHaveTextContent("0");
    }
  });

  it("shows 0 weight when dimensions are missing", async () => {
    render(Page);

    // Only set thickness, no dimensions
    const thicknessSelect = screen.getByTestId("imperial-thickness-0");
    await fireEvent.change(thicknessSelect, { target: { value: "0.25" } });

    expect(screen.getByTestId("imperial-weight-0")).toHaveTextContent("0");
  });

  it("has accessible labels for all inputs", () => {
    render(Page);

    expect(screen.getByLabelText("Length in inches")).toBeInTheDocument();
    expect(screen.getByLabelText("Width in inches")).toBeInTheDocument();
    expect(screen.getByLabelText("Length in millimeters")).toBeInTheDocument();
    expect(screen.getByLabelText("Width in millimeters")).toBeInTheDocument();
    // "Lite 1 thickness" appears twice (imperial and metric), so use getAllByLabelText
    expect(screen.getAllByLabelText("Lite 1 thickness")).toHaveLength(2);
  });

  it("displays density constants", () => {
    render(Page);

    expect(screen.getByText(/158 lb\/ft³/)).toBeInTheDocument();
    expect(screen.getByText(/2531 kg\/m³/)).toBeInTheDocument();
  });
});
