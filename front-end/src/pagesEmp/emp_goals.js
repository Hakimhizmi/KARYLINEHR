import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { v4 } from "uuid";
import { Error_t, Succses } from "../pages/tostify";



export default function EmpGoals() {
  const [loding,setLoding] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [data_Empgoals,setData_Empgoals] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData,setCurrentData] = useState([]);
  const maxdata = 100
  const maxPages = Math.ceil(data_Empgoals.length / maxdata);
  const startIndex = (currentPage - 1) * maxdata;
  const endIndex = startIndex + maxdata;
  const ref = useRef(null);
  const [done,setDone] = useState()
  const [lodingbtn,setLodingbtn] = useState(false)
  const token_M = sessionStorage.getItem('token_M')



      async function get_data(){
            setLoding(true)
            await axios.post('http://localhost:8000/api/get_Empgoal',{token_M}).then(({data})=>{
              setData_Empgoals(data.data);setLoding(false)
            }).catch(({})=>{
              Error_t()
              setLoding(false)
            })
            }

            async function handler_StatusGoal(id,type){
              setLodingbtn(true)
              await axios.post('http://localhost:8000/api/update_Empgoals',{GoalID:id,GoalStatus:type}).then(({data})=>{
                Succses(data.message);setDone(v4());setLodingbtn(false)
              }).catch(({})=>{
                Error_t()
                setLodingbtn(false)
              })
              }

            useEffect(()=>{
              get_data()
          },[done])

        

          

          useEffect(()=>{
            if (searchQuery == '') {
              setCurrentData(data_Empgoals.slice(startIndex, endIndex))
            }
           },[searchQuery,data_Empgoals,currentPage])




const handleNextPage = () => {
  if (currentPage < maxPages) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const getPageNumbers = () => {
  const pageNumbers = [];
  for (let i = 1; i <= maxPages; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
};

useEffect(()=>{
  if (searchQuery != '' ) {
    setCurrentData(data_Empgoals.filter((item)=> 
     item.GoalName.toLowerCase().includes(searchQuery.toLowerCase())   ))
  }
},[searchQuery])
    return(
      <main class="h-full overflow-y-auto content ml-12 transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4">

        <div class="container px-6 mx-auto ">

        
            
          <div >
          <div className="grid grid-cols-2 gap-6 mb-5">

          <h4
          class="mb-4 mt-4 w-full text-lg font-semibold text-gray-600 dark:text-gray-300"
        >
        Tous les objectifs des employés
        </h4>
        <form class="flex items-center h-5 mt-10">   
        <div class="w-full">
 
  <input onChange={(e) => setSearchQuery(e.target.value)} type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-1.7 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Rechercher par nom d'objectif" />
</div>

    
</form>
        </div>
          
        
         
          
        <div class="w-full overflow-hidden rounded-lg shadow-xs">
          <div class="w-full overflow-x-auto">
            <table class="w-full whitespace-no-wrap">
              <thead>
                <tr
                  class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                >
                  <th class="px-4 py-3">Nom </th>
                  <th class="px-4 py-3">Zone</th>
                  <th class="px-4 py-3">Description </th>
                  <th class="px-4 py-3">Date de début </th>
                  <th class="px-4 py-3">Date de fin </th>
                  <th class="px-4 py-3">Statut</th>
                  <th class="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody
                class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800"
              >
                { loding==true && 
                 <tr class="text-gray-700 dark:text-gray-400 " >
                  <td colspan="9">
                  <div class="text-center  mt-10 mb-10">
    <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Chargement...</span>
    </div>
</div>
                  </td>
                 </tr>
                 }

                {currentData.length !=0 && loding == false ? currentData.map((item,index)=>{
                  return(
                    <tr key={index} class='text-gray-700 dark:text-gray-400'>
                    <td class="px-4 py-3 text-sm">
                    {item.GoalName}
                    </td>
                    <td class="px-4 py-3 text-sm">
                    {item.Zone}
                    </td>
                    <td class="px-4 py-3 text-sm">
                    <p className="w-80 truncate" title={item.GoalDescription}> {item.GoalDescription}</p>
                    </td>
                    <td class="px-4 py-3 text-sm">
                    {item.GoalStartDate}
                    </td>
                    <td class="px-4 py-3 text-sm">
                    {item.GoalEndDate}
                    </td>
                    <td class="px-4 py-3 text-sm">
                    <span
                            class={`px-2 py-1 font-semibold leading-tight rounded-full
                             ${item.GoalStatus == 'Not Started' && 'text-orange-700 bg-orange-100 dark:bg-orange-600 dark:text-orange-100' }
                             ${item.GoalStatus == 'On Track' && 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100' }
                             `}
                          >
                           {item.GoalStatus }
                          </span>
                    </td>
                    <td class="flex items-center text-sm">
                      {item.GoalStatus == 'Not Started' ? 
                      lodingbtn == false ?
                      <button onClick={()=>handler_StatusGoal(item.GoalID,'On Track')} type="button" class="text-white mt-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 mb-2">
                      Accepter</button> :
                      
                      <button disabled type="button" class="text-white mt-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 mb-2">
                      <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                      </svg>
                      Chargement...
                  </button> : <></>
                      }
                   {item.GoalStatus == 'On Track' ?
                    lodingbtn == false ?
                    <button type="button" onClick={()=>handler_StatusGoal(item.GoalID,'Complete')} class="text-white bg-gradient-to-r mt-1 from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 mb-2">
                                        Complet</button> :
                    
                    <button disabled type="button" class="text-white bg-gradient-to-r mt-1 from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 mb-2">
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    Chargement...
                    </button>  : <></>
                      }

{
  lodingbtn == false ? <button type="button" onClick={()=>handler_StatusGoal(item.GoalID,'Overdue')} class="text-white mt-1 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 mb-2">
  Rejeter</button> : 
  lodingbtn == item.GoalID &&
  <button disabled type="button" class="text-white mt-1 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 mb-2">
  <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
  </svg>
  Chargement...
  </button>
}


                
                    

                  </td>
                  </tr>
                  )
                }) : 
                loding == false &&
<tr class="text-gray-700 col-span-full dark:text-gray-400 " >
                 <td colspan="9"><p  class="font-normal mt-4 mb-4 text-center text-gray-400 dark:text-gray-700">Il n'y a pas de données à afficher...</p></td>
                 </tr>
              }
              </tbody>
            </table>
          </div>
          {maxPages > 1 &&
          <div
            class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"
          >
            <span class="flex items-center col-span-3">
            Montrant {currentPage}-{currentData.length} de {maxPages}
            </span>
            <span class="col-span-2"></span>
            
            <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
              <nav aria-label="Table navigation">
                <ul class="inline-flex items-center">
                  <li>
                    <button
                      class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-blue"
                      aria-label="Previous"
                      onClick={handlePreviousPage}
                    >
                      <svg
                        class="w-4 h-4 fill-current"
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </li>
                  {getPageNumbers().map((page) => (
<button
class={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-blue ${page === currentPage ? 'text-white transition-colors duration-150 bg-blue-600 border border-r-0 border-blue-600 rounded-md ' : ''} `}
onClick={() => handlePageChange(page)}
>
{page}
</button>
         
        ))}
                  <li>
                    <button
                      class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-blue"
                      aria-label="Next"
                      onClick={handleNextPage}
                    >
                      <svg
                        class="w-4 h-4 fill-current"
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </span>
          </div>
}        </div>
        </div>



        </div>
      </main>

    )
}