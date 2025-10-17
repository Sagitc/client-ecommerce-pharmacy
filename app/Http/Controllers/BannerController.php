<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function getAllBanners()
    {
        $banners = Banner::all();

        $result = [];

        foreach ($banners as $banner) {
            $result[] = [
                'id' => $banner->id,
                'file_path' => asset('storage/' . $banner->file_path),
                'link' => $banner->link,
            ];
        }

        return $result;
    }
}
