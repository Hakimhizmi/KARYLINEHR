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
        Schema::create('goal', function (Blueprint $table) {
            $table->increments('GoalID');
            $table->string('GoalName', 100);
            $table->string('Zone', 100);
            $table->text('GoalDescription');
            $table->date('GoalStartDate');
            $table->date('GoalEndDate');
            $table->string('GoalStatus', 100);
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
        Schema::dropIfExists('goal');
    }
};
