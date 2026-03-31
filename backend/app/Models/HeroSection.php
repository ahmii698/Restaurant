<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSection extends Model
{
    protected $table = 'hero_section';
    
    protected $fillable = [
        'heading_1', 'heading_2', 'description', 
        'btn_1_text', 'btn_1_icon', 'btn_2_text', 'btn_2_icon', 
        'video_url', 'is_active'
    ];
    
    protected $casts = [
        'is_active' => 'boolean'
    ];
}