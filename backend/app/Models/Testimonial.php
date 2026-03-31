<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name', 'title', 'initials', 'stars', 'quote', 
        'order', 'is_active'
    ];
    
    protected $casts = [
        'stars' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean'
    ];
}