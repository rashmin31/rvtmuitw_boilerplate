import { resolveTenant } from "@modules";

const createLocation = (hostname: string, search = "") =>
  ({ hostname, search } as Location);

describe("TenantResolver", () => {
  it("resolves by subdomain", () => {
    const tenant = resolveTenant(createLocation("demo.app.com"));
    expect(tenant.tenantId).toBe("demo");
  });

  it("resolves by domain", () => {
    const tenant = resolveTenant(createLocation("avadh.local"));
    expect(tenant.tenantId).toBe("avadh");
  });

  it("resolves by query param", () => {
    const tenant = resolveTenant(createLocation("localhost", "?tenant=demo"));
    expect(tenant.tenantId).toBe("demo");
  });
});
