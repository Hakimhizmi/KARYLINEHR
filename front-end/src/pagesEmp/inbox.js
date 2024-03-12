import axios from "axios"
import { useEffect, useState } from "react"
import { Error_t, Succses } from "../pages/tostify"



export default function Inbox(){
  const [data,setData] = useState([]) 
  const [message,SetMess] = useState()
  const [err,setErr] = useState({})
  const token_M = sessionStorage.getItem('token_M')
  const [loding,setLoding] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData,setCurrentData] = useState([]);
  const maxdata = 20
  const maxPages = Math.ceil(data.length / maxdata);
  const startIndex = (currentPage - 1) * maxdata;
  const endIndex = startIndex + maxdata;
  const [mail,setMail] = useState({})
  const [page,setPage] = useState('inbox')

  async function handler_getmail() {
    setLoding(true)
    await axios.get(`http://localhost:8000/api/mail_Emp/${token_M}`).then(({data})=>{
        setData(data.data);setLoding(false)
  }).catch(()=>{
          Error_t();
      
    })
  }

  async function handler_sendReply() {
    setLoding(true)
    await axios.post(`http://localhost:8000/api/send_reply/${token_M}`,
    {'to':mail.from,'titleMail':mail.titleMail,'descMail':message}
    ).then(({data})=>{
        Succses(data.message);setLoding(false);setErr({});SetMess('')
  }).catch(({response})=>{
    if (response.status == 422) {
      setErr(response.data.errors);setLoding(false)
    }else{
        Error_t();setLoding(false)
    }
    })
  }
  async function handler_sent(id) {
    await axios.get(`http://localhost:8000/api/set_Sent/${id}`)
    setPage('detail')
  }

  useEffect(()=>{
    handler_getmail()
  },[page])

