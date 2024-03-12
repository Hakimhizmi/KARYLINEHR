import axios from "axios";
import { useEffect, useState } from "react";
import { Error_t } from "../pages/tostify";




export default function Navbar() {
const [notif,setNotif] = useState(0)
const token_M = sessionStorage.getItem('token_M')
const [fullName,setFull] = useState('')
const typeM = sessionStorage.getItem('Type_M');

async function handler_count() {
  await axios.get(`http://localhost:8000/api/count_mail/${token_M}`).then(({data})=>{
      setNotif(data.Notif);setFull(data.FullName)
}).catch(()=>{
        Error_t();
  })
}

useEffect(()=>{
  handler_count()
},[])


   
      const profile = `
      <li class="relative">
      <button
        class="align-middle rounded-full focus:shadow-outline-blue focus:outline-none"
        @click="toggleProfileMenu"
        @keydown.escape="closeProfileMenu"
        aria-label="Account"
        aria-haspopup="true"
      >
        <img
          class="object-cover w-8 h-8 rounded-full"
          src="${typeM == 'admin' ? 'https://logodix.com/logo/1707081.png' : 'https://www.svgrepo.com/download/201711/employee.svg'}"
          alt=""
          aria-hidden="true"
        />
      </button>
      <template x-if="isProfileMenuOpen">
        <ul
          x-transition:leave="transition ease-in duration-150"
          x-transition:leave-start="opacity-100"
          x-transition:leave-end="opacity-0"
          @click.away="closeProfileMenu"
          @keydown.escape="closeProfileMenu"
          class="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
          aria-label="submenu"
        >
          
          <li class="flex">
          <a href='/inbox' class="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200">
            <svg class="w-5 h-5 mr-3" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
            </svg>
            <span>Boîte de réception</span>
            <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600 ml-auto">${notif}</span>
          </a>
        </li>
         
      
    
        <li class="flex">
        <a
          class="inline-flex  items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          @click="disconnect"
          href='/'
        >
          <svg
            class="w-5 h-5 mr-3"
            aria-hidden="true"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            ></path>
          </svg>
          <span>déconnecter</span>
        </a>
      </li>
      
          
        </ul>
      </template>
    </li>`
    return(
      
    <header className="fixed  w-full z-30 flex bg-white dark:bg-gray-800 p-2 items-center justify-center h-16 px-10 ">
  <div className="logo  ml-12 text-blue-900 text-2xl font-bold text dark:text-white  transform ease-in-out duration-500 flex-none h-full flex items-center justify-center">
 <span className="underline ">KARY</span>  <span className="line-through mt-4 text-blue-600 text-xl">&nbsp;LINE&nbsp;</span>
  </div>
  <div className="grow h-full flex items-center justify-center" />
  <div className="flex-none h-full text-center flex items-center justify-center">
    <div className="flex space-x-3 items-center px-3">
      <div className="flex-none flex justify-center">
        <div dangerouslySetInnerHTML={{__html: profile}} />
      </div>
      <div className="hidden md:block text-sm md:text-md text-black dark:text-white">{fullName}</div>
    </div>
  </div>
</header>

    )
}  