<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use App\Models\HeroStat;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function getHeroContent()
    {
        $hero = HeroSection::where('is_active', true)->first();
        $stats = HeroStat::where('is_active', true)
            ->orderBy('order')
            ->get();
            
        return response()->json([
            'hero' => $hero,
            'stats' => $stats
        ]);
    }
}