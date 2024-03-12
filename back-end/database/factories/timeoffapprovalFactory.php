<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\timeoffrequest;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\timeoffapproval>
 */
class timeoffapprovalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'ApprovalDate' => fake()->dateTimeBetween('-1 month', 'now'),
            'ApprovalComments' => fake()->sentence(10),
            'TimeOffRequestID' => function () {
                return timeoffrequest::inRandomOrder()->value('TimeOffRequestID');
            },
        ];
    }
}
