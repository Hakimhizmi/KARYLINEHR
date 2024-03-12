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
        Schema::create('member', function (Blueprint $table) {
            $table->increments('id_M');
            $table->integer('EmployeeID')->unsigned()->nullable();
            $table->string('email_M', 100);
            $table->string('password_M', 100);
            $table->string('type_M', 50);
            $table->string('token_M', 50);
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
        Schema::dropIfExists('member');
    }
};
