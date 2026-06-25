<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'full_name'   => 'Tester',
            'cpf'         => '222.222.222-22',
            'email'       => 'tester@gmail.com',
            'password'    => Hash::make('password'),
            'phone_number'=> '11999999999',
            'role'        => 'admin'
        ]);

        User::create([
            'full_name'   => 'Sagi',
            'cpf'         => '184.515.997-70',
            'email'       => 'sagi@gmail.com',
            'password'    => Hash::make('sagisagi'),
            'phone_number'=> '(21) 98888-7777',
        ]);
    }
}
