"use client"
import React, { useState, useEffect } from "react";
import { addDoc, collection, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";
import { Button } from "@/components/ui/button";
import StudentSelector from "@/components/StudentSelector";
import calculateMissedMeals from "@/lib/missedMeals";
import { Input } from "@/components/ui/input";
import { UserCircle } from "lucide-react";
import Slidbar from "@/components/slidbar";
import Nav from "@/components/nav";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { isAdmin } from "@/lib/adminCheck";

type Student = {
  id: string;
  name: string;
  isreturn: boolean;
};

const Page = () => {
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [reason, setReason] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [disable, setDisable] = useState(true);
  const [initialArrivalTime, setInitialArrivalTime] = useState("");

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

  const formatDates = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  const handleLeave = async () => {
    setDisable(true);

    const formattedDeparture = new Date(departureTime);
    const formattedArrival = new Date(arrivalTime);

    try {
      for (const student of selectedStudents) {
        const missedMeals = calculateMissedMeals(formattedDeparture, formattedArrival);

        await addDoc(collection(db, "leaves"), {
          studentId: student.id,
          studentname: student.name,
          reason,
          isreturn: false,
          departureTime: formattedDeparture,
          arrivalTime: formattedArrival,
        });

        await addDoc(collection(db, "missed"), {
          studentId: student.id,
          missedMeals: missedMeals,
          serverTimestamp: serverTimestamp(),
        });

        const studentDocRef = doc(db, "students", student.id);
        await updateDoc(studentDocRef, { isreturn: false });
      }

      // Reset form and selected students
      setReason("");
      setDepartureTime("");
      setArrivalTime("");
      setSelectedStudents([]);
      setDisable(false);
      router.push("/dashbord");  
      } catch (error) {
      console.error("Error adding leave records: ", error);
    }
  };

  useEffect(() => {
    // Set current date and time if not defined
    if (!departureTime) {
      const now = new Date();
      setDepartureTime(formatDate(now));
      setArrivalTime(formatDate(now));
      setInitialArrivalTime(formatDate(now)); // Set initial arrival time
    }
  }, [departureTime]);

  useEffect(() => {
    setDisable(
      !(
        reason.trim() !== "" &&
        arrivalTime !== "" &&
        arrivalTime !== initialArrivalTime
      )
    );
  }, [reason, arrivalTime, initialArrivalTime]);

  if (isCheckingAdmin) {
    return <p>Loading...</p>; // Loading state while checking admin status
  }

  if (!currentUser || !isAdminUser) {
    router.push("/dashbord"); // Redirect non-admin users
    return null; // Avoid rendering the page content while redirecting
  }

  return (
    <section className="dashboard w-full max-h-screen min-h-screen flex">
      <Nav />

      <div className="flex-[6] flex pt-[5.2em] max-w-[100vw] sm:mt-0 dark:bg-[#0B1120]">
        <Slidbar />
        <div className="hero w-full py-3 px-4 sm:px-8 pt-[5em] md:mt-4 overflow-auto scrollbar-hide no-scrollbar">
          <div className="header rounded-md flex p-4 bg-blue-950 w-full mb-2 gap-2 text-white select-none">
            <UserCircle className="text-xl" />
            <h3 className="text-xl">select multiple</h3>
          </div>
          <div className="flex gap-2 w-full">
            <div className="grid py-4 gap-2 w-full">
              <Input
                type="text"
                placeholder="Student Reason"
                autoFocus
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              <div>
                <Input
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="datetime-local"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  required
                />
              </div>
              <Button
                onClick={handleLeave}
                className={`mt-8 ${disable ? "bg-slate-400" : ""}`}
                disabled={disable}
              >
                Leave
              </Button>
            </div>
          </div>
          <StudentSelector
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
