<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutSection extends Model
{
    protected $table = 'about_section';
    
    protected $fillable = [
        'badge', 'heading', 'paragraph_1', 'paragraph_2', 
        'image_url', 'established_year', 'image_badge_text',
        'button_text', 'button_icon', 'is_active'
    ];
    
    protected $casts = [
        'is_active' => 'boolean'
    ];
}