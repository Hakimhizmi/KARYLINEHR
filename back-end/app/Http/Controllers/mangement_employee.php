<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\employee;
use App\Models\member;


class mangement_employee extends Controller
{
    public function add_data(Request $request){
        $request->validate([
            'FirstName'=> 'required',
            'LastName'=> 'required',
            'Gender'=> 'required',
            'DateOfBirth'=> 'required|date',
            'Address'=> 'required',
            'PhoneNumber'=> 'required|digits:10',
            'Email'=> 'required|regex:/(.+)@(.+)\.(.+)/i',
            'Email' => [
                'required',
                'Email',
                function ($attribute, $value, $fail) {
                    if (employee::whereEmail($value)->count() > 0) {
                        $fail('Email is already used.');
                    }
                },
            ],
            'HireDate'=> 'required|date',
        ]);


        employee::insert([
            'FirstName' => $request->FirstName,
            'LastName' => $request->LastName,
            'Gender' => $request->Gender,
            'DateOfBirth' => $request->DateOfBirth,
            'Address' => $request->Address,
            'PhoneNumber' => $request->PhoneNumber,
            'Email' => $request->Email,
            'HireDate' => $request->HireDate
        ]);
        return response()->json([
            'message' => 'The employee has been added successfully'
        ]);
    }
    public function insert_many(Request $request){
        
        $data = $request->json()->all();

        employee::insert($data);

        
        return response()->json([
            'message' => 'The list of employee has been added successfully'
        ]);
    }
    public function get_data(Request $request){
        $data = employee::select('employee.*', 'm.*')
        ->from('employee')
        ->join('member as m', 'm.EmployeeID', '=', 'employee.EmployeeID')
        ->orderByDesc('employee.EmployeeID')
        ->get();
        return response()->json([
            'data' => $data,
        ]);
    }
    public function del_data($id){
        employee::where('EmployeeID',$id)->delete();
        return response()->json([
            'message' => 'The employee has been deleted successfully',
        ]);
    }
    public function update_data(Request $request,$id){
        $request->validate([
            'FirstName'=> 'required',
            'LastName'=> 'required',
            'Gender'=> 'required',
            'DateOfBirth'=> 'required|date',
            'Address'=> 'required',
            'PhoneNumber'=> 'required|digits:10',
            'Email'=> 'required|regex:/(.+)@(.+)\.(.+)/i',
            'HireDate'=> 'required|date',
        ]);

        
        member::where('EmployeeID',$id)->update([
            'email_M' => $request->Email,
        ]);
        employee::where('EmployeeID',$id)->update([
            'FirstName' => $request->FirstName,
            'LastName' => $request->LastName,
            'Gender' => $request->Gender,
            'DateOfBirth' => $request->DateOfBirth,
            'Address' => $request->Address,
            'PhoneNumber' => $request->PhoneNumber,
            'Email' => $request->Email,
            'HireDate' => $request->HireDate
        ]);
        return response()->json([
            'message' => 'The employee information has been modified successfully'
        ]);
    }
}
