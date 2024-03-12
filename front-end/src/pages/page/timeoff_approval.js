import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Error_t, Succses } from "../tostify";




export default function Approval() {
    const [loding,setLoding] = useState(false)
    const [loding_btn,setLodingbtn] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [data_timeoffApp,setData_timeApproval] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData,setCurrentData] = useState([]);
    const [searchQuerySelect,setSearchQuerySelect] = useState('')
    const maxdata = 50
    const maxPages = Math.ceil(data_timeoffApp.length / maxdata);
    const startIndex = (currentPage - 1) * maxdata;
    const endIndex = startIndex + maxdata;
    const [module_edit,setModuleedit] = useState(false)
    const [err,setErr] = useState({})
    const ref = useRef(null);
    const [data,setData] = useState({})
    const [id,setId] = useState()

    function handlergetdata(e) {
      setData({...data , [e.target.name] : e.target.value})
    }

    async function get_data_approval(){
        setLoding(true)
        await axios.get('http://localhost:8000/api/get_data_approval').then(({data})=>{
            setData_timeApproval(data.data);setLoding(false)
        }).catch(({})=>{
          Error_t()
          setLoding(false)
        })
        }

        useEffect(()=>{
            get_data_approval()
        },[err])

       

         async function handler_SendEdit() {
          setLodingbtn(true)
          await axios.post(`http://localhost:8000/api/Update_timeoffreq/${id}`,data).then(({data})=>{
            Succses(data.message);setLodingbtn(false);setData({});setErr({});setModuleedit(false)
          }).catch(({response})=>{
            if (response.status == 422) {
              setErr(response.data.errors);setLodingbtn(false)
            }else{
                Error_t();setLodingbtn(false)
            }
          })
        }
       
        function handler_editData(ApprovalDate,ApprovalComments,TimeOffStartDate,TimeOffEndDate,TimeOffStatus) {
          setData({ApprovalDate,ApprovalComments,TimeOffStartDate,TimeOffEndDate,TimeOffStatus})
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
  if (searchQuery == '' || searchQuerySelect  == '') {
    setCurrentData(data_timeoffApp.slice(startIndex, endIndex))
  }
 },[searchQuery,data_timeoffApp,currentPage,searchQuerySelect])


