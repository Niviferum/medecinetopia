"use client";

import { useState } from "react";
import { Topbar, type DashboardTab } from "./Topbar";
import { Background } from "./Background";
import { LeftColumn } from "@/views/dashboard/LeftColumn";
import { CenterColumn } from "@/views/dashboard/CenterColumn";
import { RightColumn } from "@/views/dashboard/RightColumn";
import { Clock } from "@/views/ui/Clock";
import { DuckWidget } from "@/views/ui/DuckWidget";
import type { User } from "@/types";

interface DashboardLayoutProps {
  user: User;
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("revisions");

  return (
    <>
      <Background />
      <Clock />
      <DuckWidget />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Topbar
          username={user.username ?? "Jade"}
          avatarUrl={user.avatar_url}
          streak={user.streak}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="dashboard-grid">
          <LeftColumn user={user} />
          <CenterColumn activeTab={activeTab} />
          <div className="dashboard-right">
            <RightColumn />
          </div>
        </main>
      </div>
    </>
  );
}
