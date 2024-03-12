<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\employee;
use App\Models\member;


class manegement_setting extends Controller
{
    public function getlogin_data(Request $request){
        $id = member::where('token_M', $request->token_M)
            ->first();
        $data = employee::where('EmployeeID', $id->EmployeeID)->get();
        return response()->json([
            'data' => $data,
        ]);
    }
    public function update_personalINF(Request $request,$token_M){
        $request->validate([
            'FirstName'=> 'required',
            'LastName'=> 'required',
            'Address'=> 'required',
            'PhoneNumber'=> 'required|digits:10',
            'Email'=> 'required|regex:/(.+)@(.+)\.(.+)/i',
            'Email' => [
                'required',
                'Email',
                function ($attribute, $value, $fail) use ($token_M) {
                    if (employee::whereEmail($value)->where('EmployeeID', '!=', member::where('token_M', $token_M)
                    ->first()->EmployeeID)->count() > 0) {
                        $fail('Email is already used.');
                    }
                },
            ],
        ]);
        $id = member::where('token_M', $token_M)
            ->first();
        employee::where('EmployeeID', $id->EmployeeID)->update([
            'FirstName' => $request->FirstName,
            'LastName' => $request->LastName,
            'Address' => $request->Address,
            'PhoneNumber' => $request->PhoneNumber,
            'Email' => $request->Email,
        ]);
        member::where('EmployeeID', $id->EmployeeID)->update([
            'Email_M' => $request->Email,
        ]);
        return response()->json([
            'message' => 'The employee information was successfully updated'
        ]);
    }
    public function update_password(Request $request,$token_M){
        $request->validate([
            'currentpassword' => [
                'required',
                function ($attribute, $value, $fail) use ($token_M) {
                    if (member::where(['token_M'=>$token_M,'password_M'=>$value])->count() == 0) {
                        $fail('password incorrect.');
                    }
                },
            ],
            'password' => 'required|min:8' ,
            'confirmpassword' => 'required|min:8|same:password' ,
        ]);

        member::where('token_M', $token_M)->update([
            'password_M' => $request->password,
        ]);
        return response()->json([
            'message' => 'Employee password updated successfully, please login !!'
        ]);
    }
}
