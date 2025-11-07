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
            'user_id'       => 1,
            'street'        => '123 Main St',
            'number'        => '456',
            'complement'    => 'Apt 789',
            'city'          => 'Metropolis',
            'state'         => 'NY',
            'zipcode'       => '12345-678',
            'country'       => 'USA',
        ]);
    }
}
