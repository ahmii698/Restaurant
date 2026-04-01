<?php

namespace App\Http\Controllers;

use App\Helpers\MailHelper;
use Illuminate\Http\Request;

class EmailController extends Controller
{
    public function sendEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);
        
        $result = MailHelper::sendCustomEmail(
            $request->email,
            $request->name,
            $request->subject,
            $request->message
        );
        
        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Email sent successfully'
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to send email'
        ], 500);
    }
}