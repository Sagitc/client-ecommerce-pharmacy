<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BannersSeeder extends Seeder  {
    
    public function run(): void {

        Banner::create([

            'file_path' => 'banners/fake_banner.jpg',
            'link'      => 'https://google.com',

        ]);

    }

}
