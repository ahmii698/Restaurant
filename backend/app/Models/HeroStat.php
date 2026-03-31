<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroStat extends Model
{
    protected $table = 'hero_stats';
    
    protected $fillable = [
        'label', 'value', 'icon', 'order', 'is_active'
    ];
    
    protected $casts = [
        'value' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean'
    ];
}