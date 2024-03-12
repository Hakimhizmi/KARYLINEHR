import { useEffect, useState } from "react"
import { Error_t, Succses } from "./tostify"
import axios from "axios"
import {useNavigate} from 'react-router-dom'




export default function Setting(){
    const [data_login,setData] = useState({})  
    const [data_pass,setDataPass] = useState({})  
    const [err,setErr] = useState({})
    const [loding,setLoding] = useState(false)
    const [loding1,setLoding1] = useState(false)
    const [togle_pass,setTogle] = useState(true)
    const [edit,setEdit] = useState(true)
    const token_M = sessionStorage.getItem('token_M')
const navigate = useNavigate()


    function handlergetdata(e) {
        setData({...data_login , [e.target.name] : e.target.value})
    }
    function handlergetdatapass(e) {
        setDataPass({...data_pass , [e.target.name] : e.target.value})
    }
    async function get_data(){
        await axios.post('http://localhost:8000/api/getlogin_data',{token_M}).then(({data})=>{
            setData(data.data[0])
        }).catch(({})=>{
          Error_t()
        })
        }
        useEffect(()=>{
            get_data()
        },[])

        async function update_data(){
            setLoding(true)
            await axios.post(`http://localhost:8000/api/update_personalINF/${token_M}`,data_login).then(({data})=>{
                Succses(data.message);setEdit(true);setLoding(false);setErr({})
            }).catch(({response})=>{
                if (response.status == 422) {
                    setErr(response.data.errors);setLoding(false)
                  }else{
                      Error_t();setErr({});setLoding(false)
                  }
            })
            }
            
            async function update_pass(){
                setLoding1(true)
                await axios.post(`http://localhost:8000/api/update_password/${token_M}`,data_pass).then(({data})=>{
                    Succses(data.message);setLoding1(false);
                    setTimeout(()=>{
                        navigate('/');
                        sessionStorage.clear();
                        window.location.reload();
                    },800)
                }).catch(({response})=>{
                    if (response.status == 422) {
                        setErr(response.data.errors);setLoding1(false)
                      }else{
                          Error_t();setErr({});setLoding1(false)
                      }
                })
                }

        return(
          <main class="h-full overflow-y-auto content ml-12 transform ease-in-out duration-500 content ml-12 transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4">
          <div className="grid grid-cols-1 px-4 pt-6 dark:bg-gray-900 ">
        <div
            class="px-4 py-3  mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
          >
        <h3 className="mb-4 text-xl font-semibold dark:text-white">Informations Générales</h3>

            <div className="grid grid-cols-2 gap-6">
            
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Prénom</span>
              <input
                className="shadow-sm mt-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"      
                name="FirstName"
                disabled={edit} 
                onChange={(e)=>handlergetdata(e)}
                defaultValue={data_login.FirstName}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('FirstName') ? err.FirstName[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Nom</span>
              <input
               className="shadow-sm mt-1 bg-gray-50 border border-gray-300 text-gray-900  sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"      
                name="LastName"         
                disabled={edit} 
                defaultValue={data_login.LastName}
                onChange={(e)=>handlergetdata(e)}
              />
             <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('LastName') ? err.LastName[0] : ''}
                </span>
            </label>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-4">
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Address</span>
              <input
                disabled={edit} 
                
                 className="shadow-sm mt-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"      
                name="Address"
                onChange={(e)=>handlergetdata(e)}
                defaultValue={data_login.Address}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Address') ? err.Address[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Numéro de téléphone
</span>
              <input
                            disabled={edit} 
                className="shadow-sm mt-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"      
                type='text'
                name="PhoneNumber"
                defaultValue={data_login.PhoneNumber}
                onChange={(e)=>handlergetdata(e)}
              />
                <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('PhoneNumber') ? err.PhoneNumber[0] : ''}
                </span>
            </label>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-4">
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">E-mail</span>
              <input
                disabled={edit} 
                className="shadow-sm mt-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"      
                type='email'
                name="Email"
                onChange={(e)=>handlergetdata(e)}
                defaultValue={data_login.Email}                
              />
               <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Email') ? err.Email[0] : ''}
                </span>
            </label>
           
          
            </div>
            
            
           

            

            <div class="block mt-4 " >
                
            {loding == false ? edit == true ? 
            <div class="flex justify-end">
            <button onClick={()=>setEdit(false)} class="appearance-none bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md mr-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" > 
            Modifier
            </button>
        </div>
            : 
               <div class="flex justify-end">
               <button onClick={()=>update_data()} class="appearance-none bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md mr-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >Sauvegarder</button>
           </div>
              :
              <div class="flex justify-end">
              <button disabled type="button" class="appearance-none bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md mr-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    Chargement...
</button>   </div>
}

            

            </div>
      </div>
      <div
            class="px-4 py-3  mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
          >
        <h3 className="mb-4 text-xl font-semibold dark:text-white">Password information</h3>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="currentpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe actuel</label>
              <input type="text" name="currentpassword" onChange={(e)=>handlergetdatapass(e)}  id="currentpassword" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="••••••••" required />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('currentpassword') ? err.currentpassword[0] : ''}
                </span>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nouveau mot de passe</label>
              <div className="grid grid-cols-2">
              <input onChange={(e)=>handlergetdatapass(e)}  type={togle_pass == true ? 'password' : 'text'}
 name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" required />
              <button
  class="w-full   text-sm font-medium leading-5 text-black text-gray-700 transition-colors duration-150 underline rounded-lg dark:text-gray-400 active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none "
  onClick={()=>setTogle(!togle_pass)}
  >
 {togle_pass == true ? 'Afficher' : 'Masquer'}

</button>
              </div>
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('password') ? err.password[0] : ''}
                </span>

            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="confirmpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmez le mot de passe</label>
              <input type={togle_pass == true ? 'password' : 'text'}
  name="confirmpassword" onChange={(e)=>handlergetdatapass(e)} id="confirmpassword" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="••••••••" required />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('confirmpassword') ? err.confirmpassword[0] : ''}
                </span>
            </div>
            <div className="col-span-6 sm:col-full">
            {loding1 == false ? 
               <div class="flex justify-end">
               <button onClick={()=>update_pass()} class="appearance-none bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md mr-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >Sauvegarder</button>
           </div>
              :
              <div class="flex justify-end">
              <button disabled type="button" class="appearance-none bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md mr-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    Chargement...
</button>   </div>
}            </div>
          </div>
      </div>
      </div>


</main>

    )
}