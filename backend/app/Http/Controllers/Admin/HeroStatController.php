<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroStat;
use Illuminate\Http\Request;

class HeroStatController extends Controller
{
    public function index()
    {
        $stats = HeroStat::orderBy('order')->get();
        return response()->json($stats);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'value' => 'required|integer',
            'icon' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean'
        ]);
        
        $stat = HeroStat::create($validated);
        return response()->json($stat, 201);
    }
    
    public function update(Request $request, $id)
    {
        $stat = HeroStat::findOrFail($id);
        
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'value' => 'required|integer',
            'icon' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean'
        ]);
        
        $stat->update($validated);
        return response()->json($stat);
    }
    
    public function destroy($id)
    {
        $stat = HeroStat::findOrFail($id);
        $stat->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
    
    public function updateOrder(Request $request)
    {
        $stats = $request->stats;
        
        foreach ($stats as $stat) {
            HeroStat::where('id', $stat['id'])->update(['order' => $stat['order']]);
        }
        
        return response()->json(['message' => 'Order updated successfully']);
    }
}