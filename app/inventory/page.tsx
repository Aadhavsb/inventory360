import type { Metadata } from "next";
import InventoryPage from './ui';

export const metadata: Metadata = {
  title: "Asset Inventory - Wildlife SOS Conservation Dashboard",
  description: "Manage and track conservation assets across Wildlife SOS rescue centers. View medical supplies, equipment, and resources with real-time updates.",
};

export default function Page() {
  return <InventoryPage user={{}} />;
}
