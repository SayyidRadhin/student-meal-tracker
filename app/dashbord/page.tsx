"use client";
import React, { useEffect, useState } from "react";
import Slidbar from "@/components/slidbar";
import Nav from "@/components/nav";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { TableMembers } from "@/components/table-members";
import { LucideUserCog2, UserRoundCogIcon } from "lucide-react";
import { auth, db } from "@/lib/firebaseconfig";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useColumns } from "./member-column";
import { Card } from "@/components/ui/card";
import { onAuthStateChanged } from "firebase/auth";
import { isAdmin } from "@/lib/adminCheck";

export type UserData = {
  id: string;
  name: string;
  class?: string;
  number: string;
  coverImage: string;
  isreturned: boolean;
};

function Page() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [absentCount, setAbsentCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const [docs, loading, error] = useCollection(
    query(collection(db, "students"))
  );
  const router = useRouter();

  const columns = useColumns();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminUser(isAdmin(user.uid));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!docs) return;

    const userData: UserData[] = docs.docs
      .filter((doc) => !doc.data().return)
      .map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        number: doc.data().number,
        class: doc.data().class,
        coverImage: doc.data().coverImage,
        isreturned: doc.data().isreturn,
      }));
    setUsers(userData);

    // Fetch absent and present counts
    const fetchCounts = async () => {
      try {
        const absentQuery = query(
          collection(db, "students"),
          where("isreturn", "==", false)
        );
        const presentQuery = query(
          collection(db, "students"),
          where("isreturn", "==", true)
        );

        const absentSnapshot = await getCountFromServer(absentQuery);
        const presentSnapshot = await getCountFromServer(presentQuery);

        setAbsentCount(absentSnapshot.data().count);
        setPresentCount(presentSnapshot.data().count);
      } catch (error) {
        console.error("Error fetching counts: ", error);
      }
    };

    fetchCounts();
  }, [docs]);

  const onClick = () => {
    router.push("/dashbord/addstudents");
  };

  return (
    <>
      <Nav />
      <div className="w-full max-h-screen min-h-screen flex pt-[5.1em] dark:bg-[#0B1120]">
        <Slidbar />
        <div className="hero w-full py-3 px-4 sm:px-8 pt-[5em] md:mt-4 overflow-auto scrollbar-hide no-scrollbar">
          <div className="header rounded-md flex py-2 px-4 items-center justify-between bg-blue-950 w-full mb-2 gap-2 text-white select-none">
            <div className="flex gap-2 py-2">
              <UserRoundCogIcon className="text-xl" />
              <h3 className="text-xl">Members</h3>
            </div>
            {isAdminUser && (
              <Button variant={"default"} className="bg-" onClick={onClick}>
                Add Students
              </Button>
            )}
          </div>
          <div className="flex gap-2  max-sm:text-base">
            <Card className="p-4 w-full font-medium text-slate-600">
              Present: {presentCount}
            </Card>
            <Card className="p-4 w-full text-slate-600">
              Absent: {absentCount}
            </Card>
          </div>
          <TableMembers columns={columns} data={users} />
        </div>
      </div>
    </>
  );
}

export default Page;
