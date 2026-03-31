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
            ->orderBy('order')
            ->get();
            
        return response()->json($testimonials);
    }
}