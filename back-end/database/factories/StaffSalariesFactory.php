<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\employee;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StaffSalaries>
 */
class StaffSalariesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'date_calcul' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'normal_H' => fake()->numberBetween(160, 240),
            'extra_H' => fake()->numberBetween(0, 40),
            'Netsalary' => fake()->numberBetween(5000, 15000),
            'EmployeeID' => function () {
                return employee::inRandomOrder()->value('EmployeeID');
            },
        ];
    }
}
