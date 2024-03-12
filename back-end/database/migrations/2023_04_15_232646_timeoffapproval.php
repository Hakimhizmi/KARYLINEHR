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
        Schema::create('timeoffapproval', function (Blueprint $table) {
            $table->increments('ApprovalID');
            $table->date('ApprovalDate');
            $table->text('ApprovalComments');
            $table->integer('TimeOffRequestID')->unsigned();
            $table->foreign('TimeOffRequestID')->references('TimeOffRequestID')->on('timeoffrequest')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('timeoffapproval');
    }
};
