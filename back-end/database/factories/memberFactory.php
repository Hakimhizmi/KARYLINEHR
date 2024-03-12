<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\employee;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\member>
 */
class memberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'EmployeeID' => null,
            'email_M' => 'setsafrique@admin.ma',
            'password_M' => 'sets@setsAfrica',
            'type_M' => 'admin',
            'token_M' => Str::random(20),
        ];
    }
}
