import axios from 'axios';
import Chart from 'chart.js/auto';
import { useEffect, useState } from 'react';
import { ConvertDecimalToTime } from './page/converttotime';
import {Error_t} from './tostify'
import { Link } from 'react-router-dom';




export default function Main() {
const [overview,setOverview] = useState({})
const [loding,setLoding] = useState(true)
const today = new Date();
const thisMonthName = today.toLocaleString('default', { month: 'long' });
const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
const lastMonthName = lastMonth.toLocaleString('default', { month: 'long' });
const lastOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 2);
const lastOfLastMonthName = lastOfLastMonth.toLocaleString('default', { month: 'long' });
let myPie = null; 
let myBar = null;

async function get_data(){
  await axios.get('http://localhost:8000/api/overview').then(({data})=>{
    setOverview(data.data);setLoding(false)
  }).catch(({})=>{
    Error_t()
  })
  }

  async function get_Datachart() {
    await axios.get('http://localhost:8000/api/chart').then(({ data }) => {
      const pieConfig = {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [data.data[0], data.data[1], data.data[2], data.data[3]],
              backgroundColor: ['#ffedd5', '#16a34a', '#dc2626', '#2563eb'],
            },
          ],
          labels: ['Not Started', 'On Track', 'Overdue', 'Complete'],
        },
        options: {
          responsive: true,
          cutoutPercentage: 80,
          legend: {
            display: false,
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      };
      const barConfig = {
        type: 'line',
        data: {
          labels: [lastOfLastMonthName, lastMonthName, thisMonthName],
          datasets: [
            {
              label: 'hours',
              borderColor: '#2563eb',
              pointBackgroundColor: '#2563eb',
              borderWidth: 1,
              data: [data.data1[2], data.data1[1], data.data1[0]],
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            display: false,
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      };
  
      if (myPie) {
        myPie.destroy(); 
      }
      const pieCtx = document.getElementById('pie');
      myPie = new Chart(pieCtx, pieConfig); 
  
      if (myBar) {
        myBar.destroy(); 
      }
      const barsCtx = document.getElementById('bars');
      myBar = new Chart(barsCtx, barConfig); 
    });
  }
   
      
      useEffect(() => {
        get_data()
        get_Datachart()
      }, []);

    return(
      <main class="h-full pb-16  overflow-y-auto pt-20 ml-12">
        <div class="container px-6 mx-auto grid">
          <h2
            class="my-6 text-2xl font-semibold text-gray-700  dark:text-gray-200"
          >
            Tableau de bord
          </h2>
          
          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Link to="/employee"
              class="flex items-center cursor-pointer p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <div
                class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                  ></path>
                </svg>
              </div>
              <div >
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Nombre d'employés
                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                  {loding == false ? 
                  overview.employee :
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
            </Link>
            <Link to="/goals"
              class="flex items-center cursor-pointer	 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <div
                class="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
</svg>
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Objectifs <span className="font-bold">({thisMonthName})</span>
                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                  
                  {loding == false ? 
                  overview.goals :
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
            </Link>
            <Link to="/timeoff"
              class="flex items-center cursor-pointer	 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <div
                class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
</svg>
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Congé <span className='text-xs'>Accepté</span> <span className="font-bold">({thisMonthName})</span>
                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                  
                  {loding == false ? 
                  overview.timeOff :
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
            </Link>
            
            
            <Link to="/work_hours"
              class="flex items-center cursor-pointer	 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <div
                class="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
              </div>
              <div>
                <p
                  class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Heures de travail <span className="font-bold">({thisMonthName}) </span>
                </p>
                <p
                  class="text-lg font-semibold text-gray-700 dark:text-gray-200"
                >
                 
                  {loding == false ? 
                 ConvertDecimalToTime(overview.workinghours)  :
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
            </Link>
          </div>

    

          
          <div class="grid mt-10 gap-6 mb-8 md:grid-cols-2">
            <div
              class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <h4 class="mb-10 font-semibold text-gray-800 dark:text-gray-300">
              Objectifs du personnel pour le mois
              </h4>
              
            
              <canvas id="pie" className='myChartDiv' ></canvas> 
              
                  
              <div
                class="flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark:text-gray-400"
              >
                <div class="flex items-center">
                  <span
                    class="inline-block w-3 h-3 mr-1 bg-orange-100 rounded-full"
                  ></span>
                  <span>Non commencé</span>
                </div>
                <div class="flex items-center">
                  <span
                    class="inline-block w-3 h-3 mr-1 bg-green-600 rounded-full"
                  ></span>
                  <span>en cours de traitement
</span>
                </div>
                <div class="flex items-center">
                  <span
                    class="inline-block w-3 h-3 mr-1 bg-red-600 rounded-full"
                  ></span>
                  <span>En souffrance</span>
                </div>
                <div class="flex items-center">
                  <span
                    class="inline-block w-3 h-3 mr-1 bg-blue-600 rounded-full"
                  ></span>
                  <span>Complété</span>
                </div>
              </div>
            </div>
            <div
              class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
            >
              <h4 class="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Heures de travail (3 derniers mois)
              </h4>
              <canvas id="bars"></canvas>
              
            </div>
          </div>
        </div>
       
       
      


      </main>
    )
}