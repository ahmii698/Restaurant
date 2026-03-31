<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutFeature extends Model
{
    protected $table = 'about_features';
    
    protected $fillable = [
        'title', 'icon', 'order', 'is_active'
    ];
    
    protected $casts = [
        'order' => 'integer',
        'is_active' => 'boolean'
    ];
}