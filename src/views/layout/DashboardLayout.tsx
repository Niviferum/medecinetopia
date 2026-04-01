"use client";

import { useState } from "react";
import { Topbar, type DashboardTab } from "./Topbar";
import { Background } from "./Background";
import { LeftColumn } from "@/views/dashboard/LeftColumn";
import { CenterColumn } from "@/views/dashboard/CenterColumn";
import { RightColumn } from "@/views/dashboard/RightColumn";
import type { User } from "@/types";

interface DashboardLayoutProps {
  user: User;
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("revisions");

  return (
    <>
      <Background />

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

        <main
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "220px 1fr 188px",
            gap: 12,
            padding: 16,
            alignItems: "start",
          }}
        >
          <LeftColumn user={user} />
          <CenterColumn activeTab={activeTab} />
          <RightColumn />
        </main>
      </div>
    </>
  );
}
