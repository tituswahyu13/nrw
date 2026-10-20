import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getWilayah, searchPelanggan } from "@/lib/queries";
import DashboardClient from "@/components/DashboardClient";

export const instant = false;

interface PageProps {
  searchParams: Promise<{
    no_pdam?: string;
    kel?: string;
    rw?: string;
    page?: string;
  }>;
}

export default async function HomePage(props: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const sp = await props.searchParams;
  const noPdam = (sp.no_pdam || "").trim();
  const kel = sp.kel ? parseInt(sp.kel, 10) : null;
  const rw = sp.rw ? parseInt(sp.rw, 10) : null;
  const page = sp.page ? Math.max(1, parseInt(sp.page, 10)) : 1;

  const [kelurahanList, searchResult] = await Promise.all([
    getWilayah(),
    searchPelanggan(noPdam, kel, rw, page),
  ]);

  return (
    <DashboardClient
      user={user}
      kelurahanList={kelurahanList}
      searchResult={searchResult}
      noPdam={noPdam}
      kel={kel}
      rw={rw}
      page={page}
    />
  );
}
