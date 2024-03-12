<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\employee;
use App\Models\goal;
use App\Models\timeoffapproval;
use App\Models\workinghours;
use App\Models\member;
use App\Models\staffsalaries;
use DB;
use Carbon\Carbon;

class mainpage extends Controller
{
    public function overview(){
        $employee = employee::count();
        $goals = goal::whereMonth('GoalStartDate', '=', date('m'))
        ->whereYear('GoalStartDate', '=', date('Y'))
        ->count();
        $timeOff = timeoffapproval::whereMonth('ApprovalDate', '=', date('m'))
        ->whereYear('ApprovalDate', '=', date('Y'))
        ->count();
        $workinghours = workinghours::whereMonth('Date', '=', date('m'))
        ->whereYear('Date', '=', date('Y'))
        ->value(DB::raw('IFNULL(SUM(hoursWorkedN + COALESCE(hoursWorkedE, 0)), 0)'));

        return response()->json([
            'data' => ['employee' => $employee,'goals' => $goals,
            'timeOff' => $timeOff,'workinghours' => $workinghours,]
        ]);
    }
    public function data_chart(){
        $data = [];
        $statusTypes = ['Not Started', 'On Track', 'Overdue', 'Complete'];
        foreach ($statusTypes as $status) {
        $data[] = goal::whereMonth('GoalStartDate', '=', date('m'))
                 ->whereYear('GoalStartDate', '=', date('Y'))
                 ->where('GoalStatus', $status)
                 ->count();
        }   

        $results = [];
for ($i = 0; $i < 3; $i++) {
    $month = date('m') - $i;
    $year = date('Y');
    if ($month <= 0) {
        $month += 12;
        $year--;
    }
    $results[] = workinghours::whereMonth('Date', '=', $month)
        ->whereYear('Date', '=', $year)
        ->value(DB::raw('IFNULL(SUM(hoursWorkedN + COALESCE(hoursWorkedE, 0)), 0)'));
}
        return response()->json(['data' => $data
    ,'data1'=>$results]);
    }
    public function overview_Emp($token){
        $id = member::where('token_M',$token)
        ->select('EmployeeID')->first();

        $Completed_goals = goal::whereMonth('GoalStartDate', '=', date('m'))
        ->whereYear('GoalStartDate', '=', date('Y'))
        ->where('GoalStatus','Complete')
        ->where('EmployeeID',$id->EmployeeID)
        ->count();
        $Incomplete_goals = goal::whereMonth('GoalStartDate', '=', date('m'))
        ->whereYear('GoalStartDate', '=', date('Y'))
        ->where('EmployeeID',$id->EmployeeID)
        ->where('GoalStatus','!=','Complete')
        ->count();
        $Regular = workinghours::whereMonth('Date', '=', date('m'))
        ->whereYear('Date', '=', date('Y'))
        ->where('EmployeeID',$id->EmployeeID)
        ->value(DB::raw('IFNULL(SUM(hoursWorkedN), 0)'));

        $Overtime = workinghours::whereMonth('Date', '=', date('m'))
        ->whereYear('Date', '=', date('Y'))
        ->where('EmployeeID',$id->EmployeeID)
        ->value(DB::raw('IFNULL(SUM(hoursWorkedE), 0)'));

        return response()->json([
            'data' => ['goals_c' => $Completed_goals,'goals_I' => $Incomplete_goals,
            'Regular' => $Regular,'Overtime' => $Overtime]
        ]);
    }
    
    
    public function overview_staffsalaries($token){
        $id = member::where('token_M',$token)
            ->select('EmployeeID')->firstOrFail();
    
        $salaries = staffsalaries::where('EmployeeID',$id->EmployeeID)
            ->orderByDesc('salaryID')
            ->get();
    
        $staff_salaries = collect();
        foreach ($salaries as $value) {
            $date_calcul = Carbon::parse($value->date_calcul);
            $previous_month_salary = staffsalaries::whereMonth('date_calcul', $date_calcul->format('m') - 1)
                ->whereYear('date_calcul', $date_calcul->year)
                ->where('EmployeeID',$id->EmployeeID)
                ->select('Netsalary')
                ->first();
    
            
            $added_value = $previous_month_salary !== null ? $value->Netsalary - $previous_month_salary->Netsalary : 0;
            $data = ['date' => $value->date_calcul, 'salary'=> $value->Netsalary, 'added_value' => $added_value];
            $staff_salaries->push($data);
        }
    
        return response()->json([
            'data' => $staff_salaries
        ]);
    }


    







       
        
        

    
}
