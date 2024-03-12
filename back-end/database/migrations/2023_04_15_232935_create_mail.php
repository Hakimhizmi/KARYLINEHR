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
        Schema::create('mail', function (Blueprint $table) {
            $table->increments('idMail');
            $table->string('from', 50);
            $table->string('to', 50);
            $table->string('typeMail', 100);
            $table->string('titleMail', 50);
            $table->text('descMail');
            $table->timestamp('dateSend')->useCurrent();
            $table->string('status', 50);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mail');
    }
};
