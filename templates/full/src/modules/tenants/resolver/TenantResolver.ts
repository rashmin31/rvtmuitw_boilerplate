import { tenantConfigs } from "./tenantData";

const getSubdomain = (hostname: string) => {
  const parts = hostname.split(".");
  if (parts.length <= 2) return undefined;
  return parts[0];
};

export const resolveTenant = (location: Location) => {
  const hostname = location.hostname;
  const subdomain = getSubdomain(hostname);
  if (subdomain) {
    const match = tenantConfigs.find((tenant) => tenant.tenantId === subdomain);
    if (match) return match;
  }
  const domainMatch = tenantConfigs.find((tenant) => tenant.domains.includes(hostname));
  if (domainMatch) return domainMatch;
  const params = new URLSearchParams(location.search);
  const tenantParam = params.get("tenant");
  if (tenantParam) {
    return tenantConfigs.find((tenant) => tenant.tenantId === tenantParam) ?? tenantConfigs[0];
  }
  return tenantConfigs[0];
};
