<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Laboratory;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    
    public function run(): void {

        $this->call([

            UserSeeder::class,
            BannersSeeder::class,
            LaboratorySeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            ProductImageSeeder::class,
            CategoryMetadataSeeder::class,
            SubCategorySeeder::class,
            FormulaSeeder::class,
            AddressSeeder::class,
            ProductMetadataValueSeeder::class,
        ]);
        
    }
    
}