useEffect(()=>{
              setCurrentData(data.slice(startIndex, endIndex))
           },[data,currentPage])


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
          



    return(
      page == 'inbox' ? 
  <div className="flex-1 pb-16 overflow-y-auto px-4 container mx-auto mt-10" >
    <div className="h-16 flex items-center justify-between mt-8 ">
      <div className="flex items-center">
        
        <div className="flex items-center">
          <div className="flex items-center ml-3 ">
            <button title="Reload" onClick={()=>handler_getmail()} className="bg-gray-50  border border-gray-300 text-gray-900 hover:bg-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 py-2 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <span className="bg-gray-300 h-6 w-[.5px] mx-3" />
          
        </div>
      </div>
      <div className="px-2 flex items-center space-x-4">
        <span className="text-sm text-gray-500">{currentPage}-{currentData.length} de {maxPages}</span>
        <div className="flex items-center  dark:text-gray-400 dark:bg-gray-800">
        <button onClick={handlePreviousPage}  className="bg-gray-50  border border-gray-300 text-gray-900 hover:bg-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 py-2 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <svg
                        class="w-5 h-5 fill-current"
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
            <button onClick={handleNextPage} className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 hover:bg-gray-200 focus:border-blue-500 px-4 py-2 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ml-4 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <svg
                        class="w-5 h-5 fill-current"
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
                    
        </div>
      </div>
    </div>
    <div className="w-full overflow-x-auto rounded-lg shadow-xs mt-4">
      <ul>
       
      { loding==true && 
                    <li  class="text-xs font-semibold tracking-wide text-left text-gray-900 uppercase border-b dark:border-gray-700 hover:bg-gray-200 bg-white dark:text-gray-400 dark:bg-gray-800">
                  <div class="text-center p-8">
    <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Chargement...</span>
    </div>
</div>
                 </li>
                 }
                   {currentData.length !=0 && loding == false ? currentData.map((item,index)=>{
                  return(
                    <li  class="text-xs font-semibold tracking-wide text-left text-gray-900  border-b dark:border-gray-700 hover:bg-gray-200 bg-white dark:text-gray-400 dark:bg-gray-800"
                    onClick={()=>{handler_sent(item.idMail);setMail(item)}}
                    >
                      <div className="flex items-center justify-end">
                      <span
                          class={`px-2 py-1 font-semibold leading-tight rounded-full 
                          ${item.status == 'unread' ? 'text-red-700 bg-red-100 dark:bg-red-600 dark:text-red-100' : 
                          'text-blue-700 bg-blue-100 dark:bg-blue-500 dark:text-gray-300'
                          } ` } > {item.status}
                          </span>
                      </div>
                    <div  className="w-full flex items-center justify-between p-1 pl-2 my-1 cursor-pointer">
                      <div className="flex items-center ml-2 ">
                        <span className="w-56  pr-2 truncate">{item.from}</span>
                        <span className="w-64  truncate">{item.titleMail}</span>
                        <span className="w-80 text-gray-500 text-sm truncate">{item.descMail}</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <span className="text-sm text-gray-500">
                         {item.dateSend}
                        </span>
                      </div>
                    </div>
                  </li>
                  )
                   })
                  : loding == false &&
                  <li class="text-xl p-4  tracking-wide text-left text-gray-900 uppercase border-b dark:border-gray-700 hover:bg-gray-200 bg-white dark:text-gray-400 dark:bg-gray-800" >
                <p  class="font-normal mt-4 mb-4 text-center text-gray-400 dark:text-gray-700">Il n'y a pas de données à afficher...</p>
                 </li>
                  }

       
       
      </ul>
    </div>
  </div>


    
                :
              
 

                        
                        <div class="flex-1 px-2 mt-8 ml-4 content ml-12 transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4">
                            <div class="h-16 flex items-center justify-between">
                                <div class="flex items-center  ">
                                    <a href="#" onClick={()=>setPage('inbox')} class="flex items-center text-gray-700 px-2 py-1 space-x-0.5 border border-gray-300 rounded-lg shadow hover:bg-gray-200 dark:text-white transition duration-100" title="Back">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span class="text-sm font-bold ">Retour</span>                                   
                                    </a>
                                    
                                </div>
                                
                            </div>
                            <div class="mb-6 my-4  text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800 bg-white rounded-lg shadow-md dark:bg-gray-800 mt-4 px-4 py-4">
                                <h4 class="text-lg text-gray-800 font-bold pb-2 mb-4 border-b-2 dark:text-gray-300">{mail.titleMail}</h4>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <div class="flex flex-col ml-2">
                                            <span class="text-sm font-semibold">{mail.from == 'setsafrique@admin.ma' ? 'Admin' : 'Employee'}</span>
                                            <span class="text-xs text-gray-400">Depuis: {mail.from}</span>
                                            <span class="text-xs text-gray-400">type: {mail.typeMail}</span>
                                        </div>
                                    </div>
                                    <span class="text-sm text-gray-500">{mail.dateSend}</span>
                                </div>
                                <div class="py-6 pl-2 text-lg text-gray-700 dark:text-gray-300">
                                    <p>Salut {mail.from != 'setsafrique@admin.ma' ? 'Admin' : 'Employee'}!</p>
                                    <p class="mt-4">{mail.descMail} </p>
                                    
                                    
                                </div>
                                
                                <label class="block text-sm mt-4">
    <textarea
        class="block w-full mt-8 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
        rows="5"
        onChange={(e)=>SetMess(e.target.value)}
        placeholder="Write your comment here...."
      ></textarea>
      <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('descMail') ? err.descMail[0] : ''}
                </span>
  </label>

                                <div class="mt-2 flex  items-center space-x-4 ">
                                    {loding == false ? 
                                    <button onClick={()=>handler_sendReply()} class="w-full flex items-center  justify-center space-x-2 py-1.5 text-gray-600 dark:text-gray-100 border border-gray-400 rounded-lg hover:shadow ">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        <span>Répondre</span>
                                    </button> : 
                                    <button disabled type="button" class="w-full flex items-center  justify-center space-x-2 py-1.5 text-gray-600 dark:text-gray-100 border border-gray-400 rounded-lg hover:shadow ">
                                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg>
                                    Chargement...
                                </button> 
}
                                </div>
                                <div class="w-full mt-4 space-y-3 text-gray-700">
       
                                
     
      </div>
                        </div>
                    </div> 


   )
   


}