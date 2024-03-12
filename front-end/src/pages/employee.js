import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { v4 } from 'uuid';
import { Error_t, Succses } from "./tostify";
import { useNavigate } from "react-router-dom";
import { Export_form } from "./page/export_form";
import { read, utils } from 'xlsx';
import img from '../image/excel.png'
import moment from 'moment';
import * as XLSX from 'xlsx';


export default function Employee() {
  const [type,settype] = useState("par")
  const [module_del,setModule] = useState(false)
  const [module_edit,setModuleedit] = useState(false)
  const [module_Account,setModAccount] = useState(false)
  const [module_goals,setModulegoals] = useState(false)
  const [data,setData] = useState({})  
  const [err,setErr] = useState({})
  const [loding,setLoding] = useState(false)
  const ref = useRef(null);
  const [data_emp,setData_emp] = useState([])
  const [done,setDone] = useState()
  const [id,setId] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const maxdata = 50
  const maxPages = Math.ceil(data_emp.length / maxdata);
  const startIndex = (currentPage - 1) * maxdata;
  const endIndex = startIndex + maxdata;
  const [searchQuery, setSearchQuery] = useState("");
  let [currentData,setCurrentData] = useState([]);
  const [data_goals,setDatagoals] = useState({})
  const navigate = useNavigate()
  const [loding_1,setLoding1] = useState(false)
  const [togle_pass,setTogle] = useState(true)
  const [typeOfAdd,settypeOfAdd] = useState("manual")


  const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setModule(false);setModuleedit(false);setModulegoals(false);setModAccount(false)
        }
      };
        document.addEventListener('mousedown', handleClickOutside);
        

function handlergetdata(e) {
    setData({...data , [e.target.name] : e.target.value})
}

function handlergetdata_goals(e) {
  setDatagoals({...data_goals , [e.target.name] : e.target.value})
}
async function handler_send() {
      setLoding(true)
      await axios.post('http://localhost:8000/api/add_employee',data).then(({data})=>{
        setDone(v4());Succses(data.message);settype('par');setData({});setErr({});setLoding(false)
      }).catch(({response})=>{
        if (response.status == 422) {
          setErr(response.data.errors);setLoding(false)
        }else{
            Error_t();setLoding(false)
        }
      })
}
async function handler_send_goals() {
  setLoding1(true)
  await axios.post(`http://localhost:8000/api/add_goal/${id}`,data_goals).then(({data})=>{
    Succses(data.message)
    setErr({});setDatagoals({});setModulegoals(false);navigate('/goals');setLoding1(false)
  }).catch(({response})=>{
    if (response.status == 422) {
      setErr(response.data.errors);setLoding1(false);setLoding1(false)
    }else{
        Error_t();setErr({});setLoding1(false)
    }
  })
  
}
async function get_data(){
  setLoding(true)
  await axios.get('http://localhost:8000/api/get_employees').then(({data})=>{
    setData_emp(data.data);setLoding(false)
  }).catch(({})=>{
    Error_t();setLoding(false)
  })
  }
