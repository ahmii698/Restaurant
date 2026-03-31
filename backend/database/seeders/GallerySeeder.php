<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $galleries = [
            [
                'title' => 'Main Dining Hall',
                'image_url' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
                'category' => 'dining',
                'order' => 1,
                'span_type' => 'row-span-2 col-span-2',
                'text_size' => 'large',
                'is_active' => true,
            ],
            [
                'title' => 'Signature Burger',
                'image_url' => 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
                'category' => 'food',
                'order' => 2,
                'span_type' => null,
                'text_size' => 'normal',
                'is_active' => true,
            ],
            [
                'title' => 'Craft Cocktails',
                'image_url' => 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
                'category' => 'drinks',
                'order' => 3,
                'span_type' => null,
                'text_size' => 'normal',
                'is_active' => true,
            ],
            [
                'title' => 'Open Kitchen Experience',
                'image_url' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
                'category' => 'kitchen',
                'order' => 4,
                'span_type' => 'col-span-2',
                'text_size' => 'large',
                'is_active' => true,
            ],
            [
                'title' => 'Gourmet Creations',
                'image_url' => 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400',
                'category' => 'food',
                'order' => 5,
                'span_type' => null,
                'text_size' => 'normal',
                'is_active' => true,
            ],
            [
                'title' => 'VIP Lounge',
                'image_url' => 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400',
                'category' => 'vip',
                'order' => 6,
                'span_type' => null,
                'text_size' => 'normal',
                'is_active' => true,
            ],
            [
                'title' => 'Private Dining Room',
                'image_url' => 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400',
                'category' => 'dining',
                'order' => 7,
                'span_type' => null,
                'text_size' => 'normal',
                'is_active' => true,
            ],
            [
                'title' => 'Wine Cellar & Bar',
                'image_url' => 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400',
                'category' => 'drinks',
                'order' => 8,
                'span_type' => null,
                'text_size' => 'normal',
                'is_active' => true,
            ],
        ];

        foreach ($galleries as $gallery) {
            Gallery::create($gallery);
        }
    }
}