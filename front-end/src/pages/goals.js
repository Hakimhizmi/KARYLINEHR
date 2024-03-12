import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { Error_t, Succses } from "./tostify";
import { v4 } from 'uuid';



export default function Goals() {
  const [data,setData] = useState({})
  const [module_del,setModule] = useState(false)
  const [module_edit,setModuleedit] = useState(false)
  const [loding,setLoding] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuerySelect, setSearchQuerySelect] = useState("");
  const [searchQuerySelectzone, setSearchQuerySelectZone] = useState("");
  const [data_goals,setData_goals] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData,setCurrentData] = useState([]);
  const maxdata = 50
  const maxPages = Math.ceil(data_goals.length / maxdata);
  const startIndex = (currentPage - 1) * maxdata;
  const endIndex = startIndex + maxdata;
  const ref = useRef(null);
  const [id,setId] = useState()
  const [err,setErr] = useState({})
  const [done,setDone] = useState()



  const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setModule(false);setModuleedit(false) 
        }
      };
          document.addEventListener('mousedown', handleClickOutside);
  

      async function get_data(){
            setLoding(true)
            await axios.get('http://localhost:8000/api/get_goal').then(({data})=>{
              setData_goals(data.data);setLoding(false)
            }).catch(({})=>{
              Error_t()
              setLoding(false)
            })
            }

            useEffect(()=>{
              get_data()
          },[done])

          useEffect(()=>{
            
            if (searchQuery == '') {
              setCurrentData(data_goals.slice(startIndex, endIndex))
            }
           },[searchQuery,data_goals,currentPage])


          
function handlergetdata(e) {
  setData({...data , [e.target.name] : e.target.value})
}


