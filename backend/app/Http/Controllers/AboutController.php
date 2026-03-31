<?php

namespace App\Http\Controllers;

use App\Models\AboutSection;
use App\Models\AboutFeature;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function getAboutContent()
    {
        $about = AboutSection::where('is_active', true)->first();
        $features = AboutFeature::where('is_active', true)
            ->orderBy('order')
            ->get();
            
        return response()->json([
            'about' => $about,
            'features' => $features
        ]);
    }
}