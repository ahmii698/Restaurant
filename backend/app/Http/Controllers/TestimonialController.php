<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::where('is_active', true)
            ->orderBy('order')
            ->get();
            
        return response()->json($testimonials);
    }
    
    public function getActive()
    {
        $testimonials = Testimonial::where('is_active', true)
            ->where('status', 'approved')
            ->orderBy('order')
            ->get();
            
        return response()->json($testimonials);
    }
    
    // User submits testimonial (pending approval)
    public function userStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'initials' => 'required|string|max:10',
            'stars' => 'required|integer|min:1|max:5',
            'quote' => 'required|string|min:10|max:1000',
        ]);
        
        $validated['is_active'] = false;
        $validated['status'] = 'pending';
        $validated['order'] = Testimonial::max('order') + 1;
        
        $testimonial = Testimonial::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Thank you for your feedback! It will be published after review.',
            'data' => $testimonial
        ], 201);
    }
    
    // Admin gets pending testimonials
    public function getPending()
    {
        $pending = Testimonial::where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($pending);
    }
    
    // Admin approves testimonial
    public function approve($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update([
            'status' => 'approved',
            'is_active' => true
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Testimonial approved successfully'
        ]);
    }
    
    // Admin rejects testimonial
    public function reject($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update([
            'status' => 'rejected',
            'is_active' => false
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Testimonial rejected'
        ]);
    }
}