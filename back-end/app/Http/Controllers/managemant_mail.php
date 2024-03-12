<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\member;
use App\Models\mail;

class managemant_mail extends Controller
{
    public function count_mail($token){
      

        $id = member::where('token_M', $token)
        ->from('member as m')
        ->select('m.*');
if ($id = $id->join('employee as e', 'e.EmployeeID', '=', 'm.EmployeeID')
            ->select('e.FirstName', 'e.LastName','m.*')
            ->first()) {
$fullName = $id->FirstName.' '.$id->LastName;
$EmployeeID = $id->email_M ;
} else {
$fullName = 'Admin';
$EmployeeID = 'setsafrique@admin.ma';

}



        $num = mail::where('to',$EmployeeID)
        ->where('status','unread')
        ->count();
        
        return response()->json([
            'Notif' => $num,
            'FullName'=>$fullName,
        ]);
    }
    public function get_Empmail($token){
        $id = member::where('token_M',$token)
        ->select('EmployeeID','email_M')->first();

        $EmployeeID = $id->EmployeeID != null ? $id->email_M : 'setsafrique@admin.ma' ;
       

        $data = mail::where('to',$EmployeeID)
        ->orderByRaw("CASE WHEN status = 'unread' THEN 0 ELSE 1 END")
        ->orderBy('status', 'desc')
        ->get();
        
        return response()->json([
            'data' => $data,
        ]);
    }
    public function set_Sent($id){
        mail::where('idMail',$id)
        ->update([
            'status' => 'readable'
        ]);
    }

    public function send_report(Request $request,$token){
        $request->validate([
            'type_report'=> 'required',
            'title_report'=> 'required',
            'desc_report'=> 'required'
        ]);

        $email = member::where('token_M',$token)
        ->select('email_M')->first();

        mail::insert([
            'from' => $email->email_M,
            'to' => 'setsafrique@admin.ma',
            'typeMail' => $request->type_report ,
            'titleMail' => $request->title_report,
            'descMail' => $request->desc_report,
            'dateSend' => now()->format('Y-m-d H:i:s') ,
            'status' => 'unread'
        ]);
        return response()->json([
            'message' => 'The report has been sent successfully'
        ]);
    }
    public function send_reply(Request $request,$token){
        $request->validate([
            'descMail'=> 'required',
        ]);

        $email = member::where('token_M',$token)
        ->select('email_M')->first();

        mail::insert([
            'from' => $email->email_M,
            'to' => $request->to,
            'typeMail' => 'reply Mesaage' ,
            'titleMail' => 'Reply to : "' . $request->titleMail . '"',
            'descMail' => $request->descMail,
            'dateSend' => now()->format('Y-m-d H:i:s') ,
            'status' => 'unread'
        ]);
        return response()->json([
            'message' => 'The Reply has been sent successfully'
        ]);
    }

}
