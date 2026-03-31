<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AboutSection;

class AboutSectionSeeder extends Seeder
{
    public function run(): void
    {
        AboutSection::create([
            'badge' => 'Our Story',
            'heading' => 'A Legacy of Culinary Excellence',
            'paragraph_1' => 'The Gourmet Bistro was born from a vision to create extraordinary dining experiences. Every ingredient is carefully sourced from around the world, every dish crafted with artistic precision.',
            'paragraph_2' => 'From Australian Wagyu to Italian truffles, our commitment to quality is uncompromising. Join us for a journey that celebrates flavor, passion, and perfection.',
            'image_url' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
            'established_year' => '2010',
            'image_badge_text' => 'Where Flavor Meets Passion',
            'button_text' => 'Discover Our Space',
            'button_icon' => 'fa-arrow-right',
            'is_active' => true,
        ]);
    }
}