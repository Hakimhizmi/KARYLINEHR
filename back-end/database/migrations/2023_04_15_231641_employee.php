<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee', function (Blueprint $table) {
            $table->increments('EmployeeID');
            $table->string('FirstName', 50);
            $table->string('LastName', 50);
            $table->string('Gender', 50);
            $table->date('DateOfBirth');
            $table->string('Address', 150);
            $table->string('PhoneNumber', 150);
            $table->string('Email', 150);
            $table->date('HireDate');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee');
    }
};
