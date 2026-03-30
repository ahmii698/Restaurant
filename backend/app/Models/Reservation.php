<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'name', 'phone', 'email', 'date', 'time', 
        'guests', 'special_requests', 'vip', 'status'
    ];
    
    protected $casts = [
        'vip' => 'boolean',
        'date' => 'date'
    ];
}