<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AboutFeature;

class AboutFeaturesSeeder extends Seeder
{
    public function run(): void
    {
        $features = [
            ['title' => 'Premium Wagyu Beef', 'icon' => 'fa-check-circle', 'order' => 1, 'is_active' => true],
            ['title' => 'Fresh Daily Produce', 'icon' => 'fa-check-circle', 'order' => 2, 'is_active' => true],
            ['title' => 'Artisanal Buns', 'icon' => 'fa-check-circle', 'order' => 3, 'is_active' => true],
            ['title' => 'House-made Sauces', 'icon' => 'fa-check-circle', 'order' => 4, 'is_active' => true],
        ];

        foreach ($features as $feature) {
            AboutFeature::create($feature);
        }
    }
}