async function handler_SendEdit() {
  setLoding(true)
  await axios.post(`http://localhost:8000/api/Update_goal/${id}`,data).then(({data})=>{
    Succses(data.message);setLoding(false);setData({});setErr({});setModuleedit(false);setDone(v4())
  }).catch(({response})=>{
    if (response.status == 422) {
      setErr(response.data.errors);setLoding(false)
    }else{
        Error_t();setLoding(false)
    }
  })
}
async function del_data() {
  await axios.get(`http://localhost:8000/api/del_goal/${id}`).then(({data})=>{
    setModule(false);setDone(v4());Succses(data.message)
  }).catch(({})=>{
    Error_t()
  })
}

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
  if (searchQuery != '' || searchQuerySelect != '' || searchQuerySelectzone != '') {
      const filteredData = data_goals.filter((item) => {
        const nameMatch = searchQuery ? item.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.LastName.toLowerCase().includes(searchQuery.toLowerCase())  : true;
        const status = searchQuerySelect ? item.GoalStatus === searchQuerySelect : true;
        const zone = searchQuerySelectzone ? item.Zone === searchQuerySelectzone : true;
        return nameMatch && status && zone;
      });
      setCurrentData(filteredData)
  }
  },[searchQuery,searchQuerySelect,searchQuerySelectzone])
  useEffect(()=>{
    if (searchQuery === '' && searchQuerySelect === '' &&  searchQuerySelectzone === '') {
      setCurrentData(data_goals.slice(startIndex, endIndex))
    }
   },[searchQuery,data_goals,currentPage,searchQuerySelect,searchQuerySelectzone])


    return(
      <main class="h-full pb-16  overflow-y-auto pt-20 ml-12">

        <div class="container px-6 mx-auto ">

        
            
          <div >
          <div className="grid grid-row-2 gap-2 mb-5">

          <h4
          class="mb-4 mt-4 w-full text-lg font-semibold text-gray-600 dark:text-gray-300"
        >
        Tous les objectifs des employés
        </h4>
       
<div class="w-full md:w-2/3 shadow p-5 rounded-lg bg-white dark:bg-gray-800">
  <div class="relative">
	<div class="absolute flex right-0 items-center mr-3 h-full ">
	  <svg class="w-4 h-4 fill-current text-primary-gray-dark " viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M15.8898 15.0493L11.8588 11.0182C11.7869 10.9463 11.6932 10.9088 11.5932 10.9088H11.2713C12.3431 9.74952 12.9994 8.20272 12.9994 6.49968C12.9994 2.90923 10.0901 0 6.49968 0C2.90923 0 0 2.90923 0 6.49968C0 10.0901 2.90923 12.9994 6.49968 12.9994C8.20272 12.9994 9.74952 12.3431 10.9088 11.2744V11.5932C10.9088 11.6932 10.9495 11.7869 11.0182 11.8588L15.0493 15.8898C15.1961 16.0367 15.4336 16.0367 15.5805 15.8898L15.8898 15.5805C16.0367 15.4336 16.0367 15.1961 15.8898 15.0493ZM6.49968 11.9994C3.45921 11.9994 0.999951 9.54016 0.999951 6.49968C0.999951 3.45921 3.45921 0.999951 6.49968 0.999951C9.54016 0.999951 11.9994 3.45921 11.9994 6.49968C11.9994 9.54016 9.54016 11.9994 6.49968 11.9994Z"></path>
	  </svg>
	</div>

	<input type="text" placeholder="Rechercher par prénom ou nom"   onChange={(e)=>setSearchQuery(e.target.value)} class="bg-gray-50 h-8 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-1.7  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
	  </div>

	<div class="flex items-center justify-between mt-2">
	  <p class="font-medium dark:text-gray-400">
		Filtres
	  </p>

	  <button onClick={()=>{setSearchQuerySelect('');setSearchQuerySelectZone('')}} class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
		Réinitialiser le filtre
	  </button>
	</div>

	<div>
	  <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-1">
    <select
        class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        name="GoalStatus"
        value={searchQuerySelect}
        onChange={(e) => {
            setSearchQuerySelect(e.target.value);
        }}
      >
        <option value='' >tous les statuts</option>
        <option value='Not Started'>Not Started</option>
        <option value='On Track'>On Track</option>
        <option value='Overdue'>Overdue </option>
        <option value='Complete'>Complete</option>
      </select>



		<select  onChange={(e) => {
            setSearchQuerySelectZone(e.target.value);
        }} 
        value={searchQuerySelectzone}
        class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
		    <option value="">toutes les zones</option>
        <option value='Zone A'>Zone A</option>
        <option value='Zone B'>Zone B</option>
        <option value='Zone C'>Zone C</option>
        <option value='Zone D'>Zone D</option>
        <option value='Zone E'>Zone E</option>
		</select>

		
	  </div>
	</div>
  </div>



        </div>
          
        
         
          
        <div class="w-full overflow-hidden rounded-lg shadow-xs">
          <div class="w-full overflow-x-auto">
            <table class="w-full whitespace-no-wrap">
              <thead>
                <tr
                  class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                >
                  <th class="px-4 py-3">employé(e)</th>
                  <th class="px-4 py-3">Nom de l'objectif
</th>
<th class="px-4 py-3">zone de travail</th>
                  <th class="px-4 py-3">Description de l'objectif</th>
                  <th class="px-4 py-3">Date de début de l'objectif</th>
                  <th class="px-4 py-3">Date de fin de l'objectif</th>
                  <th class="px-4 py-3">État de l'objectif</th>
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
                      {item.FirstName} {item.LastName}
                    </td>
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
                             ${item.GoalStatus == 'Overdue' && 'text-red-700 bg-red-100 dark:bg-red-600 dark:text-red-100' }
                             ${item.GoalStatus == 'Complete' && 'text-blue-700 bg-blue-100 dark:bg-blue-500 dark:text-blue-100' }
                             `}
                          >
                           {item.GoalStatus }
                          </span>
                      
                    </td>
                    
                    <td class="px-4 py-3">
                      <div class="flex items-center space-x-4 text-sm">
                        <button
                          class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-blue-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                          aria-label="Edit"
                          onClick={()=>{setModuleedit(true);setId(item.GoalID)
                            setData(item)
                          }}
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
                          onClick={()=>{setModule(true);setId(item.GoalID)}}
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
            Affichage  {currentPage}-{currentData.length} de {maxPages}
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


        {module_del && 
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
  <p class="text-sm my-2 text-red-500 dark:text-gray-200 font-medium">Es-tu sûr de vouloir supprimer ceci ?</p>
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
Garder cela.
</button>
<button
class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-red-600 hover:bg-red-500 focus:outline-none focus:shadow-outline-blue"
onClick={()=>del_data()}
>
Oui, supprimez-le !
</button>
</footer>
</div>
</div>

}

{module_edit && <div

class="fixed inset-0 z-30 flex ml-12 items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
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
Modification des informations d'un employé

</p>

<label class="block text-sm">
    <span class="text-gray-700 dark:text-gray-400">Titre de l'objectif</span>
    <input
      class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
      placeholder="Saisir Titre.."
      value={data.GoalName}
      name='GoalName'
      onChange={(e)=>handlergetdata(e)}
    />
     <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('GoalName') ? err.GoalName[0] : ''}
                </span>
  </label>
  <label class="block text-sm mt-4">
    <span class="text-gray-700 dark:text-gray-400">zone de travail</span>
    <select
        class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
        name="Zone"
        value={data.Zone}
        onChange={(e)=>handlergetdata(e)}
        >
        <option value='Zone A'>Zone A</option>
        <option value='Zone B'>Zone B</option>
        <option value='Zone C'>Zone C</option>
        <option value='Zone D'>Zone D</option>
        <option value='Zone E'>Zone E</option>
      </select>
      <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Zone') ? err.Zone[0] : ''}
                </span>
  </label>
  <label class="block text-sm mt-4">
    <span class="text-gray-700 dark:text-gray-400">Description de l'objectif</span>
    <textarea
        class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
        rows="5"
        placeholder="Saisir Description.."
        value={data.GoalDescription}
        name='GoalDescription'
        onChange={(e)=>handlergetdata(e)}
      ></textarea>
      <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('GoalDescription') ? err.GoalDescription[0] : ''}
                </span>
  </label>
  <div className="grid grid-cols-2 gap-6 mt-4">
 
  <label class="block text-sm">
    <span class="text-gray-700 dark:text-gray-400">Date de début de l'objectif</span>
    <input
      class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
      type='date'
      value={data.GoalStartDate}
      name='GoalStartDate'
      onChange={(e)=>handlergetdata(e)}
    />
    <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('GoalStartDate') ? err.GoalStartDate[0] : ''}
                </span>
  </label>
  <label class="block text-sm">
    <span class="text-gray-700 dark:text-gray-400">Date de fin de l'objectif</span>
    <input
      class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
      type='date'
      name="GoalEndDate"
      value={data.GoalEndDate}
      onChange={(e)=>handlergetdata(e)}
    />
    <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('GoalEndDate') ? err.GoalEndDate[0] : ''}
                </span>
  </label>
  </div>
 
  
  <label class="block text-sm mt-4">
    <span class="text-gray-700 dark:text-gray-400">État de l'objectif</span>
    <select
        class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
        value={data.GoalStatus}
        name="GoalStatus"
        onChange={(e)=>handlergetdata(e)}
      >
        <option disabled selected>Sélectionnez le type de statut</option>
        <option value='Not Started'>Not Started</option>
        <option value='On Track'>On Track</option>
        <option value='Overdue'>Overdue </option>
        <option value='Complete'>Complete</option>
      </select>
      <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('GoalStatus') ? err.GoalStatus[0] : ''}
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
Annuler
</button>
{loding == false ? 
<button
  class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
  onClick={()=>handler_SendEdit()}
>
Mettre à jour
</button> :
 <button disabled type="button" class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
 <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
 </svg>
 Chargement...
</button> }
</footer>
</div>
</div>}

        </div>
      </main>

    )
}