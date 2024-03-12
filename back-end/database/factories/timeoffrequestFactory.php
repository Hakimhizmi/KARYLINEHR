<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\employee;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\timeoffrequest>
 */
class timeoffrequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'TimeOffType' => fake()->randomElement(['Paid Time Off', 'Vacation', 'Personal Leave' , 'Jury Duty']),
            'TimeOffReason' => fake()->sentence(10),
            'TimeOffStartDate' => fake()->dateTimeBetween('-1 month', '+1 month'),
            'TimeOffEndDate' => fake()->dateTimeBetween('TimeOffStartDate', '+1 month'),
            'TimeOffStatus' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'EmployeeID' => function () {
                return employee::inRandomOrder()->value('EmployeeID');
            },
        ];
    }
}
