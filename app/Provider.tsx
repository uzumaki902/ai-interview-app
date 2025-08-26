"use client";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import React, { useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { createConnection } from "net";

const Provider = ({ children }: any) => {
  const { user } = useUser();
  const createUserMutation = useMutation(api.users.CreateNewUser);
  const [userDetail, setUserDetail] = useState<any>()
  useEffect(() => {
    const createUserIfNeeded = async () => {
      if (user) {
        const result = await createUserMutation({
          email: user?.primaryEmailAddress?.emailAddress ?? "",
          imageUrl: user?.imageUrl ?? "",
          name: user?.fullName ?? "",
        });
        console.log(result)
        setUserDetail(result)
      }
    };

    createUserIfNeeded();
  }, [user, createUserMutation]);

  return <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
    <div>{children}</div>;
  </UserDetailContext.Provider>

};

export default Provider;
