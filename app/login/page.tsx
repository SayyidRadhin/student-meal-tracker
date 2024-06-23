/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useState } from 'react'
import "../../styles/signup.css"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"

import {signInWithEmailAndPassword} from "firebase/auth";
import { auth, db } from '@/lib/firebaseconfig'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'



function Page() {
  const [loading, setLoading] = useState(false);

    const route = useRouter()

  const LoginValidator = z.object({
    password:z.string().min(3,{
      message:'password must be at least 3 characters long'
    }).max(20,{
      message:'password must be at most 20 characters long'
    }),
    email:z.string().min(1,{message:"email is required"}).regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      { message: 'Invalid email address' }
    )
  })

  type LoginCredentials = z.infer<typeof LoginValidator>


  const {register,
    handleSubmit,
    getValues,
    formState:{errors},
  } = useForm<LoginCredentials>({
    resolver:zodResolver(LoginValidator),
  })

  const handleLogin = async (data:LoginCredentials)=>{
        
        setLoading(true);
        console.log(data);
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          // Signed in
          if (userCredential.user) {
            console.log(userCredential);
            route.push('/dashbord')
          }
          
        })
        setLoading(false);
  }

  return (
    <div>
        <section className="sign-up-page">
    <div className="container">
    
    <div className="signup-form">
      {/* <div className="form-title">Try it free 7 days <span>then $20/mo. thereafter</span></div> */}
      <Card>
      <form className="signup-form-form py-2" onSubmit={handleSubmit(handleLogin)} >
          <h1 className='font-extrabold text-3xl text-left '>WELCOME <span className='text-slate-600'>BACK</span></h1>
          <p className='text-slate-500 text-sm mb-5 text-left'>please enter your details to Signin</p>
        <div className="form-group">
          <Input required className='py-6'  type="email" placeholder="Email Address "  {...register("email")}/>
        </div>
        <div className="form-group">
          <Input required type="password" className='py-6' placeholder="Password"  {...register("password")}/>
        </div>
        
        <Button  className={` w-full py-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} type="submit" disabled={loading}>Signup</Button>
       
        <p className="sign-up-terms text-sm">
                Don't have an Account ? {" "}
                <Link href="/register"><span className="font-semibold">Create an Account</span>{" "}</Link>
              </p>      </form>
      </Card>
    </div>
  </div>
  </section>

  

    </div>
  )
}

export default Page