/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";



export default function Home() {

 
  return (
     <div className=" overflow-hidden grid w-full min-h-screen  px-[10%] ">
       <section className='max-w-5xl mt-0 flex-col mx-auto'>
        <nav className="py-4 flex justify-between">
          <div className="bg-transparent w-9 h-9 rounded-full"></div>
          <div className="flex gap-3">
           <Link href="/login"> <Button className="border- mt-3 bg-black text-white rounded-full px-6 py-2 font-semibold transition duration-300 ease hover:scale-[1.1] hover:bg-opacity-95">Login</Button></Link>

          </div>
        </nav>
        <div className=' flex sm:flex-row justify-center  flex-col-reverse max-sm:mt-10 max-sm:gap-2 gap-2 w-full max-h-[80%] sm:h-[80%] items-center '>
          <div className="flex  flex-col    w-full items-center sm:items-start max-sm:text-center">
         <h6 className="font-semibold ">Literature-<span className="underline">Missed Meals</span></h6>
         <h1 className="sm:text-4xl  text-2xl mt-6 max-w-[18ch] sm:leading-10 font-bold ">Organize your Meals by <span className="underline"> reading log</span></h1>
         <p className="font-lora max-w-[20ch] sm:my-5 my-3">
          " How Much Meals Missed today ? - Find It Now."
         </p>
        <Link href="/dashbord"> <button className="sm:text-xl text-lg my-6 self-center border-solid bg-black text-white rounded-full sm:px-7 sm:py-3 px-6 py-2 font-semibold transition duration-300 ease hover:scale-[1.1] hover:bg-opacity-95">Find Now</button></Link>

          </div>
          <div className="w-full flex sm:justify-end justify-center">
          <Image
          src="/plate.png"
          alt="book"
          width={200}
          height={200}
          layout="responsive"
          loading="lazy"
          className=""
        />
          </div>
        
        </div>
       </section>

     </div>
     )
}

