import { useRef, useState } from "react"
import axios from "axios"
import {Error_t,Succses} from '../pages/tostify'


export default function Emptimeoff() {
  
 
  const [data,setData] = useState({})  
  const [err,setErr] = useState({})
  const [loding,setLoding] = useState(false)
  const token_M = sessionStorage.getItem('token_M')

  
  



function handlergetdata(e) {
    setData({...data , [e.target.name] : e.target.value})
}

async function handler_send() {
  setLoding(true)
  await axios.post(`http://localhost:8000/api/request_timeoff/${token_M}`,data).then(({data})=>{
    Succses(data.message);setLoding(false)
  }).catch(({response})=>{
    if (response.status == 422) {
      setErr(response.data.errors);setLoding(false)
    }else{
        Error_t();setLoding(false)
    }
  })
}



  

    return(
      <main class="h-full overflow-y-auto content ml-12 transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4">

        <div class="container px-6 mx-auto">

<div >
          
          <h2
            class="mb-4 mt-4 w-full text-lg font-semibold text-gray-600 dark:text-gray-300"
          >
          Demandez des vacances
          </h2>
         


          
          <div
            class="px-4 py-3  mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
          >

            
            
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Type de vacances</span>
              <select
                  class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
                  name="TimeOffType"
                  onChange={(e)=>handlergetdata(e)}
                  
                >
                  <option disabled selected>Sélectionner le genre</option>
                  <option value='Paid Time Off'>Congés payés</option>
                  <option value='Vacation'>Vacances</option>
                  <option value='Parental Leave'>Congé parental</option>
                  <option value='Jury Duty'>Service juridique</option>
                  <option value='Other'>autre...</option>
                </select>
                <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('TimeOffType') ? err.TimeOffType[0] : ''}
                </span>
            </label>
            <label class="block text-sm mt-4">
              <span class="text-gray-700 dark:text-gray-400">Raison du congé</span>
              <textarea
                  class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
                  rows="6"
                  placeholder="Entrez la raison...."
                  name="TimeOffReason"
                  onChange={(e)=>handlergetdata(e)}
                ></textarea>
                <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('TimeOffReason') ? err.TimeOffReason[0] : ''}
                </span>
            </label>
            
            <div className="grid grid-cols-2 gap-6 mt-4">
           
           <label class="block text-sm">
             <span class="text-gray-700 dark:text-gray-400">Date de début du congé</span>
             <input
               class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
               type='date'
               name="TimeOffStartDate"
               onChange={(e)=>handlergetdata(e)}
             />
             <span class="text-xs text-red-600 dark:text-red-400">
                 {err.hasOwnProperty('TimeOffStartDate') ? err.TimeOffStartDate[0] : ''}
               </span>
           </label>
           <label class="block text-sm">
             <span class="text-gray-700 dark:text-gray-400">Date de fin du congé</span>
             <input
               class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
               type='date'
               name="TimeOffEndDate"
               onChange={(e)=>handlergetdata(e)}
             />
             <span class="text-xs text-red-600 dark:text-red-400">
                 {err.hasOwnProperty('TimeOffEndDate') ? err.TimeOffEndDate[0] : ''}
               </span>
           </label>
           </div>
            
            
           

            

            <div class="block mt-6" >
            {loding == false ? 
              <button
                class="px-5 py-3 block w-full font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
              onClick={()=>handler_send()}
              >
            Envoyer
              </button>
              :
              <button disabled type="button" class="px-5 py-3 block w-full font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    Chargement...
</button> 
}
        
            


</div>   
</div>
</div>
        </div>
      </main>

    )
}