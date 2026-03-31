<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HeroSection;

class HeroSectionSeeder extends Seeder
{
    public function run(): void
    {
        HeroSection::create([
            'heading_1' => 'Luxury Dining',
            'heading_2' => 'Reimagined',
            'description' => 'Experience the pinnacle of gastronomy. Handcrafted burgers, premium ingredients, and an ambiance that defines elegance.',
            'btn_1_text' => 'Explore Menu',
            'btn_1_icon' => 'fa-utensils',
            'btn_2_text' => 'Reserve Now',
            'btn_2_icon' => 'fa-calendar-alt',
            'video_url' => '/video/burg_vid.mp4',
            'is_active' => true,
        ]);
    }
}