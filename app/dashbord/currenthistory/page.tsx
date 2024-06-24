"use client";
import React, { useEffect, useState } from 'react';
import Slidbar from "@/components/slidbar";
import Nav from "@/components/nav";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, updateDoc, getDocs, getDoc, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseconfig';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { PhoneCallIcon, UserRoundCogIcon } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { onAuthStateChanged } from 'firebase/auth';
import { isAdmin } from '@/lib/adminCheck';

export type LeaveData = {
  studentId: string;
  studentname: string;
  reason: string;
  departureTime: any;
  arrivalTime: any;
  isreturn: boolean;
};

function Page() {
  const [leaves, setLeaves] = useState<LeaveData[]>([]);
  const [docs, loading, error] = useCollection(
    query(collection(db, "leaves"), where("isreturn", "==", false))
  );
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const adminCheck = await isAdmin(user.uid);
        setIsAdminUser(adminCheck);
      } else {
        setIsAdminUser(false);
      }
      setIsCheckingAdmin(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!docs) return;

    const leaveData: LeaveData[] = docs.docs.map((doc) => {
      const data = doc.data() as LeaveData;
      return {
        studentId: data.studentId,
        studentname: data.studentname,
        reason: data.reason,
        departureTime: data.departureTime,
        arrivalTime: data.arrivalTime,
        isreturn: data.isreturn,
      };
    });

    setLeaves(leaveData);
  }, [docs]);

  const handleApproveReturn = async (studentId: string) => {
    try {
      // Update the leave record's return status to true
      const docRef = doc(db, "students", studentId);
      await updateDoc(docRef, { isreturn: true });
      const leaveQuery = query(
        collection(db, "leaves"),
        where("studentId", "==", studentId),
        where("isreturn", "==", false)
      );
      const leaveSnapshot = await getDocs(leaveQuery);
      if (!leaveSnapshot.empty) {
        const leaveDoc = leaveSnapshot.docs[0]; // There should be only one document that matches this condition
        const leaveDocRef = doc(db, "leaves", leaveDoc.id);

        // Update the leave record's return status to true
        const currentTime = new Date();

        await updateDoc(leaveDocRef, {
          isreturn: true,
          arrivalTime: currentTime,
        });
      }

      // Deleting document from "missed" collection
      const missedQuery = query(
        collection(db, "missed"),
        where("studentId", "==", studentId),
        orderBy("serverTimestamp", "desc"),
        limit(1)
      );
      const missedSnapshot = await getDocs(missedQuery);
      if (!missedSnapshot.empty) {
        const missedDoc = missedSnapshot.docs[0];
        await deleteDoc(doc(db, "missed", missedDoc.id));
        setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave.studentId !== studentId));
      }
    } catch (error) {
      console.error("Error updating return status: ", error);
    }
  };

  const handleCall = async (studentId: string) => {
    try {
      // Fetch the student's document from the students collection using the studentId
      const studentDocRef = doc(db, "students", studentId);
      const studentDoc = await getDoc(studentDocRef);
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const phoneNumber = studentData.number;
        // Initiate the phone call (you can use a tel: link for demonstration purposes)
        window.location.href = `tel:${phoneNumber}`;
      } else {
        console.error("No such student document!");
      }
    } catch (error) {
      console.error("Error fetching student document: ", error);
    }
  };

  if (isCheckingAdmin) {
    return <p>Loading...</p>; // Loading state while checking admin status
  }

  if (!currentUser || !isAdminUser) {
    router.push("/dashbord"); // Redirect non-admin users
    return null; // Avoid rendering the page content while redirecting
  }

  return (
    <>
      <Nav />
      <div className="w-full max-h-screen min-h-screen flex pt-[5.1em] dark:bg-[#0B1120]">
        <Slidbar />
        <div className="hero w-full py-3 px-4 sm:px-8 mt-[5em] md:mt-4 overflow-auto scrollbar-hide no-scrollbar">
          <div className="header rounded-md flex py-2 mb-2 px-4 items-center justify-between bg-blue-950 w-full mb-2 gap-2 text-white select-none">
            <div className='flex gap-2 p-2'>
              <UserRoundCogIcon className='text-xl' />
              <h3 className='text-xl'>Leaved Members</h3>
            </div>
          </div>
          <div className='w-full grid lg:grid-cols-3 md:grid-cols-2 gap-2 '>
            {leaves.map((leave) => (
              <Card key={leave.studentId} className="p-6 flex flex-col">
                
                <h1 className='text-3xl max-sm:text-2xl capitalize text-slate-600 font-bold mb-3 '>{leave.studentname}</h1>
                <div className=' text-slate-700 mb-3 max-md:text-sm'>
                  <p className=''>Reason: {leave.reason}</p>
                  <p>Departured: {leave.departureTime.toDate().toLocaleString()}</p>
                  <p className='mb-2'>Arrival: {leave.arrivalTime.toDate().toLocaleString()}</p>
                </div>
                <div className='flex gap-2 mt-auto max-sm:text-sm '>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="bg-slate-700 px-3 transition-all duration-300 ease-in-out text-white hover:bg-slate-700 hover:box-shadow-search hover:shadow-slate-600 rounded px-2 text-sm sm:text-base font-semibold">
                        Return
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] max-w-[20em] p-8">
                      <DialogHeader className="">
                        <DialogTitle>Did he Return?</DialogTitle>
                        <DialogDescription>Confirm his return.</DialogDescription>
                        <DialogClose asChild>
                          <Button type="submit" onClick={() => handleApproveReturn(leave.studentId)} className="mt-8">
                            Confirm Return
                          </Button>
                        </DialogClose>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={() => handleCall(leave.studentId)} className='font-medium  bg-slate-700'>
                    <PhoneCallIcon className='scale-75' /> <span className='pl-2'>Call</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
