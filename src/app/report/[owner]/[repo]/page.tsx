import { ReportPage } from "@/components/report-page";

export default function Page({
  params,
}: {
  params: { owner: string; repo: string };
}) {
  return <ReportPage owner={params.owner} repo={params.repo} />;
}
