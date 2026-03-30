<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::where('is_available', true)
            ->orderBy('order')
            ->get()
            ->groupBy('category');
            
        return response()->json($menuItems);
    }
    
    public function getByCategory($category)
    {
        $items = MenuItem::where('category', $category)
            ->where('is_available', true)
            ->orderBy('order')
            ->get();
            
        return response()->json($items);
    }
}