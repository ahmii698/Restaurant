<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Michael K.',
                'title' => 'Food Critic',
                'initials' => 'MK',
                'stars' => 5,
                'quote' => 'The best dining experience I\'ve ever had! The Wagyu truffle burger is absolutely divine. Service is impeccable.',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Sarah R.',
                'title' => 'Regular Customer',
                'initials' => 'SR',
                'stars' => 5,
                'quote' => 'Outstanding ambiance and even better food. The craft beer selection is exceptional. Will definitely return!',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'David C.',
                'title' => 'Business Executive',
                'initials' => 'DC',
                'stars' => 5,
                'quote' => 'Perfect for business dinners and special occasions. Professional service, elegant atmosphere, and consistently excellent.',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Emily W.',
                'title' => 'Food Blogger',
                'initials' => 'EW',
                'stars' => 5,
                'quote' => 'The ambiance is incredible! Perfect for date nights. The staff is super friendly and the food is to die for.',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'James L.',
                'title' => 'Regular Customer',
                'initials' => 'JL',
                'stars' => 5,
                'quote' => 'Best steak I\'ve ever had! The truffle fries are a must-try. Will definitely be coming back.',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Priya S.',
                'title' => 'Celebrity Chef',
                'initials' => 'PS',
                'stars' => 5,
                'quote' => 'As a chef, I appreciate the attention to detail. Every dish is perfectly executed. A true culinary gem!',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Robert M.',
                'title' => 'Wine Enthusiast',
                'initials' => 'RM',
                'stars' => 5,
                'quote' => 'The wine selection is outstanding! The sommelier recommended the perfect pairing for my meal. Exceptional service.',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Lisa T.',
                'title' => 'Travel Blogger',
                'initials' => 'LT',
                'stars' => 5,
                'quote' => 'Traveled across the world and this is one of the best restaurants I\'ve visited. The ambiance, service, and food are top-notch!',
                'order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}