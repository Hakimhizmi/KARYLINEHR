<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\employee;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\goal>
 */
class goalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
  
    public function definition()
    {
        $start_date = Carbon::now()->startOfMonth()->addDays(rand(0, Carbon::now()->daysInMonth - 1));
        $end_date = $start_date->copy()->addDays(rand(0, 30));
        return [
            'GoalName' => fake()->sentence(3),
            'Zone' => fake()->randomElement(['Zone A', 'Zone B','Zone C','Zone D','Zone E']),
            'GoalDescription' => fake()->paragraph,
            'GoalStartDate' => $start_date->format('Y-m-d'),
            'GoalEndDate' => $end_date->format('Y-m-d'),
            'GoalStatus' => fake()->randomElement(['Not Started', 'Complete','On Track','Overdue']),
            'EmployeeID' => function () {
                return employee::inRandomOrder()->value('EmployeeID');
            },
        ];
    }
}
