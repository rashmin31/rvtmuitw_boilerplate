import { can } from "@modules";

describe("RBAC can", () => {
  it("returns true when permission present", () => {
    expect(can(["users:read"], "users:read")).toBe(true);
  });

  it("returns false when permission missing", () => {
    expect(can(["users:read"], "users:invite")).toBe(false);
  });
});
