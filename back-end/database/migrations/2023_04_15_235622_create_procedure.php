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
    CREATE PROCEDURE `calcul_salary` (IN `salareN` FLOAT, IN `salareE` FLOAT)
    BEGIN
        INSERT INTO staffsalaries(date_calcul,normal_H, extra_H, Netsalary, EmployeeID)
        SELECT 
            NOW() date_calcul,
            SUM(hoursWorkedN) normal_H,
            SUM(hoursWorkedE) extra_H,
            (SUM(TIMESTAMPDIFF(SECOND, StartTimeN, EndTimeN)) / 3600 * salareN) + (SUM(TIMESTAMPDIFF(SECOND, StartTimeE, EndTimeE)) / 3600 * salareE) AS Netsalary,
            EmployeeID
        FROM 
            workinghours
        WHERE 
            MONTH(Date) = MONTH(CURRENT_DATE())
        GROUP BY 
            EmployeeID;
    END;
');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
