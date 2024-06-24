/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import "../../../styles/signup.css";
import { db, storage } from "@/lib/firebaseconfig";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

type Student = {
  image: File | null;
  name: string;
  number: string;
  class: string;
  place: string;
  isreturn: boolean;
};

type EditStudent = {
  id: string;
  coverImage: string;
  name: string;
  number: string;
  class: string;
  place: string;
  isreturn: boolean;
};

function Page() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EditStudent | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [student, setStudent] = useState<Student>({
    name: "",
    number: "",
    class: "",
    place: "",
    isreturn: true,
    image: null,
  });

  const searchParams = useSearchParams();
  const param = searchParams.get("id") as string;

  useEffect(() => {
    if (param) {
      const docRef = doc(db, "students", param);

      getDoc(docRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const dataWithId = {
              id: docSnapshot.id,
              ...docSnapshot.data(),
            } as EditStudent;
            setData(dataWithId);
            setStudent({
              name: dataWithId.name || "",
              number: dataWithId.number || "",
              class: dataWithId.class || "",
              place: dataWithId.place || "",
              isreturn: dataWithId.isreturn || true,
              image: null,
            });
          } else {
            console.log("Document does not exist");
          }
        })
        .catch((error) => {
          console.error("Error fetching document:", error);
        });
    }
  }, [param]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      setImage(image);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrlStudent = data?.coverImage;

    if (image) {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/students/${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrlStudent = await getDownloadURL(storageRef);
    }

    // Update student data in Firestore
    const docRef = doc(db, "students", param);

    await updateDoc(docRef, {
      name: student.name,
      number: student.number,
      class: student.class,
      place: student.place,
      isreturn: student.isreturn,
      coverImage: image ? imageUrlStudent : data?.coverImage,
    });

    // Reset form after submission
    setStudent({
      name: "",
      number: "",
      class: "",
      place: "",
      isreturn: true,
      image: null,
    });
    setImage(null);
    setLoading(false);
  };

  if (!param) {
    return <div>Error: No student ID provided.</div>;
  }

  return (
    <div>
      <section className="sign-up-page">
        <div className="container">
          <div className="signup-form">
            <div className="form-title">
              Edit Student Data <span></span>
            </div>
            <Card>
              <form className="signup-form-form py-2" onSubmit={handleSubmit}>
                <div className="my-4">
                  <label htmlFor="profile-picture" className="cursor-pointer">
                    <Image
                      src={image ? URL.createObjectURL(image) : data?.coverImage || "/download.png"}
                      alt=""
                      width={128}
                      height={128}
                      className="mx-auto rounded-full w-32 h-32 object-cover cursor-pointer bg-slate-700"
                    />
                  </label>
                  <h1 className="text-xl mt-4 font-bold px-3">
                    Edit <span className="text-slate-500">Student</span>
                  </h1>
                  <p className="text-slate-500 text-xs mb-5 text-center">
                    Update details of the student
                  </p>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="form-group">
                  <Input
                    required
                    type="text"
                    className="py-6"
                    placeholder="Name"
                    value={student.name}
                    name="name"
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <Input
                    required
                    type="text"
                    className="py-6"
                    placeholder="Phone Number"
                    value={student.number}
                    name="number"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Input
                    required
                    type="text"
                    className="py-6"
                    placeholder="Class"
                    value={student.class}
                    name="class"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <Input
                    required
                    type="text"
                    className="py-6"
                    placeholder="Place"
                    value={student.place}
                    name="place"
                    onChange={handleChange}
                  />
                </div>
                <button
                  className={`button ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="spinner-border spinner-border-sm text-light mr-2" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      Loading...
                    </div>
                  ) : (
                    "Edit"
                  )}
                </button>
                <p className="sign-up-terms">
                  By clicking the button, you are agreeing to our{" "}
                  <span>Terms and Services</span>{" "}
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
