"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import syncUser from "@/app/actions/syncUser";

const UserSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    syncUser().catch((err) => console.error("syncUser failed", err));
  }, [isLoaded, user]);

  return null;
};

export default UserSync;
