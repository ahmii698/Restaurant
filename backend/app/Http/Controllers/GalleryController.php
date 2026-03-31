<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::where('is_active', true)
            ->orderBy('order')
            ->get();
            
        return response()->json($galleries);
    }
    
    public function getByCategory($category)
    {
        $galleries = Gallery::where('category', $category)
            ->where('is_active', true)
            ->orderBy('order')
            ->get();
            
        return response()->json($galleries);
    }
    
    // Admin functions for later
    public function updateOrder(Request $request)
    {
        foreach ($request->items as $item) {
            Gallery::where('id', $item['id'])->update(['order' => $item['order']]);
        }
        return response()->json(['message' => 'Order updated successfully']);
    }
}