import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { v4 } from "uuid";
import { ConvertDecimalToTime } from "./page/converttotime";
import { exportTableToPDF } from "./page/dataexport";
import { Error_t, Succses } from "./tostify";




export default function Staff_salaries() {
  const [type,settype] = useState("par")
  const [module_del,setModule] = useState(false)
  const [module_edit,setModuleedit] = useState(false)
  const [module_alert,setModulealert] = useState(false)
  const [loding,setLoding] = useState(false)
  const [loding_btn,setLodingbtn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDate, setSearchQueryDate] = useState('');
  const [data_salarie,setData_salarie] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData,setCurrentData] = useState([]);
  const maxdata = 50
  const maxPages = Math.ceil(data_salarie.length / maxdata);
  const startIndex = (currentPage - 1) * maxdata;
  const endIndex = startIndex + maxdata;
  const [err,setErr] = useState({})
  const [id,setId] = useState()
  const [done,setDone] = useState()
  const ref = useRef(null);
const [salaryN,setSalaryN] = useState('')
const [salaryE,setSalaryE] = useState('')
const [Netsalary,setNetsalary] = useState()
const [message,setMess] = useState('')

  async function get_data_salaries(){
    setLoding(true)
    await axios.get('http://localhost:8000/api/get_staffsalaries').then(({data})=>{
        setData_salarie(data.data);setLoding(false)
    }).catch(({})=>{
      Error_t()
      setLoding(false)
    })
    }
    useEffect(()=>{
      get_data_salaries()
    },[done,done])

    async function calcul() {
      setLodingbtn(true)
      await axios.post(`http://localhost:8000/api/calcul`,{salaryN,salaryE}).then(({data})=>{
        if (data.type == 'successfully') {
          Succses(data.message);setLodingbtn(false);setSalaryN('');setSalaryE('');setErr({})
          setDone(v4());settype('par')
        }else{
setMess(data.message);setModulealert(true);setErr({})
        }
      }).catch(({response})=>{
        if (response.status == 422) {
          setErr(response.data.errors);setLodingbtn(false)
        }else{
            Error_t();setLodingbtn(false);setErr({})
        }
      })
    }

    async function del_data() {
      await axios.get(`http://localhost:8000/api/del_staffsalaries`).then(({data})=>{
        setModulealert(false);Succses(data.message);setLodingbtn(false);setDone(v4())
      }).catch(({})=>{
        Error_t()
      })
    }
    async function handler_update() {
      setLodingbtn(true)
      await axios.post(`http://localhost:8000/api/update_staffsalaries/${id}`,{Netsalary}).then(({data})=>{
        Succses(data.message);setLodingbtn(false);setNetsalary({});setErr({});setModuleedit(false);setDone(v4())
      }).catch(({response})=>{
        if (response.status == 422) {
          setErr(response.data.errors);setLodingbtn(false)
        }else{
            Error_t();setLodingbtn(false)
        }
      })
    }
  
    async function del_selectdata() {
      await axios.get(`http://localhost:8000/api/del_select_staffsalaries/${id}`).then(({data})=>{
        setModule(false);setDone(v4());Succses(data.message)
      }).catch(({})=>{
        Error_t()
      })
    }

    useEffect(()=>{
      if (searchQuery != '' || searchQueryDate != '' ) {
          const filteredData = data_salarie.filter((item) => {
            const nameMatch = searchQuery ? item.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.LastName.toLowerCase().includes(searchQuery.toLowerCase())  : true;
            const dateMatchyear = searchQueryDate ? item.year == searchQueryDate.substring(0, 4) : true;
            const dateMatchmonth = searchQueryDate ? item.month == searchQueryDate.substring(5, 7) : true;
            return nameMatch && dateMatchyear && dateMatchmonth;
          });
          setCurrentData(filteredData)
      }
      },[searchQuery,searchQueryDate])
      
      useEffect(()=>{
        if (searchQuery === '' && searchQueryDate === '') {
          setCurrentData(data_salarie.slice(startIndex, endIndex))
        }
       },[searchQuery,data_salarie,currentPage,searchQueryDate])

  const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setModule(false) ;setModulealert(false)
          setModuleedit(false);setLodingbtn(false)
        }
      };
          document.addEventListener('mousedown', handleClickOutside);
  

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
    return(
      <main class="h-full pb-16  overflow-y-auto pt-20 ml-12">

        <div class="container px-6 mx-auto ">

        <nav class="flex text-sm font-medium">

              <a  onClick={()=>{settype("par")}} href="#" className={`-mb-px w-full text-center  p-4 text-gray-700 dark:text-gray-200 ${type == "par" ? 'border-b border-blue-600' : ''}`}>
              Parcourir
              </a>
            
              <a   onClick={()=>{settype("cal")}} href="#" className={`-mb-px w-full text-center  p-4 text-gray-700 dark:text-gray-200 ${type == "cal" ? 'border-b border-blue-600' : ''}`}>
              Calculer
              </a>
          
            </nav>
            {type == "cal" ? 
<div >
<h2
            class="mb-4 mt-4 w-full  text-lg font-semibold text-gray-600 dark:text-gray-300"
          >
          Calculer les salaires des employés pour ce mois
          </h2>
        

          
         

         
          
          <div
            class="px-4 py-3  mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
          >
            <div className="grid grid-cols-2 gap-12" >
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">salaire horaire (DH)</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Saisissez le salaire.."
                type="number" step="0.01"
                value={salaryN}
                onChange={(e)=>setSalaryN(e.target.value)}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('salaryN') ? err.salaryN[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Salaire supplémentaire (DH)</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Saisissez le salaire.."
                type="number" step="0.01"
                value={salaryE}
                onChange={(e)=>setSalaryE(e.target.value)}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('salaryE') ? err.salaryE[0] : ''}
                </span>
            </label>
            
            </div>
    
              {loding_btn == false ? 
                <button
                class="px-5 py-3 block mt-4 w-full font-medium leading-5 text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
              onClick={()=>calcul()}
              >
            Commencer à calculer
              </button> :
 <button disabled type="button"                 class="px-5 py-3 block mt-4 w-full font-medium leading-5 text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
 >
 <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
 </svg>
 Chargement...
</button> }

            </div>
           </div>
          

:
          <div >


<h4
          class="mb-4 mt-4 w-full text-lg font-semibold text-gray-600 dark:text-gray-300"
        >
        Tous les salaires des employés
        </h4>
        <div class="px-4 py-3  mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800">

        <div className="grid grid-cols-2 gap-6 ">
        <label class="block text-sm ">
        <span class="text-gray-700  dark:text-gray-400">filtrer par employé</span>
              <input
                class="bg-gray-50 border mt-2 h-8 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Recherche par prénom ou nom "
                id="simple-search"
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
              />

            </label>
            <label class="block text-sm ">
            <span class="text-gray-700  dark:text-gray-400">filtrer par dates</span>
        <input
                class="block w-full mt-2  h-8 text-sm rounded-lg shadow-x dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type='month'
                value={searchQueryDate}
                onChange={(e)=>setSearchQueryDate(e.target.value)}
              /></label>
</div>
<button
                class="px-5 py-3 block mt-4 w-full font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                onClick={() => 
                  exportTableToPDF('myTable',searchQueryDate,searchQuery)
                }
              >
           Exporter au format PDF
              </button>
</div>
          
        
          
        
         
          
        <div class="w-full overflow-hidden rounded-lg shadow-xs">
          <div class="w-full overflow-x-auto">
          <table class="w-full whitespace-no-wrap" id="myTable">
              <thead>
                <tr
                  class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                >
                  <th class="px-4 py-3">POUR</th>
                  <th class="px-4 py-3">Employé</th>
                  <th class="px-4 py-3">heures régulières</th>
                  <th class="px-4 py-3">heures supplémentaires</th>
                  <th class="px-4 py-3">Salaire net</th>
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
<tr class="text-gray-700 dark:text-gray-400">
                <td class="px-4 py-3 text-sm">
                    {item.year}-{item.month}
                  </td>
                  <td class="px-4 py-3 text-sm">
                  {item.FirstName} {item.LastName}
                  </td>
                  <td class="px-4 py-3 text-sm">
                    {ConvertDecimalToTime(item.normal_H)}
                  </td>
                  <td class="px-4 py-3 text-sm">
                  {ConvertDecimalToTime(item.extra_H)}
                  </td>
                  <td class="px-4 py-3 text-sm">
                  {item.Netsalary}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center space-x-4 text-sm">
                      <button
                        class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-blue-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                        aria-label="Edit"
                        onClick={()=>{setModuleedit(true);setId(item.salaryID);setNetsalary(item.Netsalary)}}
                      >
                        <svg
                          class="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-blue-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                        aria-label="Delete"
                        onClick={()=>{setModule(true);setId(item.salaryID)}}
                      >
                        <svg
                          class="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
            )})
            :
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
            Affichage {currentPage}-{currentData.length} de {maxPages}
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
}    
        </div>
        </div>
}


