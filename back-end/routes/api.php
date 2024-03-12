<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\mangement_employee;
use App\Http\Controllers\mangement_goals;
use App\Http\Controllers\mangement_timeoff;
use App\Http\Controllers\mangement_workinghours;
use App\Http\Controllers\mangement_staffsalaries;
use App\Http\Controllers\mangement_login;
use App\Http\Controllers\mangement_Empgoals;
use App\Http\Controllers\mangement_report;
use App\Http\Controllers\mainpage;
use App\Http\Controllers\managemant_mail;
use App\Http\Controllers\manegement_setting;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

#--------------overview------------------------------------------

Route::get('overview',[mainpage::class,'overview']);

Route::get('chart',[mainpage::class,'data_chart']);

#--------------employee------------------------------------------

Route::post('add_employee',[mangement_employee::class,'add_data']);

Route::get('get_employees',[mangement_employee::class,'get_data']);

Route::get('del_employees/{id}',[mangement_employee::class,'del_data']);

Route::post('Update_employee/{id}',[mangement_employee::class,'update_data']);

Route::post('add_many',[mangement_employee::class,'insert_many']);

#--------------goals------------------------------------------
Route::post('add_goal/{id}',[mangement_goals::class,'add_data']);

Route::get('get_goal',[mangement_goals::class,'get_data']);

Route::post('Update_goal/{id}',[mangement_goals::class,'update_data']);

Route::get('del_goal/{id}',[mangement_goals::class,'del_data']);


#--------------timeoff------------------------------------------

Route::get('get_timeoffreq',[mangement_timeoff::class,'get_data_request']);

Route::post('timeoff_request/{id}',[mangement_timeoff::class,'timeoff_request']);

Route::get('get_data_approval',[mangement_timeoff::class,'get_data_approval']);

Route::post('Update_timeoffreq/{id}',[mangement_timeoff::class,'update_data_req']);


#--------------workinghours------------------------------------------

Route::get('get_workinghours',[mangement_workinghours::class,'get_data']);

Route::post('update_workinghours/{id}',[mangement_workinghours::class,'update_data']);

Route::get('del_shift/{id}',[mangement_workinghours::class,'del_data']);


#--------------staff_salries------------------------------------------

Route::post('calcul',[mangement_staffsalaries::class,'calcul_staffsalaries']);

Route::get('get_staffsalaries',[mangement_staffsalaries::class,'get_data']);

Route::get('del_staffsalaries',[mangement_staffsalaries::class,'del_data']);

Route::post('update_staffsalaries/{id}',[mangement_staffsalaries::class,'update_data']);

Route::get('del_select_staffsalaries/{id}',[mangement_staffsalaries::class,'del_selectdata']);


#--------------login------------------------------------------

Route::post('login',[mangement_login::class,'check_login']);

Route::post('check_session',[mangement_login::class,'check_session']);


#--------------Employee------------------------------------------
Route::get('overview_Emp/{token}',[mainpage::class,'overview_Emp']);

Route::get('count_goals/{token}',[mangement_Empgoals::class,'count_goals']);

Route::post('get_Empgoal',[mangement_Empgoals::class,'get_data']);

Route::post('update_Empgoals',[mangement_Empgoals::class,'update_Empgoals']);

Route::post('request_timeoff/{id}',[mangement_timeoff::class,'request_timeoff']);

Route::get('overview_staffsalaries/{id}',[mainpage::class,'overview_staffsalaries']);

#--------------Mail------------------------------------------
Route::get('mail_Emp/{token}',[managemant_mail::class,'get_Empmail']);

Route::get('count_mail/{token}',[managemant_mail::class,'count_mail']);

Route::get('set_Sent/{id}',[managemant_mail::class,'set_Sent']);

Route::post('send_report/{token}',[managemant_mail::class,'send_report']);

Route::post('send_reply/{token}',[managemant_mail::class,'send_reply']);

#--------------Setting------------------------------------------

Route::post('getlogin_data',[manegement_setting::class,'getlogin_data']);

Route::post('update_personalINF/{token_M}',[manegement_setting::class,'update_personalINF']);

Route::post('update_password/{token_M}',[manegement_setting::class,'update_password']);
