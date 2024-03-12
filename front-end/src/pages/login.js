import axios from "axios"
import { useState } from "react"
import { Error_login, Error_t } from "./tostify"
import img from '../image/logo1.jpg'


export default function Login() {
    const [data,setData] = useState({})
    const [err,setErr] = useState({})

    function handlergetdata(e) {
        setData({...data , [e.target.name] : e.target.value})
    }

    async function handler_login() {
        await axios.post('http://localhost:8000/api/login',data).then(({data})=>{
            if (data.message == 'invalid login') {
                Error_login(data.message)
            }else{
                sessionStorage.setItem('token_M',data.token_M)
                sessionStorage.setItem('Type_M',data.Type_M)
                window.location.reload()
            }
    }).catch(({response})=>{
          if (response.status == 422) {
            setErr(response.data.errors);
          }else{
              Error_t();
          }
        })
  }
    return(
      <div className="h-screen overflow-y-auto content bg-gray-200 transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4">
  <div class="max-w-4xl login mx-auto overflow-hidden bg-white rounded-lg shadow-xl" 
  >
    <div class="md:flex">
      <div class="md:shrink-0">
        <img class="h-48 w-full object-cover md:h-full md:w-48" src={img} alt="" />
      </div>
      <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
        <div class="w-full">
          <h1 class="mb-10 text-xl font-semibold text-gray-700 mt-10">
            Connectez-vous <span className="text-blue-600">au Système</span>
          </h1>

          <div class="mt-4 text-sm">
            <span class="text-gray-700">Type de compte</span>
            <div class="mt-2">
              <label class="inline-flex items-center text-gray-600 dark:text-gray-400">
                <input
                  type="radio"
                  class="text-blue-600 form-radio focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
                  name="accountType"
                  value="employee"
                  onChange={(e)=>handlergetdata(e)}
                />
                <span class="ml-2">Employée</span>
              </label>
              <label class="inline-flex items-center ml-6 text-gray-600 dark:text-gray-400">
                <input
                  type="radio"
                  class="text-blue-600 form-radio focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
                  name="accountType"
                  value="admin"
                  onChange={(e)=>handlergetdata(e)}
                />
                <span class="ml-2">Administrateur</span>
              </label>
            </div>
            <span class="text-xs text-red-600 ">
              {err.hasOwnProperty('accountType') ? err.accountType[0] : ''}
            </span>
          </div>

          <label class="block text-sm mt-4">
            <span class="text-gray-700">E-mail</span>
            <input
              class="block w-full mt-1 text-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
              placeholder="Jane@gmail.com"
              type="email"
              name="email_M"
              onChange={(e)=>handlergetdata(e)}
            />
            <span class="text-xs text-red-600 ">
              {err.hasOwnProperty('email_M') ? err.email_M[0] : ''}
            </span>
          </label>

         
                <label class="block mt-4 text-sm">
                  <span class="text-gray-700 ">Mot de passe</span>
                  <input
                    class="block w-full mt-1  text-sm  focus:border-purple-400 focus:outline-none focus:shadow-outline-purple  form-input"
                    placeholder="***************"
                    type="password"
                    name="password_M"
                    onChange={(e)=>handlergetdata(e)}
                  />
                  <span class="text-xs text-red-600 ">
                  {err.hasOwnProperty('password_M') ? err.password_M[0] : ''}
                </span>
                </label>
                
                <a
                  class="block w-full px-4 mb-10 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                    onClick={()=>handler_login()}
                    href='#'
                >
                  Connexion
                </a>
  
                <hr class="my-8" />
  
                
  
                
              </div>
            </div>
          </div>
          
        </div>
        <div class="film"></div>

        </div>
    )
}