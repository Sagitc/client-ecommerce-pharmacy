<?php

namespace Database\Seeders;

use App\Models\Address;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Address::create([
            'user_id'        => 1,
            'receiver_name'  => 'John Doe',
            'receiver_phone' => '123-456-7890',
            'is_default'     => true,
            'street'         => '123 Main St',
            'number'         => '456',
            'complement'     => 'Apt 789',
            'district'           => 'Metropolis',
            'zipcode'        => '12345-678',
        ]);

        Address::create([
            'user_id'        => 2,
            'receiver_name'  => 'Cauã Santos',
            'receiver_phone' => '987-654-3210',
            'is_default'     => true,
            'street'         => 'Marechal Alencastro',
            'number'         => '3695',
            'complement'     => 'Drogarias Camargo',
            'district'           => 'Rio de Janeiro',
            'zipcode'        => '25530-071',
        ]);

        Address::create([
            'user_id'        => 2,
            'receiver_name' => 'Jane Smith',
            'receiver_phone' => '555-123-4567',
            'street'         => 'Oak Avenue',
            'number'         => '456',
            'complement'     => 'Apt 789',
            'district'           => 'Kansas district',
            'zipcode'        => '12345-678',
        ]);
    }
}
