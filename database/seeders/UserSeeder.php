<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'full_name'   => 'Tester',
            'cpf'         => '12345678900',
            'email'       => 'tester@gmail.com',
            'password'    => 'password',
            'phone_number'=> '11999999999',
        ]);
    }
}
