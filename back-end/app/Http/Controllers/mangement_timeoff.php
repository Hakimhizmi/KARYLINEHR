<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\timeoffrequest;
use App\Models\timeoffapproval;
use App\Models\member;
use App\Models\mail;
use Carbon\Carbon;

class mangement_timeoff extends Controller
{
    public function get_data_request(Request $request){
        $data = timeoffrequest::join('employee', 'timeoffrequest.EmployeeID', '=','employee.EmployeeID')
        ->select('timeoffrequest.*','employee.FirstName','employee.LastName')
        ->where('TimeOffStatus','pending')
        ->orderByDesc('TimeOffStartDate')
        ->get();
        
        return response()->json([
            'data' => $data,
        ]);
    }
    public function timeoff_request(Request $request,$id){
        $request->validate([
            'ApprovalComments'=> 'required',
        ]);
        
        timeoffrequest::where('TimeOffRequestID',$id)->update(['TimeOffStatus'=>$request->type]);

        timeoffapproval::insert([
            'ApprovalDate' => Carbon::now(),
            'ApprovalComments' => $request->ApprovalComments,
            'TimeOffRequestID' => $id,
        ]);
        $data = timeoffrequest::where('TimeOffRequestID',$id)->first();
        $email = member::where('EmployeeID',$data->EmployeeID)
        ->select('email_M')->first();
        mail::insert([
            'from' => 'setsafrique@admin.ma',
            'to' => $email->email_M,
            'typeMail' => 'Timo-Off response' ,
            'titleMail' => 'Leave request '.$data->TimeOffStatus.'',
            'descMail' => $request->ApprovalComments ,
            'dateSend' => now()->format('Y-m-d H:i:s') ,
            'status' => 'unread'
        ]);
        return response()->json([
            'message' => 'time off has been '.$request->type.''
        ]);
    }
    public function get_data_approval(Request $request){
        $data = timeoffapproval::join('timeoffrequest', 'timeoffapproval.TimeOffRequestID', '=','timeoffrequest.TimeOffRequestID')
        ->join('employee', 'timeoffrequest.EmployeeID', '=','employee.EmployeeID')
        ->select('timeoffapproval.*','timeoffrequest.TimeOffStartDate',
        'timeoffrequest.TimeOffEndDate','timeoffrequest.TimeOffStatus',
        'employee.FirstName','employee.LastName')
        ->where('TimeOffStatus','!=','pending')
        ->orderByDesc('ApprovalDate')
        ->get();
        
        return response()->json([
            'data' => $data,
        ]);
    }

    public function update_data_req(Request $request,$id){
        $request->validate([
            'ApprovalComments'=> 'required',
            'TimeOffStartDate'=>'required|date|before:TimeOffEndDate',
            'TimeOffEndDate'=>'required|date|after:TimeOffStartDate',
            'TimeOffStatus' => 'required',
            'ApprovalDate' => 'required|date'
        ]);
        timeoffapproval::where('ApprovalID',$id)
        ->join('timeoffrequest', 'timeoffapproval.TimeOffRequestID', '=','timeoffrequest.TimeOffRequestID')
        ->update([
            'ApprovalComments' => $request->ApprovalComments,
            'ApprovalDate' => $request->ApprovalDate,
            'timeoffrequest.TimeOffStartDate' => $request->TimeOffStartDate,
            'timeoffrequest.TimeOffEndDate' => $request->TimeOffEndDate,
            'timeoffrequest.TimeOffStatus' => $request->TimeOffStatus,
        ]);
        return response()->json([
            'message' => 'The request has been modified successfully'
        ]);
    }
    public function request_timeoff(Request $request,$token){
        $request->validate([
            'TimeOffType' => 'required',
            'TimeOffReason'=> 'required',
            'TimeOffStartDate'=>'required|date|before:TimeOffEndDate',
            'TimeOffEndDate'=>'required|date|after:TimeOffStartDate',
        ]);
        $EmployeeID = member::where('token_M',$token)
        ->select('EmployeeID')->first();

        timeoffrequest::insert([
            'TimeOffType' => $request->TimeOffType,
            'TimeOffReason' => $request->TimeOffReason,
            'TimeOffStartDate' => $request->TimeOffStartDate,
            'TimeOffEndDate' => $request->TimeOffEndDate,
            'TimeOffStatus' => 'pending',
            'EmployeeID' => $EmployeeID->EmployeeID,
        ]);

        return response()->json([
            'message' => 'The request has been send successfully'
        ]);
    }
    
}
