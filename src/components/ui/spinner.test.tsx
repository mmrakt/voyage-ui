import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("renders default loading text", () => {
    render(<Spinner />);
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("renders custom loading text", () => {
    render(<Spinner text="検索中..." />);
    expect(screen.getByText("検索中...")).toBeInTheDocument();
  });
});
