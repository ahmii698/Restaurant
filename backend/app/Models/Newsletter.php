<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    protected $fillable = ['email', 'is_subscribed'];
    
    protected $casts = [
        'is_subscribed' => 'boolean'
    ];
}