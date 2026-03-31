<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\MenuItem;
use App\Models\Gallery;
use App\Models\Testimonial;
use App\Models\HeroSection;
use App\Models\HeroStat;
use App\Models\AboutSection;
use App\Models\AboutFeature;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Dashboard Stats
    public function dashboard()
    {
        return response()->json([
            'total_reservations' => Reservation::count(),
            'pending_reservations' => Reservation::where('status', 'pending')->count(),
            'total_menu_items' => MenuItem::count(),
            'total_gallery' => Gallery::count(),
            'total_testimonials' => Testimonial::count(),
        ]);
    }
    
    // ============ RESERVATIONS ============
    public function getReservations()
    {
        $reservations = Reservation::latest()->get();
        return response()->json($reservations);
    }
    
    public function updateReservation(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update($request->all());
        return response()->json(['message' => 'Reservation updated', 'data' => $reservation]);
    }
    
    public function deleteReservation($id)
    {
        Reservation::destroy($id);
        return response()->json(['message' => 'Reservation deleted']);
    }
    
    // ============ MENU ============
    public function getMenu()
    {
        $menu = MenuItem::orderBy('category')->orderBy('order')->get();
        return response()->json($menu);
    }
    
    public function storeMenu(Request $request)
    {
        $menu = MenuItem::create($request->all());
        return response()->json(['message' => 'Menu added', 'data' => $menu]);
    }
    
    public function updateMenu(Request $request, $id)
    {
        $menu = MenuItem::findOrFail($id);
        $menu->update($request->all());
        return response()->json(['message' => 'Menu updated', 'data' => $menu]);
    }
    
    public function deleteMenu($id)
    {
        MenuItem::destroy($id);
        return response()->json(['message' => 'Menu deleted']);
    }
    
    // ============ GALLERY ============
    public function getGallery()
    {
        $gallery = Gallery::orderBy('order')->get();
        return response()->json($gallery);
    }
    
    public function storeGallery(Request $request)
    {
        $gallery = Gallery::create($request->all());
        return response()->json(['message' => 'Image added', 'data' => $gallery]);
    }
    
    public function updateGallery(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);
        $gallery->update($request->all());
        return response()->json(['message' => 'Image updated', 'data' => $gallery]);
    }
    
    public function deleteGallery($id)
    {
        Gallery::destroy($id);
        return response()->json(['message' => 'Image deleted']);
    }
    
    // ============ TESTIMONIALS ============
    public function getTestimonials()
    {
        $testimonials = Testimonial::orderBy('order')->get();
        return response()->json($testimonials);
    }
    
    public function storeTestimonial(Request $request)
    {
        $testimonial = Testimonial::create($request->all());
        return response()->json(['message' => 'Testimonial added', 'data' => $testimonial]);
    }
    
    public function updateTestimonial(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update($request->all());
        return response()->json(['message' => 'Testimonial updated', 'data' => $testimonial]);
    }
    
    public function deleteTestimonial($id)
    {
        Testimonial::destroy($id);
        return response()->json(['message' => 'Testimonial deleted']);
    }
    
    // ============ HERO SECTION ============
    public function getHero()
    {
        $hero = HeroSection::first();
        return response()->json($hero);
    }
    
    public function updateHero(Request $request, $id)
    {
        $hero = HeroSection::findOrFail($id);
        $hero->update($request->all());
        return response()->json(['message' => 'Hero updated', 'data' => $hero]);
    }
    
    // ============ HERO STATS ============
    public function getHeroStats()
    {
        $stats = HeroStat::where('is_active', true)
            ->orderBy('order')
            ->get();
        return response()->json($stats);
    }
    
    public function storeHeroStat(Request $request)
    {
        $request->validate([
            'label' => 'required|string|max:255',
            'value' => 'required|integer',
            'order' => 'integer'
        ]);
        
        $stat = HeroStat::create($request->all());
        return response()->json(['message' => 'Stat added', 'data' => $stat], 201);
    }
    
    public function updateHeroStat(Request $request, $id)
    {
        $stat = HeroStat::findOrFail($id);
        $stat->update($request->all());
        return response()->json(['message' => 'Stat updated', 'data' => $stat]);
    }
    
    public function deleteHeroStat($id)
    {
        HeroStat::destroy($id);
        return response()->json(['message' => 'Stat deleted']);
    }
    
    // ============ ABOUT SECTION ============
    public function getAbout()
    {
        $about = AboutSection::first();
        $features = AboutFeature::orderBy('order')->get();
        return response()->json(['about' => $about, 'features' => $features]);
    }
    
    public function updateAbout(Request $request, $id)
    {
        $about = AboutSection::findOrFail($id);
        $about->update($request->all());
        return response()->json(['message' => 'About updated', 'data' => $about]);
    }
    
    public function storeFeature(Request $request)
    {
        $feature = AboutFeature::create($request->all());
        return response()->json(['message' => 'Feature added', 'data' => $feature]);
    }
    
    public function updateFeature(Request $request, $id)
    {
        $feature = AboutFeature::findOrFail($id);
        $feature->update($request->all());
        return response()->json(['message' => 'Feature updated', 'data' => $feature]);
    }
    
    public function deleteFeature($id)
    {
        AboutFeature::destroy($id);
        return response()->json(['message' => 'Feature deleted']);
    }
}