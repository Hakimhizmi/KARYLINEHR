<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\mail>
 */
class mailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'from' => fake()->email,
            'to' => fake()->email,
            'typeMail' => fake()->randomElement(['inbox', 'sent', 'draft']),
            'titleMail' => fake()->sentence(2),
            'descMail' => fake()->paragraph(3),
            'dateSend' => fake()->dateTimeBetween('-1 week', 'now')->format('Y-m-d H:i:s'),
            'status' => fake()->randomElement(['unread', 'read', 'archived']),
        ];
    }
}