useEffect(()=>{
    get_data()
},[done])
async function del_data() {
  await axios.get(`http://localhost:8000/api/del_employees/${id}`).then(({data})=>{
    setModule(false);setDone(v4());Succses(data.message);setCurrentPage(1)
  }).catch(({})=>{
    Error_t()
  })
}
function handler_editData(FirstName,LastName,Gender,DateOfBirth,Address,PhoneNumber,Email,HireDate) {
    setData({FirstName,LastName,Gender,DateOfBirth,Address,PhoneNumber,Email,HireDate})
}
function handler_showAccount(item) {
  setData(item)
}
async function handler_SendEdit() {
      setLoding(true)
      await axios.post(`http://localhost:8000/api/Update_employee/${id}`,data).then(({data})=>{
            setDone(v4());Succses(data.message);settype('par');setData({})
            setErr({});setModuleedit(false);setLoding(false);setSearchQuery('')
            document.getElementById('simple-search').value = ''
      }).catch(({response})=>{
        if (response.status == 422) {
          setErr(response.data.errors);setLoding(false)
        }else{
            Error_t();setLoding(false)
        }
      })
}
 useEffect(()=>{
  if (searchQuery == '') {
    setCurrentData(data_emp.slice(startIndex, endIndex))
  }
 },[searchQuery,data_emp,currentPage])


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
      setCurrentData(data_emp.filter((item)=> 
       item.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.LastName.toLowerCase().includes(searchQuery.toLowerCase())  ))
    }
  },[searchQuery])

  

  const [valid,setValid] = useState('')

  const handleFileImport = (e) => {

    const file = e.target.files[0];
const reader = new FileReader();

reader.onload = (e) => {
  const data = new Uint8Array(e.target.result);
  const workbook = XLSX.read(data, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

  // Check header of excel
  const headers = Object.keys(jsonData[0]);
  const expectedHeaders = ['FirstName', 'LastName', 'Gender', 'DateOfBirth', 'Address', 'PhoneNumber', 'Email', 'HireDate'];
  const headersMatchExpected = JSON.stringify(headers) === JSON.stringify(expectedHeaders);

  

  if (headersMatchExpected) {
    const processedData = jsonData.map((row) => {
      const processedRow = {};
      for (let key in row) {
        const value = row[key];
        if (moment(value, moment.ISO_8601, true).isValid()) {
          processedRow[key] = moment(value).format('YYYY-MM-DD');
        } else {
          processedRow[key] = value;
        }
      }
      return processedRow;
    });
    axios.post('http://localhost:8000/api/add_many', processedData)
      .then(({data}) => {
        Succses(data.message);
        setValid(true);
        setDone(v4());
      })
      .catch(() => {
        setValid(false);
      });
  } else {
    setValid(false);
  }
};

reader.readAsArrayBuffer(file);
  };


    return(
      <main class="h-full pb-16  overflow-y-auto pt-20 ml-12">

        <div class="container px-6 mx-auto">

        <nav class="flex text-sm font-medium">

              <a  onClick={()=>{settype("par");setErr({})}} href="#" className={`-mb-px w-full text-center  p-4 text-gray-700 dark:text-gray-200 ${type == "par" ? 'border-b border-blue-600' : ''}`}>
              Parcourir
              </a>
            
              <a   onClick={()=>{settype("ajo")}} href="#" className={`-mb-px w-full text-center  p-4 text-gray-700 dark:text-gray-200 ${type == "ajo" ? 'border-b border-blue-600' : ''}`}>
              Ajouter
              </a>
          
            </nav>
            
            {type == "ajo" ? 
<div >
          
         
         

          <div class="flex flex-col text-center w-full mb-4 mt-6">
      <h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900 dark:text-gray-100"> Ajouter un nouveau
</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">Veuillez choisir comment ajouter.</p>
      <div class="flex mx-auto border-2 border-blue-500 rounded overflow-hidden mt-2">
        <button onClick={()=>settypeOfAdd('manual')} class={`py-1 px-4 dark:text-white ${typeOfAdd == 'manual' ? 'bg-blue-500 text-white ' : ''} focus:outline-none`}>Manuel</button>
        <button onClick={()=>settypeOfAdd('import')} class={`py-1 px-4 dark:text-white ${typeOfAdd == 'import' ? 'bg-blue-500 text-white ' : ''} focus:outline-none`}>Importer</button>
      </div>
    </div>
         {typeOfAdd == 'manual' ? 
          <div
            class="px-4 py-3 mt-4  mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
          >

            <div className="grid grid-cols-2 gap-6">
           
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Prénom</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="William  "
                name="FirstName"
                onChange={(e)=>handlergetdata(e)}
                
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('FirstName') ? err.FirstName[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Nom</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Hadden"
                name="LastName"
                onChange={(e)=>handlergetdata(e)}
              />
             <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('LastName') ? err.LastName[0] : ''}
                </span>
            </label>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Genre</span>
              <select
                  class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
                  name="Gender"
                  onChange={(e)=>handlergetdata(e)}
                  
                >
                  <option disabled selected>Sélectionnez le genre</option>
                  <option value='male'>Homme</option>
                  <option value='female'>Femme</option>
                </select>
                <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Gender') ? err.Gender[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Date de naissance
</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type='date'
                name="DateOfBirth"
                onChange={(e)=>handlergetdata(e)}
                
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('DateOfBirth') ? err.DateOfBirth[0] : ''}
                </span>
            </label>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Address</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Worthington, OH 43085                "
                name="Address"
                onChange={(e)=>handlergetdata(e)}
                
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Address') ? err.Address[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Numéro de téléphone
</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="0615458795"
                type='number'
                name="PhoneNumber"
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
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="WilliamRHadden@jourrapide.com "
                type='email'
                name="Email"
                onChange={(e)=>handlergetdata(e)}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                
              />
               <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Email') ? err.Email[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Date d'embauche
</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type='date'
                name="HireDate"
                onChange={(e)=>handlergetdata(e)}
                
              />
               <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('HireDate') ? err.HireDate[0] : ''}
                </span>
            </label>
          
            </div>
            
            
           

            

            <div class="block mt-4 " >
            {loding == false ? 
              <button
                class="px-5 py-3 block w-full font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                onClick={(e)=>handler_send(e)}
              >
            AJOUTER
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
            :
            
            <div className="px-6 py-4 mx-auto  lg:max-w-screen-xl  ">
  <div className="grid gap-6  row-gap-10 lg:grid-cols-2">
    <div className="lg:py-6 lg:pr-16">
      <div className="flex mt-4">
        <div className="flex flex-col items-center mr-4">
          <div>
            <div className="flex items-center justify-center w-10 h-10 border rounded-full ">
              <svg className="w-4 text-gray-600 dark:text-gray-100" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <line fill="none" stroke-miterlimit="10" x1="12" y1="2" x2="12" y2="22"></line>
                <polyline fill="none" stroke-miterlimit="10" points="19,15 12,22 5,15"></polyline>
              </svg>
            </div>
          </div>
          <div className="w-px h-full bg-gray-300"></div>
        </div>
        <div className="pt-1 pb-8">
          <p className="mb-2 text-lg font-bold dark:text-gray-100">Étape 1</p>
          <p className="text-gray-700 dark:text-gray-400">
          Définissez les titres de champ comme celui-ci : 
          <img src={img}/>   
          Vous pouvez copier les champs et les mettre dans un fichier Excel : 
          <div className="mx-5 lg:w-12/12 mt-4 bg-gray-800 shadow-2xl rounded-lg overflow-hidden ">
            <div id="header-buttons" className="py-3 px-4 flex">
                <div className="rounded-full w-3 h-3 bg-red-500 mr-2"></div>
                <div className="rounded-full w-3 h-3 bg-yellow-500 mr-2"></div>
                <div className="rounded-full w-3 h-3 bg-green-500"></div>
            </div>
            <div id="code-area" className="py-4 px-4 mt-1 text-white text-xl">
                <div className="mb-2">
                    <span className="text-yellow-300">FirstName <span className="text-green-400">|</span> LastName <span className="text-green-400">|</span> Gender <span className="text-green-400">|</span> DateOfBirth <span className="text-green-400">|</span>  Address <span className="text-green-400">|</span> PhoneNumber <span className="text-green-400">|</span> Email <span className="text-green-400">|</span> HireDate</span> 
                </div>

            
            </div>
        </div>       </p>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="flex flex-col items-center mr-4">
          <div>
            <div className="flex items-center justify-center w-10 h-10 border rounded-full">
              <svg className="w-4 text-gray-600 dark:text-gray-100" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <line fill="none" stroke-miterlimit="10" x1="12" y1="2" x2="12" y2="22"></line>
                <polyline fill="none" stroke-miterlimit="10" points="19,15 12,22 5,15"></polyline>
              </svg>
            </div>
          </div>
          <div className="w-px h-full bg-gray-300"></div>
        </div>
        <div className="pt-1 pb-8">
          <p className="mb-2 text-lg font-bold dark:text-gray-100">Étape 2</p>
          <p className="text-gray-700 dark:text-gray-400">
          Ils doivent vérifier que tous les champs doivent être remplis  !!        </p>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="flex flex-col items-center mr-4">
          <div>
            <div className="flex items-center justify-center w-10 h-10 border rounded-full">
              <svg className="w-4 text-gray-600 dark:text-gray-100" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <line fill="none" stroke-miterlimit="10" x1="12" y1="2" x2="12" y2="22"></line>
                <polyline fill="none" stroke-miterlimit="10" points="19,15 12,22 5,15"></polyline>
              </svg>
            </div>
          </div>
          <div className="w-px h-full bg-gray-300"></div>
        </div>
        <div className="pt-1 pb-8">
          <p className="mb-2 text-lg font-bold dark:text-gray-100">Étape 3</p>
          <p className="text-gray-700 dark:text-gray-400">
          Importer le fichier :
          <input onChange={(e)=>handleFileImport(e)} className="block mt-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />
     </p>
        </div>
      </div>
      
      {valid === true && 
      <div className="flex mt-6">
        <div className="flex flex-col items-center mr-4">
          <div>
            <div className="flex items-center justify-center w-10 h-10 border rounded-full">
              <svg className="w-6 text-gray-600 dark:text-gray-100" stroke="currentColor" viewBox="0 0 24 24">
                <polyline fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="6,12 10,16 18,8"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div className="pt-1 mt-4">
          <p className="mb-2 text-lg font-bold dark:text-gray-100">Success</p>
          <p className="text-gray-700"></p>
        </div>
      </div>}
      {valid === '' && 
      <div className="flex mt-6">
        <div className="flex flex-col items-center mr-4">
          <div>
            <div className="flex items-center animate-spin dark:text-gray-100 justify-center w-10 h-10 border rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>

            </div>
          </div>
        </div>
        <div className="pt-1">
          <p className="mb-2 text-lg font-bold dark:text-gray-100">chargement</p>
          <p className="text-gray-700"></p>
        </div>
      </div>}
      {valid === false && 
      <div className="flex mt-6">
        <div className="flex flex-col items-center mr-4">
          <div>
            <div className="flex items-center justify-center  w-10 h-10 border border-red-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="red" className="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>


            </div>
          </div>
        </div>
        <div className="pt-1">
          <p className="mb-2 text-lg text-red-600  font-bold">Une erreur s'est produite, veuillez vérifier les termes</p>
          <p className="text-gray-700"></p>
        </div>
      </div>}
    </div>

    <div className="relative hidden md:block">
      <img
        className="inset-0 object-cover object-bottom w-full rounded shadow-lg  "
        src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
        alt=""
        style={{height:'70%'}}
      />
    </div>
  </div>
</div> }



          </div>

:
          <div >
<div className="grid grid-cols-2 gap-6 mb-5">

          <h4
          class="mb-4 mt-4 w-full text-lg font-semibold text-gray-600 dark:text-gray-300"
        >
        Tous les employés
        </h4>
        <form class="flex items-center h-5 mt-10">   
    <label for="simple-search" class="sr-only">Recherche</label>
    <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
        </div>
        <input  onChange={(e)=>setSearchQuery(e.target.value)} type="text" id="simple-search" class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-1.7  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Rechercher par prénom ou nom "  />
    </div>
    
</form>
        
          </div>
        
         
          
        <div class="w-full overflow-hidden rounded-lg shadow-xs">
          <div class="w-full overflow-x-auto">
            <table class="w-full whitespace-no-wrap ">
              <thead>
                <tr
                  class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                >
                  <th class="px-4 py-3"># </th>
                  <th class="px-4 py-3">Nom complet
</th>
                  <th class="px-4 py-3">Genre</th>
                  <th class="px-4 py-3">Date de naissance</th>
                  <th class="px-4 py-3">Address</th>
                  <th class="px-4 py-3">Numéro de téléphone</th>
                  <th class="px-4 py-3">E-mail</th>
                  <th class="px-4 py-3">Date d'embauche</th>
                  <th class="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody
                class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800 "
              >
                 {loding==true && 
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
                    <tr key={index} class="text-gray-700 dark:text-gray-400">
                    <td class="px-4 py-3 text-sm ">
                      {item.EmployeeID}
                    </td>
                    <td class="px-4 py-3  text-sm ">
                      <p className="w-32 truncate" title={item.FirstName+""+item.LastName}>{item.FirstName}  {item.LastName}</p>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      {item.Gender}
                    </td>
                    <td class="px-4 py-3 text-sm">
                      {item.DateOfBirth}
                    </td>
                    <td class="px-4 py-3 text-sm">
                    <p className="w-44 truncate" title={item.Address}>{item.Address}</p>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      {item.PhoneNumber}
                    </td>
                    <td class="px-4 py-3 text-sm">
                    <p className="w-44 truncate" title={item.Email}> {item.Email}</p>
                    </td>
                    <td class="px-4 py-3 text-sm">
                    {item.HireDate}
                    </td>
                    
                    <td class="px-4 py-3">
                      <div class="flex items-center  text-sm">
                      
<button
                          class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-blue-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                          aria-label="account"
                          title="Show Account"
                          onClick={()=>{setModAccount(true);
                            handler_showAccount(item)}}
                        >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>

                        </button>
                      <button
                          class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-blue-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                          aria-label="goals"
                          title="Add goals"
                          onClick={()=>{setModulegoals(true);setId(item.EmployeeID)}}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
</svg>

                        </button>
                        <button
                          class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-blue-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                          aria-label="Edit"
                          title="Edit information"
                          onClick={()=>{setModuleedit(true);setId(item.EmployeeID);
                            handler_editData(item.FirstName,item.LastName,item.Gender,item.DateOfBirth
                              ,item.Address,item.PhoneNumber,item.Email,item.HireDate
                              )}}
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
                          title="Delete Employee"
                          onClick={()=>{setModule(true);setId(item.EmployeeID);
                           
                          }}
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
                })
                : loding == false &&
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
    class={`fixed inset-0 z-30 ml-12 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center `}
    aria-hidden="true"
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
            <p class="text-sm my-2 text-red-500 dark:text-gray-200 font-medium">Êtes-vous sûr de vouloir supprimer ceci ?
</p>
          </div>
        </div>
      </div>
      <footer
        class="flex flex-cols items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-2 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800"
      >
        <button
          onClick={()=>setModule(false)}
          class="w-full px-5 py-3 text-sm font-medium leading-5 text-black text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
        >
       Garder cela.
        </button>
        <button
          class="w-full   px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-red-600 hover:bg-red-500 focus:outline-none focus:shadow-outline-blue"
          onClick={()=>del_data()}
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
            Modification des informations d'un employé
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Prenom</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="William  "
                value={data.FirstName}
                name="FirstName"
                onChange={(e)=>handlergetdata(e)}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('FirstName') ? err.FirstName[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Nom</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Hadden"
                value={data.LastName}
                name="LastName"
                onChange={(e)=>handlergetdata(e)}
              />
                  <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('LastName') ? err.LastName[0] : ''}
                </span>
            </label>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Genre</span>
              <select
                  class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
                  value={data.Gender}
                  name="Gender"
                  onChange={(e)=>handlergetdata(e)}
                >
                  <option value='male'  >Homme</option>
                  <option value='female'>Femme</option>
                </select>
                <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Gender') ? err.Gender[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Date de naissance</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type='date'
                value={data.DateOfBirth}
                name="DateOfBirth"
                onChange={(e)=>handlergetdata(e)}
              />
               <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('DateOfBirth') ? err.DateOfBirth[0] : ''}
                </span>
            </label>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Address</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Worthington, OH 43085                "
                value={data.Address}
                 name="Address"
                onChange={(e)=>handlergetdata(e)}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Address') ? err.Address[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Numéro de téléphone</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="+1614-704-6708"
                type='number'
                value={data.PhoneNumber}
                name="PhoneNumber"
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
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="WilliamRHadden@jourrapide.com "
                type='email'
                value={data.Email}
                name="Email"
                onChange={(e)=>handlergetdata(e)}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('Email') ? err.Email[0] : ''}
                </span>
            </label>
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Date d'embauche</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type='date'
                value={data.HireDate}
                name="HireDate"
                onChange={(e)=>handlergetdata(e)}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('HireDate') ? err.HireDate[0] : ''}
                </span>
            </label>
            </div>
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
          <button
            class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={()=>handler_SendEdit()}
          >
          Mettre à jour
          </button>
        </footer>
      </div>
    </div>}


    { module_Account && <div
      
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
            onClick={()=>setModAccount(false)}

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
            Informations de compte
          </p>
          
          
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">E-mail</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                value={data.email_M}
                disabled
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
            <label class="block text-sm mt-4">
              <span class="text-gray-700 dark:text-gray-400">Mot de passe
</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type={togle_pass == true ? 'password' : 'text'}
                value={data.password_M}
                disabled
              />
            </label>
            
            <label class="text-sm ">
 <button
  class="w-full px-5 mt-10 py-3 text-sm font-medium leading-5 text-black text-gray-700 transition-colors duration-150 underline rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none "
  onClick={()=>setTogle(!togle_pass)}
  >
 {togle_pass == true ? 'Afficher' : 'Masquer'}

</button></label>
            </div>
            <button
                class="px-5 py-3 block mt-6 w-full font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                onClick={() => Export_form(data)
                }
              >
            Exporter en PDF
              </button>
            </div>
            
      </div>
    </div>}





    
{module_goals && <div
      
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
            onClick={()=>setModulegoals(false)}

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
           Ajouter un objectif aux objectifs de l'employé
          </p>
          
          <div className="">
          <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Titre de l'objectif
</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Saisir Titre.."
                name="GoalName"
                onChange={(e)=>handlergetdata_goals(e)}
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
        onChange={(e)=>handlergetdata_goals(e)}
        >
        <option disabled selected>Sélectionnez la zone</option>
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
              <span class="text-gray-700 dark:text-gray-400">Description de l'objectif
</span>
              <textarea
                  class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray"
                  rows="5"
                  placeholder="Saisir Description.."
                  name="GoalDescription"
                  onChange={(e)=>handlergetdata_goals(e)}
                ></textarea>
                <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('GoalDescription') ? err.GoalDescription[0] : ''}
                </span>
            </label>
            <div className="grid grid-cols-2 gap-6 mt-4">
           
            <label class="block text-sm">
              <span class="text-gray-700 dark:text-gray-400">Date de début de l'objectif
</span>
              <input
                class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type='date'
                name="GoalStartDate"
                onChange={(e)=>handlergetdata_goals(e)}
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
                onChange={(e)=>handlergetdata_goals(e)}
              />
              <span class="text-xs text-red-600 dark:text-red-400">
                  {err.hasOwnProperty('GoalEndDate') ? err.GoalEndDate[0] : ''}
                </span>
            </label>
            </div>
            </div>
        </div>
        <footer
          class="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800"
        >
          <button
            onClick={()=>setModulegoals(false)}

            class="w-full px-5 py-3 text-sm font-medium leading-5 text-black text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
          >
          Annuler 
          </button>
          {loding_1 == false ? 
          <button
            class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={()=>handler_send_goals()}
          >
          &nbsp;&nbsp; Ajouter &nbsp;&nbsp;
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