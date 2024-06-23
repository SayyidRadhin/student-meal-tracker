import React, { useEffect, useState } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Student = {
  id: string;
  name: string;
  isreturn: boolean;
};

type StudentSelectorProps = {
  selectedStudents: Student[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<Student[]>>;
};

const StudentSelector: React.FC<StudentSelectorProps> = ({
  selectedStudents,
  setSelectedStudents,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      const q = query(collection(db, "students"), where("isreturn", "==", true));
      const querySnapshot = await getDocs(q);
      const fetchedStudents: Student[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        isreturn: doc.data().isreturn,
      }));
      setStudents(fetchedStudents);
    };

    fetchStudents();
  }, []);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudents((prevStudents) =>
      prevStudents.some((s) => s.id === student.id)
        ? prevStudents.filter((s) => s.id !== student.id)
        : [...prevStudents, student]
    );
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Input
        className="mb-3"
        type="text"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
        <TableCaption>A list of students.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="flex justify-center">
                <input
                  type="checkbox"
                  checked={selectedStudents.some((s) => s.id === student.id)}
                  onChange={() => handleSelectStudent(student)}
                />
              </TableCell>
              <TableCell>{student.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentSelector;