{module_del && 
                    <div
    class={`fixed inset-0 z-30 ml-12  flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center `}
  >
    <div
      ref={ref}
      class={`w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl  `}
      role="dialog"
      id="modal1"
    >
      <header class="flex justify-end">
        <button
          class="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
          aria-label="close"
          onClick={()=>setModule(false)}
        >
          <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            role="img"
            aria-hidden="true"
          >
            <path
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>
      </header>
      <div class="mt-4 mb-6">
        <div
          class="px-4 flex flex-row py-4 min-w-min border-l-2 border-red-500 dark:border-gray-200 bg-red-100 dark:bg-gray-700 rounded mx-auto">
          <span class="w-6 h-6 mr-4 mt-1 text-red-500 dark:text-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </span>
          <div>
            <h2 class="text-lg font-bold text-red-700 dark:text-gray-100">Avertissement</h2>
            <p class="text-sm my-2 text-red-500 dark:text-gray-200 font-medium">Êtes-vous sûr de supprimer ceci ?</p>
          </div>
        </div>
      </div>
      <footer
        class="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800"
      >
        <button
          onClick={()=>setModule(false)}
          class="w-full px-5 py-3 text-sm font-medium leading-5 text-black text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
        >
        Garde le.
        </button>
        <button
          class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-red-600 hover:bg-red-500 focus:outline-none focus:shadow-outline-blue"
        onClick={()=>del_selectdata()}
        >
        Oui, supprimez-le !
        </button>
      </footer>
    </div>
  </div>
  
}