useEffect(()=>{
  if (searchQuery != '' || searchQuerySelect != '') {
      const filteredData = data_timeoffApp.filter((item) => {
        const nameMatch = searchQuery ? item.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.LastName.toLowerCase().includes(searchQuery.toLowerCase())  : true;
        const status = searchQuerySelect ? item.TimeOffStatus === searchQuerySelect : true;
        return nameMatch && status ;
      });
      setCurrentData(filteredData)
  }
  },[searchQuery,searchQuerySelect])


    return(

        <div >
        <div className="grid grid-row-2  mb-5">

        <h4
class="mb-4 mt-4 w-full text-lg font-semibold text-gray-600 dark:text-gray-300"
>
Tous congés acceptés ou refusés
</h4>
    
<div class="px-4 py-3  mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          

       
          <div class="grid grid-cols-2 gap-6 mb-3">
          <label class="block text-sm ">
          <span class="text-gray-700  dark:text-gray-400">sélectionner le statut</span>
          <select
        class="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={(e) => {
            setSearchQuerySelect(e.target.value);
        }}
      >
        <option value='' >tous les statuts</option>
        <option value='approved'>Approuvé</option>
        <option value='rejected'>Rejeté</option>
      </select>
            </label>
            <label class="block text-sm ">
                        <span class="text-gray-700 dark:text-gray-400">Nom de l'employé</span>
                        <input
                          class="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Recherche par prénom ou nom"
                          id="simple-search"
                          onChange={(e)=>setSearchQuery(e.target.value)}
                        />
          
                      </label>
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
                <th class="px-4 py-3">Employé</th>
                <th class="px-4 py-3">Date d'approbation</th>
                <th class="px-4 py-3">Commentaires d'approbation</th>
                <th class="px-4 py-3">Date de début du congé	</th>
                <th class="px-4 py-3">Date de fin du congé</th>
                <th class="px-4 py-3">Statut de congé</th>
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
    {item.ApprovalDate}
    </td>
    <td class="px-4 py-3 text-sm" title={item.ApprovalComments}>
     <p className="w-80 truncate">{item.ApprovalComments}</p>
    </td>
    <td class="px-4 py-3 text-sm">
      {item.TimeOffStartDate}
    </td>
    <td class="px-4 py-3 text-sm">
    {item.TimeOffEndDate}
    </td>
    <td class="px-4 py-3 text-sm">
    <span
            class={`px-2 py-1 font-semibold leading-tight  rounded-full 
            ${item.TimeOffStatus == 'approved' && 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100' } 
            ${item.TimeOffStatus == 'rejected' && 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100' }  `}
          >
            {item.TimeOffStatus}
          </span>
      
    </td>
    <td class="px-4 py-3 text-sm">
    <button
                          class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-blue-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                          aria-label="Edit"
                          onClick={()=>{setModuleedit(true);setId(item.ApprovalID)
                            handler_editData(item.ApprovalDate,item.ApprovalComments,item.TimeOffStartDate,item.TimeOffEndDate,item.TimeOffStatus)
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
                        </button></td>

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



{module_edit && <div

class="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
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
Modifier les informations sur les congés</p>

<label class="block text-sm">
    <span class="text-gray-700 dark:text-gray-400">commentaires</span>
    <input
      class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
      placeholder="Entrez le titre.."
      value={data.ApprovalComments}
      name='ApprovalComments'
      onChange={(e)=>handlergetdata(e)}
    />
     <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('ApprovalComments') ? err.ApprovalComments[0] : ''}
                </span>
  </label>
  <div className="grid grid-cols-2 gap-8 mt-4">
  <label class="block text-sm mt-4">
    <span class="text-gray-700 dark:text-gray-400">Date d'approbation</span>
    <input
      class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
      type='date'
      value={data.ApprovalDate}
      name='ApprovalDate'
      onChange={(e)=>handlergetdata(e)}
    />
    <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('ApprovalDate') ? err.ApprovalDate[0] : ''}
                </span>
  </label>
  <label class="text-sm mt-4">
  <button
  class="w-full px-5 mt-6 py-3 text-sm font-medium leading-5 text-black text-gray-700 transition-colors duration-150 underline rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
  onClick={() => setData({...data , 'ApprovalDate' : new Date().toISOString().slice(0, 10) })}
  >
Now
</button></label>
  </div>
  <div className="grid grid-cols-2 gap-6 mt-4">
 
  <label class="block text-sm">
    <span class="text-gray-700 dark:text-gray-400">Date de début de congé</span>
    <input
      class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
      type='date'
      value={data.TimeOffStartDate}
      name='TimeOffStartDate'
      onChange={(e)=>handlergetdata(e)}
    />
    <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('TimeOffStartDate') ? err.TimeOffStartDate[0] : ''}
                </span>
  </label>
  <label class="block text-sm">
    <span class="text-gray-700 dark:text-gray-400">Date de fin  de congé</span>
    <input
      class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
      type='date'
      name="TimeOffEndDate"
      value={data.TimeOffEndDate}
      onChange={(e)=>handlergetdata(e)}
    />
    <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('TimeOffEndDate') ? err.TimeOffEndDate[0] : ''}
                </span>
  </label>
  </div>
 
  
  <label class="block text-sm mt-4">
    <span class="text-gray-700 dark:text-gray-400">Statut de congé</span>
    <select
        class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
        value={data.TimeOffStatus}
        name="TimeOffStatus"
        onChange={(e)=>handlergetdata(e)}
      >
        <option disabled >Sélectionnez le type de statut</option>
        <option value='approved'>Approuvé</option>
        <option value='rejected'>Rejeté </option>
      </select>
      <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('TimeOffStatus') ? err.TimeOffStatus[0] : ''}
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
onClick={()=>handler_SendEdit()}
>
Mise à jour
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
        </div>  </div> 
       





    )
}