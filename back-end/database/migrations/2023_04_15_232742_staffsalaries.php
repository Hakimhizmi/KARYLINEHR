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
        Schema::create('staffsalaries', function (Blueprint $table) {
            $table->increments('salaryID');
            $table->date('date_calcul');
            $table->float('normal_H');
            $table->float('extra_H')->nullable();
            $table->float('Netsalary');
            $table->integer('EmployeeID')->unsigned();
            $table->foreign('EmployeeID')->references('EmployeeID')->on('employee')->cascadeOnDelete()->cascadeOnUpdate();;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('staffsalaries');
    }
};
