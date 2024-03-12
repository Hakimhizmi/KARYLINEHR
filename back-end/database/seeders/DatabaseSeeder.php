<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\employee::factory(200)->create();
        \App\Models\member::factory(1)->create();
        \App\Models\goal::factory(200)->create();
        /*\App\Models\mail::factory(200)->create();*/
        \App\Models\staffsalaries::factory(200)->create();
        \App\Models\timeoffrequest::factory(200)->create();
        \App\Models\timeoffapproval::factory(200)->create();
        \App\Models\workinghours::factory(200)->create();


        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
