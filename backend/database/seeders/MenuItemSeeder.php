<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuItem;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $menuItems = [
            // Burgers
            ['name' => 'Wagyu Truffle Burger', 'category' => 'burgers', 'price' => 28, 'description' => 'Australian Wagyu, black truffle aioli, foie gras', 'badge' => "Chef's Special", 'image_url' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', 'order' => 1],
            ['name' => 'Double Smash Burger', 'category' => 'burgers', 'price' => 18, 'description' => 'Two patties, American cheese, secret sauce', 'badge' => 'Best Seller', 'image_url' => 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600', 'order' => 2],
            ['name' => 'Plant-Based Delight', 'category' => 'burgers', 'price' => 16, 'description' => 'Beyond meat, vegan cheese, avocado', 'badge' => 'Vegan', 'image_url' => 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600', 'order' => 3],
            
            // Sides
            ['name' => 'Truffle Parmesan Fries', 'category' => 'sides', 'price' => 9, 'description' => 'Crispy fries with truffle oil', 'image_url' => 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600', 'order' => 1],
            ['name' => 'Onion Rings', 'category' => 'sides', 'price' => 8, 'description' => 'Beer-battered with chipotle dip', 'image_url' => 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600', 'order' => 2],
            ['name' => 'Mac & Cheese Balls', 'category' => 'sides', 'price' => 10, 'description' => 'Crispy fried mac & cheese', 'image_url' => 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=600', 'order' => 3],
            
            // Drinks
            ['name' => 'Craft Beer Flight', 'category' => 'drinks', 'price' => 15, 'description' => '4 local craft beers', 'image_url' => 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600', 'order' => 1],
            ['name' => 'Signature Old Fashioned', 'category' => 'drinks', 'price' => 14, 'description' => 'Bourbon, bitters, orange zest', 'image_url' => 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600', 'order' => 2],
            ['name' => 'Fresh Lemonade', 'category' => 'drinks', 'price' => 5, 'description' => 'House-made with mint', 'image_url' => 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600', 'order' => 3],
            
            // Desserts
            ['name' => 'Molten Lava Cake', 'category' => 'desserts', 'price' => 10, 'description' => 'With vanilla ice cream', 'image_url' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600', 'order' => 1],
            ['name' => 'Cheesecake', 'category' => 'desserts', 'price' => 9, 'description' => 'With berry compote', 'image_url' => 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?w=600', 'order' => 2],
            ['name' => 'Cookie Skillet', 'category' => 'desserts', 'price' => 11, 'description' => 'Warm cookie with ice cream', 'image_url' => 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600', 'order' => 3],
            
            // Hookah
            ['name' => 'Classic Double Apple', 'category' => 'hookah', 'price' => 25, 'description' => 'Premium double apple flavor, smooth smoke', 'badge' => 'Popular', 'image_url' => 'https://images.unsplash.com/photo-1548606348-9f2f29b3e4f2?w=600', 'order' => 1],
            ['name' => 'Blueberry Mint', 'category' => 'hookah', 'price' => 27, 'description' => 'Refreshing blueberry with mint undertones', 'image_url' => 'https://images.unsplash.com/photo-1548606348-9f2f29b3e4f2?w=600', 'order' => 2],
            ['name' => 'VIP Special Blend', 'category' => 'hookah', 'price' => 35, 'description' => 'Exclusive house blend, premium tobacco', 'badge' => "Chef's Choice", 'image_url' => 'https://images.unsplash.com/photo-1548606348-9f2f29b3e4f2?w=600', 'order' => 3],
            ['name' => 'Paan Ras', 'category' => 'hookah', 'price' => 28, 'description' => 'Traditional paan flavor, exotic experience', 'image_url' => 'https://images.unsplash.com/photo-1548606348-9f2f29b3e4f2?w=600', 'order' => 4],
            ['name' => 'Watermelon Chill', 'category' => 'hookah', 'price' => 26, 'description' => 'Sweet watermelon with cooling effect', 'image_url' => 'https://images.unsplash.com/photo-1548606348-9f2f29b3e4f2?w=600', 'order' => 5],
        ];
        
        foreach ($menuItems as $item) {
            MenuItem::create($item);
        }
    }
}