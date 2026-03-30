<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'date' => 'required|date',
            'time' => 'required|string',
            'guests' => 'required|string',
            'special_requests' => 'nullable|string',
            'vip' => 'boolean'
        ]);
        
        $reservation = Reservation::create($validated);
        
        return response()->json([
            'message' => 'Reservation confirmed successfully!',
            'data' => $reservation
        ], 201);
    }
    
    public function index()
    {
        $reservations = Reservation::latest()->get();
        return response()->json($reservations);
    }
}