{module_edit && <div
      
      class="fixed inset-0 z-30 ml-12 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
    >
    
      <div
      
      ref={ref}
        class="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
        role="dialog"
        id="modal"
      >
        <header class="flex justify-end">
          <button
            class="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
            aria-label="close"
            onClick={()=>setModuleedit(false)}

          >
            <svg
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              role="img"
              aria-hidden="true"
            >
              <path
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
            </svg>
          </button>
        </header>
        
        <div class="mt-4 mb-6">
        
          <p
            class="mb-4 text-center text-lg font-semibold text-gray-700 dark:text-gray-300"
          >
             Modifier les informations sur les salaires des employés
          </p>
          
          
            
            
          
            
            <label class="block text-sm mt-4">
              <span class="text-gray-700 dark:text-gray-400">SALAIRE NET</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Entrez SALAIRE NET.."
                type="number" step="0.01"
                value={Netsalary}
                onChange={(e)=>setNetsalary(e.target.value)}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Netsalary') ? err.Netsalary[0] : ''}
                </span>
            </label>
            
            
           
        </div>
        <footer
          class="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800"
        >
          <button
            onClick={()=>setModuleedit(false)}

            class="w-full px-5 py-3 text-sm font-medium leading-5 text-black text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
          >
          Cancel
          </button>
          {loding_btn == false ? 
 <button
 class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
onClick={()=>handler_update()}
>
Mise à jour
</button> :
 <button disabled type="button"  class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
 >
 <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
 </svg>
 Chargement...
</button> }
         
        </footer>
      </div>
    </div>}

    {module_alert && 
                    <div
    class={`fixed inset-0 z-30 ml-12 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center `}
  >
    <div
      ref={ref}
      class={`w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl  `}
      role="dialog"
      id="modal1"
    >
      <header class="flex justify-end">
        <button
          class="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
          aria-label="close"
          onClick={()=>{setModulealert(false);setLodingbtn(false)}}
        >
          <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            role="img"
            aria-hidden="true"
          >
            <path
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
              fill-rule="evenodd"
            ></path>
          </svg>
        </button>
      </header>
      <div class="mt-4 mb-6">
        <div
          class="px-4 flex flex-row py-4 min-w-min border-l-2 border-red-500 dark:border-gray-200 bg-red-100 dark:bg-gray-700 rounded mx-auto">
          <span class="w-6 h-6 mr-4 mt-1 text-red-500 dark:text-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </span>
          <div>
            <h2 class="text-lg font-bold text-red-700 dark:text-gray-100">Avertissement</h2>
            <p class="text-sm my-2 text-red-500 dark:text-gray-200 font-medium">{message}</p>
          </div>
        </div>
      </div>
      <footer
        class="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800"
      >
        <button
          onClick={()=>{setModulealert(false);setLodingbtn(false)}}
          class="w-full px-5 py-3 text-sm font-medium leading-5 text-black text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
        >
        Garde le.
        </button>
        <button
          class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-red-600 hover:bg-red-500 focus:outline-none focus:shadow-outline-blue"
        onClick={()=>del_data()}
        >
        Oui, recalcule !
        </button>
      </footer>
    </div>
  </div>
  
}

    
        </div>
      </main>

    )
}

