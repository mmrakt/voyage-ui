import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChatInput } from "./chat-input";

const getInput = () =>
  screen.getByPlaceholderText("メッセージを入力してください...");

const getSubmitButton = () => screen.getByRole("button", { name: "送信" });

const setup = (props: { disabled?: boolean } = {}) => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ChatInput onSubmit={onSubmit} {...props} />);
  return { user, onSubmit };
};

describe("ChatInput", () => {
  it("renders input with placeholder", () => {
    setup();
    expect(getInput()).toBeInTheDocument();
  });

  it("renders submit button", () => {
    setup();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it("calls onSubmit with message when form is submitted", async () => {
    const { user, onSubmit } = setup();

    await user.type(getInput(), "こんにちは");
    await user.click(getSubmitButton());

    expect(onSubmit).toHaveBeenCalledWith("こんにちは");
  });

  it("does not call onSubmit when input is empty", async () => {
    const { user, onSubmit } = setup();

    await user.click(getSubmitButton());

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("clears input after successful submission", async () => {
    const { user } = setup();
    const input = getInput();

    await user.type(input, "テストメッセージ");
    await user.click(getSubmitButton());

    expect(input).toHaveValue("");
  });

  it("disables input and button when disabled prop is true", () => {
    setup({ disabled: true });

    expect(getInput()).toBeDisabled();
    expect(getSubmitButton()).toBeDisabled();
  });

  it("does not call onSubmit when disabled even with valid input", async () => {
    const { user, onSubmit } = setup({ disabled: true });

    await user.type(getInput(), "テスト");
    await user.click(getSubmitButton());

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits form on Enter key press", async () => {
    const { user, onSubmit } = setup();

    await user.type(getInput(), "Enterで送信{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("Enterで送信");
  });
});
