import { toUsername } from "@/lib/string";
import { describe, expect, it } from "vitest";

describe("toUsername", () => {
  it("should convert a name to a username", () => {
    expect(toUsername("John Doe")).toBe("john.doe");
  });

  it("should convert a name with a middle name to a username", () => {
    expect(toUsername("John Michael Doe")).toBe("john.michael.doe");
  });

  it("should convert a name with a suffix to a username", () => {
    expect(toUsername("John Doe Jr.")).toBe("john.doe.jr");
  });

  it("should convert a name with a prefix to a username", () => {
    expect(toUsername("Mr. John Doe")).toBe("mr.john.doe");
  });

  it("should convert a name with a prefix and suffix to a username", () => {
    expect(toUsername("Mr. John Doe Jr.")).toBe("mr.john.doe.jr");
  });
});
