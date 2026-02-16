"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SalesfitWorkbench from "@/app/components/salesfit-workbench";
import { LOGO_OPTIONS } from "@/app/lib/white-label";

export default function WhiteLabelPage() {
  const searchParams = useSearchParams();
  const tenantName = useMemo(() => {
    const value = String(searchParams.get("empresa") ?? "").trim();
    return value || "Nexo";
  }, [searchParams]);

  const rawLogo = String(searchParams.get("logo") ?? "").trim();
  const logoKey = String(searchParams.get("logoKey") ?? "").trim();

  const [tenantLogo, setTenantLogo] = useState(() => {
    if (rawLogo.startsWith("data:image/")) return rawLogo;
    return LOGO_OPTIONS.includes(rawLogo) ? rawLogo : LOGO_OPTIONS[0];
  });

  useEffect(() => {
    if (!logoKey) return;
    const storedLogo = sessionStorage.getItem(logoKey);
    if (storedLogo?.startsWith("data:image/")) {
      setTenantLogo(storedLogo);
      return;
    }
    setTenantLogo(LOGO_OPTIONS.includes(rawLogo) ? rawLogo : LOGO_OPTIONS[0]);
  }, [logoKey, rawLogo]);

  return <SalesfitWorkbench tenantName={tenantName} tenantLogo={tenantLogo} showBuilder={false} />;
}
