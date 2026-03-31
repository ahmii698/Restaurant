<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120'
        ]);
        
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9.]/', '_', $image->getClientOriginalName());
            
            // Frontend public folder mein save
            $image->move(base_path('../frontend/public/images/menu'), $filename);
            
            return response()->json([
                'success' => true,
                'url' => '/images/menu/' . $filename,
                'message' => 'Image uploaded successfully'
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'No image file'
        ], 400);
    }
}