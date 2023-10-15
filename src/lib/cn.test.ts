import cn from "@/lib/cn";
import { describe, expect, it } from "vitest";

describe("cn", () => {
  it("should join classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should filter out falsy classes", () => {
    const thing = false;
    expect(cn("foo", thing && "foobar", "bar")).toBe("foo bar");
  });

  it("should filter out undefined classes", () => {
    expect(cn("foo", undefined, "bar")).toBe("foo bar");
  });

  it("should filter out null classes", () => {
    expect(cn("foo", null, "bar")).toBe("foo bar");
  });

  it("should filter out empty string classes", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });

  it("should filter out zero classes", () => {
    expect(cn("foo", 0, "bar")).toBe("foo bar");
  });

  it("should filter out NaN classes", () => {
    expect(cn("foo", NaN, "bar")).toBe("foo bar");
  });

  it("should filter out true classes", () => {
    expect(cn("foo", true, "bar")).toBe("foo bar");
  });
});
