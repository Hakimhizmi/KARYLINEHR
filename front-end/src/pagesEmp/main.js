import axios from 'axios';
import { useEffect, useState } from 'react';
import { ConvertDecimalToTime } from '../pages/page/converttotime';
import {Error_t, Succses} from '../pages/tostify'




export default function MainEmp() {
const [overview,setOverview] = useState({})
const [overview_slary,setOverviewSlary] = useState([])
const [loding,setLoding] = useState(true)
const [lodingbtn,setLodingBtn] = useState(false)
const [data,setData] = useState({})
const today = new Date();
const thisMonthName = today.toLocaleString('default', { month: 'long' });
const token_M = sessionStorage.getItem('token_M')
const [rows,setRows] = useState(3)
const [err,setErr] = useState({})

function handlergetdata(e) {
  setData({...data , [e.target.name] : e.target.value})
}

async function get_data(){
  await axios.get(`http://localhost:8000/api/overview_Emp/${token_M}`).then(({data})=>{
    setOverview(data.data);setLoding(false)
  }).catch(({})=>{
    Error_t()
 })
  }

  async function get_slary(){
    await axios.get(`http://localhost:8000/api/overview_staffsalaries/${token_M}`).then(({data})=>{
      setOverviewSlary(data.data);setLoding(false)
    }).catch(({})=>{
      Error_t()
   })
    }
  
    async function send_report(){
      setLodingBtn(true)
      await axios.post(`http://localhost:8000/api/send_report/${token_M}`,data).then(({data})=>{
        Succses(data.message);setLodingBtn(false)
      }).catch(({response})=>{
        if (response.status == 422) {
          setErr(response.data.errors);setLodingBtn(false)
        }else{
          Error_t();setLodingBtn(false)
        }
     })
      }
   
      
      useEffect(() => {
        get_data()
        get_slary()
      }, []);

    return(
      <main class="h-full overflow-y-auto content ml-12 transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4">
        <div class="container px-6 mx-auto grid">
          <h2
            class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200"
          >
            Tableau de bord
          </h2>
          
          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div
              class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <div
                class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
</svg>
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
               Objectifs incomplets <span className="font-bold">({thisMonthName})</span>

                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                 
                 {loding == false ? 
                  overview.goals_I :
                  <svg viewBox="0 0 100 100" class="h-8 w-8 ">
                  <circle fill="#2563eb" stroke="none" cx="6" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite"
                      begin="0.1"/>    
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="26" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.2"/>       
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="46" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.3"/>     
                  </circle>
                </svg>
                  }
                </p>
              </div>
            </div>
            <div
              class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <div
                class="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
</svg>
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
              Objectifs complétés  <span className="font-bold">({thisMonthName})</span>

                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                 
                 {loding == false ? 
                  overview.goals_c :
                  <svg viewBox="0 0 100 100" class="h-8 w-8 ">
                  <circle fill="#2563eb" stroke="none" cx="6" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite"
                      begin="0.1"/>    
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="26" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.2"/>       
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="46" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.3"/>     
                  </circle>
                </svg>
                  }
                </p>
              </div>
            </div>
            <div
              class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <div
                class="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Heures de travail régulières <span className="font-bold">({thisMonthName})</span>
                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                  
                  {loding == false ? 
                ConvertDecimalToTime(overview.Regular) :
                  <svg viewBox="0 0 100 100" class="h-8 w-8 ">
                  <circle fill="#2563eb" stroke="none" cx="6" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite"
                      begin="0.1"/>    
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="26" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.2"/>       
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="46" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.3"/>     
                  </circle>
                </svg>
                  }
                </p>
              </div>
            </div>
          
            <div
              class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <div
                class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Heures supplémentaires <span className="font-bold">({thisMonthName})</span>
                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                {loding == false ? 
                ConvertDecimalToTime(overview.Overtime) :
                  <svg viewBox="0 0 100 100" class="h-8 w-8 ">
                  <circle fill="#2563eb" stroke="none" cx="6" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite"
                      begin="0.1"/>    
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="26" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.2"/>       
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="46" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.3"/>     
                  </circle>
                </svg>
                  }
                </p>
              </div>
            </div>
            </div>
    

          
          <div class="grid mt-10 gap-12 mb-8 md:grid-cols-2">
            <div
              class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="w-6 h-6 inline-block">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
</svg>
              <h4 class=" ml-2 inline-block font-semibold text-gray-800 dark:text-gray-300">
              Signaler un problème
 
              </h4>
              
        <div class="options md:flex md:space-x-6 text-sm items-center text-gray-700 mt-4">
            <p class="w-1/2 mb-2 md:mb-0 dark:text-gray-200">J'aimerais </p>
            <select name='type_report'
             onChange={(e)=>handlergetdata(e)}
              class="w-full border border-gray-200 p-2 dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray">
                <option value="select" selected>Choisir une option</option>
                <option value="bug report">signaler un bug</option>
                <option value="data report">Rapport de données</option>
                <option value="feedback report">Feedback</option>
            </select>
            <span class="text-xs text-red-600 ml-4 dark:text-red-400">
                  {err.hasOwnProperty('type_report') ? err.type_report[0] : ''}
                </span>
        </div>    

            <div class="form mt-4">
                <div class="flex flex-col text-sm">
                    <label for="title" class="font-bold mb-2 dark:text-gray-200">Titre</label>
                    <input name='title_report' onChange={(e)=>handlergetdata(e)} class=" appearance-none dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input" type="text" placeholder="Entrez un titre" /> 
                </div>
                <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('title_report') ? err.title_report[0] : ''}
                </span>
               <div class="text-sm flex flex-col">
                <label for="description" class="font-bold mt-4 mb-2 dark:text-gray-200">Description</label>
                   <textarea name='desc_report' onChange={(e)=>handlergetdata(e)} class=" appearance-none w-full dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"  placeholder="Entrez votre descriptif"></textarea>
               </div>
               <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('desc_report') ? err.desc_report[0] : ''}
                </span>
            </div>

            {lodingbtn == false ? 
                <button onClick={()=>send_report()} class=" w-full bg-blue-600 shadow-lg text-white px-4 py-2 hover:bg-blue-700 mt-8 text-center font-semibold focus:outline-none ">Envoyer</button>
            :
            <button disabled type="button" class=" w-full bg-blue-600 shadow-lg text-white px-4 py-2 hover:bg-blue-700 mt-8 text-center font-semibold focus:outline-none ">
    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    Chargement...
</button> 
              }
              
            </div>
            
              
              <div class="p-4 relative h-72  bg-white rounded-lg shadow-xs dark:bg-gray-800 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <h3 class="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">Statistiques salariales 
        <button title='Statistiques salariales des 4 derniers mois' type="button"><svg class="w-4 h-4 ml-2 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg><span class="sr-only">Montrer l'information</span></button>
        </h3>
     
        
        
        <div id="fullWidthTabContent" class="border-t border-gray-200 dark:border-gray-600">
              <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
              {loding == false   ? 
                overview_slary.map((item,index)=>{
                  if (index <= rows) {
                    return(
                      <li class="py-3 sm:py-4" key={index}>
                                        <div class="flex items-center justify-between">
                                          <div class="flex items-center min-w-0">
                                            <div class="ml-3">
                                              <p class="font-medium text-gray-900 truncate dark:text-white">
                                                {item.date.slice(0, 7)}
                                              </p>
                                              {item.added_value >= 0 ? 
                                              <div class="flex items-center justify-end flex-1 text-sm text-green-500 dark:text-green-400">
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                      </svg>
                      
                      {item.added_value}Dh
                                                <span class="ml-2 text-gray-500">vs le mois dernier</span>
                                              </div> : <div class="flex items-center justify-end flex-1 text-sm text-red-500 dark:text-red-400">
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
                      </svg>
                      {Math.abs(item.added_value)}Dh
                                                <span class="ml-2 text-gray-500">vs le mois dernier</span>
                                              </div>
                      
                                              }
                      
                                            </div>
                                          </div>
                                          <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            {item.salary}Dh
                                          </div>
                                        </div>
                                      </li>)
                  }
                 
                })

                   :
                  <svg viewBox="0 0 100 100" class="h-8 w-8 ">
                  <circle fill="#2563eb" stroke="none" cx="6" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite"
                      begin="0.1"/>    
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="26" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.2"/>       
                  </circle>
                  <circle fill="#2563eb" stroke="none" cx="46" cy="50" r="6">
                    <animate
                      attributeName="opacity"
                      dur="1s"
                      values="0;1;0"
                      repeatCount="indefinite" 
                      begin="0.3"/>     
                  </circle>
                </svg>
                  }
                
                             
              </ul>
            </div>
           
            
          <div class="absolute mt-4 bottom-0 dark:text-white right-0">
            {rows == 3 ? 
            <a onClick={()=>setRows(overview_slary.length)} class="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700">
           Voir tout
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a> : 
          <a onClick={()=>setRows(3)} class="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700">
          Cacher
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </a>
            }
            
          </div>
      </div>
              
            </div>
          </div>
       
       
      


      </main>
    )
}