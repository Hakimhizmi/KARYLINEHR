<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\employee;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\workinghours>
 */
use Carbon\Carbon;


class workinghoursFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()

    {
        return [
            'Date' => Carbon::now()->subMonths(3)->addDays(rand(0, 89))->format('Y-m-d'),
            'StartTimeN' => fake()->dateTimeBetween('today 8:00:00', 'today 10:00:00')->format('H:i:s'),
            'EndTimeN' => fake()->dateTimeBetween('today 10:00:00', 'today 15:00:00')->format('H:i:s'),
            'StartTimeE' => fake()->dateTimeBetween('today 15:00:00', 'today 17:00:00')->format('H:i:s'),
            'EndTimeE' => fake()->dateTimeBetween('today 17:00:00', 'today 20:00:00')->format('H:i:s'),
            'EmployeeID' => function () {
                return employee::inRandomOrder()->value('EmployeeID');
            },
        ];
    }
}
