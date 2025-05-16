"use client";

import SideBar from "@/components/SideBar";
import withAuth from "@/components/withAuth";

function Dashboard() {
  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1">
        <div className="p-4">Placeholder page</div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
