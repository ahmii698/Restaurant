<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'name', 'phone', 'email', 'date', 'time', 
        'guests', 'special_requests', 'status'
    ];
    
    protected $casts = [
        'date' => 'date:Y-m-d',  // Add this line - format YYYY-MM-DD
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s'
    ];
}