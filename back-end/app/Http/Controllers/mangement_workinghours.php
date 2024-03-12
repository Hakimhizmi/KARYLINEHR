<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\workinghours;


class mangement_workinghours extends Controller
{
    public function get_data(Request $request){
        $data = workinghours::join('employee', 'workinghours.EmployeeID', '=','employee.EmployeeID')
        ->select('workinghours.*','employee.FirstName','employee.LastName')
        ->orderByDesc('Date')
        ->get();
        
        return response()->json([
            'data' => $data,
        ]);
    }

    public function update_data(Request $request,$id){
        $request->validate([
            'Date'=> 'required|date',
            'StartTimeN'=>'required',
            'EndTimeN'=>'required|after:StartTimeN',
        ]);
        
        if ($request->StartTimeE ===  null || $request->StartTimeE === null) {
            $extraStart = '00:00:00' ;
            $extraEnd = '00:00:00' ;
        }
        else{
            $request->validate([
                'StartTimeE'=>'',
                'EndTimeE'=>'after:StartTimeE',
            ]);
            $extraStart = $request->StartTimeE;
            $extraEnd = $request->EndTimeE ;
        }
        workinghours::where('ShiftID',$id)
        ->update([
            'Date' => $request->Date,
            'StartTimeN' => $request->StartTimeN,
            'EndTimeN' => $request->EndTimeN,
            'StartTimeE' => $extraStart,
            'EndTimeE' => $extraEnd,
        ]);

        return response()->json([
            'message' => 'The employee working time has been modified successfully'
        ]);
    }

    public function del_data($id){
        workinghours::where('ShiftID',$id)->delete();
        return response()->json([
            'message' => 'The shift has been deleted successfully',
        ]);
    }
}
