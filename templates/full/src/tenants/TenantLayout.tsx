import { BaseLayout } from "@tenants";
import { DemoLayout } from "@tenants";
import { AvadhLayout } from "@tenants";
import { useTenant } from "@modules";

export const TenantLayout = () => {
  const { tenant } = useTenant();
  switch (tenant.layoutKey) {
    case "demo":
      return <DemoLayout />;
    case "avadh":
      return <AvadhLayout />;
    default:
      return <BaseLayout />;
  }
};
