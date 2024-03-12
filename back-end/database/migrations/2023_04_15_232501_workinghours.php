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
        Schema::create('workinghours', function (Blueprint $table) {
            $table->increments('ShiftID');
            $table->date('Date');
            $table->time('StartTimeN');
            $table->time('EndTimeN');
            $table->time('StartTimeE')->nullable();
            $table->time('EndTimeE')->nullable();
            $table->float('hoursWorkedN')->nullable();
            $table->float('hoursWorkedE')->nullable();
            $table->integer('EmployeeID')->unsigned();
            $table->foreign('EmployeeID')->references('EmployeeID')->on('employee')->cascadeOnDelete()->cascadeOnUpdate();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('workinghours');
    }
};
