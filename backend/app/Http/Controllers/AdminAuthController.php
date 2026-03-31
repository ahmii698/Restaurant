<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
        
        $admin = Admin::where('username', $request->username)
                     ->orWhere('email', $request->username)
                     ->first();
        
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }
        
        // Create simple token (you can use Laravel Sanctum for better security)
        $token = base64_encode($admin->id . '|' . time());
        
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'admin' => [
                'id' => $admin->id,
                'username' => $admin->username,
                'email' => $admin->email,
            ],
            'token' => $token
        ]);
    }
    
    public function verify(Request $request)
    {
        $token = $request->header('Authorization');
        if (!$token) {
            return response()->json(['success' => false], 401);
        }
        
        // Simple token verification
        $token = str_replace('Bearer ', '', $token);
        $parts = explode('|', base64_decode($token));
        
        if (count($parts) != 2) {
            return response()->json(['success' => false], 401);
        }
        
        $admin = Admin::find($parts[0]);
        if (!$admin) {
            return response()->json(['success' => false], 401);
        }
        
        return response()->json(['success' => true, 'admin' => $admin]);
    }
    
    public function logout(Request $request)
    {
        return response()->json(['success' => true, 'message' => 'Logged out']);
    }
}