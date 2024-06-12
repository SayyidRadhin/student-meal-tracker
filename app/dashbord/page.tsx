
import React from 'react'
import Slidbar from '@/components/slidbar'
import Nav from '@/components/nav'
import { UserRoundCogIcon } from 'lucide-react'
function Page() {

   
  return (
    <section className='dashbord w-full max-h-screen  min-h-screen flex'>
      <Nav/>

       <div className=" flex-[6] flex pt-[5.2em] max-w-[100vw] sm:mt-0 dark:bg-[#0B1120]">
          <Slidbar/>
          <div className="hero w-full  py-3 px-4 sm:px-8 mt-[5em] md:mt-4 overflow-auto  scrollbar-hide no-scrollbar">
         <div className="header rounded-md flex p-4 bg-blue-950 w-full mb-2 gap-2 text-white select-none">
           <UserRoundCogIcon className='text-xl'/>
           <h3 className='text-xl'>Members</h3>
         </div>
             {/* <TableMembers columns={memberColumn} data={users} /> */}
      </div>
       </div>
    </section>
  )
}
export default Page