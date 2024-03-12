<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\member;



class mangement_login extends Controller
{
    public function check_login(Request $request){
        $request->validate([
            'email_M'=> 'required',
            'password_M'=> 'required',
            'accountType'=> 'required',
        ]);
        $member = member::where('email_M', $request->email_M)
            ->where('password_M', $request->password_M)
            ->where('type_M', $request->accountType)
            ->select('token_M','Type_M')
            ->first();
        if ($member) {
            return response()->json([
                'token_M' => $member->token_M ,
                'Type_M' => $member->Type_M
            ]);
        } else {
            return response()->json([
                'message' => 'invalid login'
            ]);        }

    }
    public function check_session(Request $request){
        $session = member::where('token_M', $request->token_M)
            ->first();
        if ($session) {
            return response()->json([
                'message' => '!OK'
            ]);
        }
        else{
            return response()->json(['message' => 'Not Found'], 500);
        }
        
    }
}
