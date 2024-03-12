<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\staffsalaries;
use DB;

class mangement_staffsalaries extends Controller
{
    public function calcul_staffsalaries(Request $request){
        $request->validate([
            'salaryN'=>'required',
            'salaryE'=>'required',
        ]);
        $staffSalaries = staffsalaries::whereMonth('date_calcul', '=', date('m'))
                    ->whereYear('date_calcul', '=', date('Y'))
                    ->get();
        
        if ($staffSalaries->count() > 0) {
            return response()->json([
                'type' => 'error',
                'message' => 'Employee wages have been calculated for this month. Do you want to recalculate?'
            ]);
        } else {
            DB::statement('CALL calcul_salary(?, ?)', [$request->salaryN, $request->salaryE]);

            return response()->json([
                'type' => 'successfully',
                'message' => 'Employee wages for this month have been calculated '
            ]);
        }            
    }

    public function get_data(){
        $data = staffsalaries::join('employee', 'staffsalaries.EmployeeID', '=','employee.EmployeeID')
        ->select('staffsalaries.*','employee.FirstName','employee.LastName',DB::raw('YEAR(date_calcul) as year'),DB::raw('month(date_calcul) as month'))
        ->orderByDesc('date_calcul')
        ->get();
        
        return response()->json([
            'data' => $data,
        ]);
    }

    public function del_data(){
        staffsalaries::whereYear('date_calcul', '=', date('Y'))
            ->whereMonth('date_calcul', '=', date('m'))
            ->delete();
        return response()->json([
            'message' => 'Now you can calculate salaries',
        ]);
    }

    public function update_data(Request $request,$id){
        $request->validate([
            'Netsalary'=> 'required',
        ]);
        staffsalaries::where('salaryID',$id)
        ->update([
            'Netsalary' => $request->Netsalary,
        ]);
        return response()->json([
            'message' => 'The Net salary has been modified successfully'
        ]);
    }

    public function del_selectdata($id){
        staffsalaries::where('salaryID',$id)->delete();
        return response()->json([
            'message' => 'The Monthly salary for the employee has been deleted successfully',
        ]);
    }
}
