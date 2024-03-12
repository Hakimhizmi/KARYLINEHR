<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\employee>
 */
class employeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'FirstName' => fake()->firstName,
            'LastName' => fake()->lastName,
            'Gender' => fake()->randomElement(['Male', 'Female']),
            'DateOfBirth' => fake()->date('Y-m-d', '-20 years'),
            'Address' => fake()->address,
            'PhoneNumber' => fake()->phoneNumber,
            'Email' => fake()->email,
            'HireDate' => fake()->date('Y-m-d', '-1 years'),
        ];
    }
}
