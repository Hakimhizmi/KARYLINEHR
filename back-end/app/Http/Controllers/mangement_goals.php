<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\goal;
use App\Models\employee;



class mangement_goals extends Controller
{
    public function add_data(Request $request,$id){
        $request->validate([
            'GoalName'=> 'required|string',
            'Zone'=> 'required',
            'GoalDescription'=> 'required|min:10',
            'GoalStartDate'=> 'required|date|before_or_equal:GoalEndDate',
            'GoalEndDate'=> 'required|date|after_or_equal:GoalStartDate',
        ]);


        goal::insert([
            'GoalName' => $request->GoalName,
            'Zone' => $request->Zone,
            'GoalDescription' => $request->GoalDescription,
            'GoalStartDate' => $request->GoalStartDate,
            'GoalEndDate' => $request->GoalEndDate,
            'GoalStatus' => 'Not Started' ,
            'EmployeeID' => $id
        ]);
        return response()->json([
            'message' => 'The target has been added to the employee successfully'
        ]);
    }
    public function get_data(Request $request){
        $data = goal::join('employee', 'goal.EmployeeID', '=','employee.EmployeeID')
        ->select('goal.*','employee.FirstName','employee.LastName')
        ->orderByDesc('GoalStartDate')
        ->get();
        
        return response()->json([
            'data' => $data,
        ]);
    }

    public function update_data(Request $request,$id){
        $request->validate([
            'GoalName'=> 'required|string',
            'Zone'=> 'required',
            'GoalDescription'=> 'required|min:10',
            'GoalStartDate'=> 'required|date|before_or_equal:GoalEndDate',
            'GoalEndDate'=> 'required|date|after_or_equal:GoalStartDate',
            'GoalStatus' => 'required'
        ]);

        goal::where('GoalID',$id)->update([
            'GoalName' => $request->GoalName,
            'Zone' => $request->Zone,
            'GoalDescription' => $request->GoalDescription,
            'GoalStartDate' => $request->GoalStartDate,
            'GoalEndDate' => $request->GoalEndDate,
            'GoalStatus' => $request->GoalStatus,
        ]);
        return response()->json([
            'message' => 'The employee Goal information has been modified successfully'
        ]);
    }
    public function del_data($id){
        goal::where('GoalID',$id)->delete();
        return response()->json([
            'message' => 'The employee goal has been deleted successfully',
        ]);
    }
}
