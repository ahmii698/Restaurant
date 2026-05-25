<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroStat extends Model
{
    protected $fillable = [
        'label', 'value', 'icon', 'order', 'is_active'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'value' => 'integer'
    ];
}