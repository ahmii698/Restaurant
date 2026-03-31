<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HeroStat;

class HeroStatsSeeder extends Seeder
{
    public function run(): void
    {
        $stats = [
            ['label' => 'Gourmet Burgers', 'value' => 85, 'order' => 1, 'is_active' => true],
            ['label' => 'Years Excellence', 'value' => 15, 'order' => 2, 'is_active' => true],
            ['label' => 'Awards Won', 'value' => 25, 'order' => 3, 'is_active' => true],
        ];

        foreach ($stats as $stat) {
            HeroStat::create($stat);
        }
    }
}