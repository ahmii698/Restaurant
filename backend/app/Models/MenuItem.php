<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'name', 'category', 'price', 'description', 
        'image_url', 'badge', 'is_available', 'order'
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean'
    ];
}