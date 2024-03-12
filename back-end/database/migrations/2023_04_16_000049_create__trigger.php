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
        DB::unprepared('
        CREATE TRIGGER create_account AFTER INSERT ON employee FOR EACH ROW 
        BEGIN 
            INSERT INTO member (EmployeeID, email_M, password_M, type_M, token_M)
            VALUES (NEW.EmployeeID, NEW.Email, CONCAT(SUBSTRING(MD5(RAND()) FROM 1 FOR 8), SUBSTRING(SHA(RAND()) FROM 1 FOR 8)), "employee", UUID());
        END
    ');
    DB::unprepared('
CREATE TRIGGER `calculate_working_hours` BEFORE INSERT ON `workinghours` FOR EACH ROW BEGIN
    SET NEW.hoursWorkedN = TIMESTAMPDIFF(SECOND, NEW.StartTimeN, NEW.EndTimeN) / 3600.0;
    SET NEW.hoursWorkedE = TIMESTAMPDIFF(SECOND, NEW.StartTimeE, NEW.EndTimeE) / 3600.0;
END
');

DB::unprepared('
CREATE TRIGGER `calulate_working_afterupdate` BEFORE UPDATE ON `workinghours` FOR EACH ROW BEGIN
    SET NEW.hoursWorkedN = TIMESTAMPDIFF(SECOND, NEW.StartTimeN, NEW.EndTimeN) / 3600.0;
    SET NEW.hoursWorkedE = TIMESTAMPDIFF(SECOND, NEW.StartTimeE, NEW.EndTimeE) / 3600.0;
END
');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('_trigger');
    }
};
