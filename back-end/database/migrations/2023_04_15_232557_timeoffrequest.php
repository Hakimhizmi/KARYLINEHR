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
        Schema::create('timeoffrequest', function (Blueprint $table) {
            $table->increments('TimeOffRequestID');
            $table->string('TimeOffType', 50);
            $table->text('TimeOffReason');
            $table->date('TimeOffStartDate');
            $table->date('TimeOffEndDate');
            $table->string('TimeOffStatus', 50);
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
        Schema::dropIfExists('timeoffrequest');
    }
};
