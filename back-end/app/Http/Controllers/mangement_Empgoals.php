<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\goal;
use App\Models\member;



class mangement_Empgoals extends Controller
{
    public function get_data(Request $request){
        $employee = member::where('token_M',$request->token_M)
        ->select('EmployeeID')->first();
        
        $data = goal::where('EmployeeID',$employee->EmployeeID)
        ->whereIn('GoalStatus',['Not Started','On Track'])
        ->get();
        return response()->json([
            'data' => $data,
        ]);
    }
    public function update_Empgoals(Request $request){
        goal::where('GoalID',$request->GoalID)->update([
            'GoalStatus' => $request->GoalStatus,
        ]);
        return response()->json([
            'message' => 'The Goals has been '.$request->GoalStatus.' successfully'
        ]);
    }
    public function count_goals($token){
        $employee = member::where('token_M',$token)
        ->select('EmployeeID')->first();
        
        $data = goal::where('EmployeeID',$employee->EmployeeID)
        ->whereIn('GoalStatus',['Not Started','On Track'])
        ->count();
        return response()->json([
            'count' => $data,
        ]);
    }
}
