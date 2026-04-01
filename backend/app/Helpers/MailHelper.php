<?php

namespace App\Helpers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailHelper
{
    public static function sendReservationMail($reservation)
    {
        $mail = new PHPMailer(true);
        
        try {
            // Server settings
            $mail->SMTPDebug = 0;
            $mail->isSMTP();
            $mail->Host       = env('MAIL_HOST', 'smtp.gmail.com');
            $mail->SMTPAuth   = true;
            $mail->Username   = env('MAIL_USERNAME');
            $mail->Password   = env('MAIL_PASSWORD');
            $mail->SMTPSecure = env('MAIL_ENCRYPTION', 'tls');
            $mail->Port       = env('MAIL_PORT', 587);
            
            // Recipients
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME', 'Gourmet Bistro'));
            $mail->addAddress(env('MAIL_USERNAME'), 'Admin');
            
            if ($reservation->email) {
                $mail->addReplyTo($reservation->email, $reservation->name);
            }
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = 'New Reservation - ' . $reservation->name;
            
            $body = "
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; background: #1a1510; border: 1px solid #eab308; border-radius: 10px; overflow: hidden; }
                    .header { background: #eab308; padding: 20px; text-align: center; }
                    .header h1 { color: #000; margin: 0; }
                    .content { padding: 20px; color: #fff; }
                    .info { margin: 10px 0; padding: 10px; background: #2a241f; border-radius: 5px; }
                    .label { font-weight: bold; color: #eab308; }
                    .footer { background: #0f0c09; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>🍽️ New Reservation</h1>
                    </div>
                    <div class='content'>
                        <p>A new reservation has been made at <strong>Gourmet Bistro</strong>.</p>
                        
                        <div class='info'>
                            <p><span class='label'>👤 Name:</span> {$reservation->name}</p>
                            <p><span class='label'>📞 Phone:</span> {$reservation->phone}</p>
                            <p><span class='label'>📧 Email:</span> " . ($reservation->email ?? 'Not provided') . "</p>
                            <p><span class='label'>📅 Date:</span> {$reservation->date}</p>
                            <p><span class='label'>⏰ Time:</span> {$reservation->time}</p>
                            <p><span class='label'>👥 Guests:</span> {$reservation->guests}</p>
                        </div>
                        
                        " . ($reservation->special_requests ? "
                        <div class='info'>
                            <p><span class='label'>💬 Special Request:</span><br>{$reservation->special_requests}</p>
                        </div>
                        " : '') . "
                        
                        <p>Please log in to the admin panel to manage this reservation.</p>
                    </div>
                    <div class='footer'>
                        <p>Gourmet Bistro - Luxury Dining Reimagined</p>
                    </div>
                </div>
            </body>
            </html>
            ";
            
            $mail->Body = $body;
            $mail->AltBody = "New Reservation from {$reservation->name}\n\nPhone: {$reservation->phone}\nDate: {$reservation->date}\nTime: {$reservation->time}\nGuests: {$reservation->guests}";
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            \Log::error('Mail Error: ' . $mail->ErrorInfo);
            return false;
        }
    }
    
    // ============ NEW METHOD: Send Custom Email to Customer ============
    public static function sendCustomEmail($toEmail, $toName, $subject, $customMessage)
    {
        $mail = new PHPMailer(true);
        
        try {
            $mail->SMTPDebug = 0;
            $mail->isSMTP();
            $mail->Host       = env('MAIL_HOST', 'smtp.gmail.com');
            $mail->SMTPAuth   = true;
            $mail->Username   = env('MAIL_USERNAME');
            $mail->Password   = env('MAIL_PASSWORD');
            $mail->SMTPSecure = env('MAIL_ENCRYPTION', 'tls');
            $mail->Port       = env('MAIL_PORT', 587);
            
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME', 'Gourmet Bistro'));
            $mail->addAddress($toEmail, $toName);
            
            $mail->isHTML(true);
            $mail->Subject = $subject;
            
            $body = "
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #0a0705; color: #fff; }
                    .container { max-width: 600px; margin: 0 auto; background: #1a1510; border: 1px solid #eab308; border-radius: 10px; overflow: hidden; }
                    .header { background: #eab308; padding: 20px; text-align: center; }
                    .header h1 { color: #000; margin: 0; font-size: 24px; }
                    .content { padding: 20px; }
                    .message-box { background: #2a241f; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #eab308; }
                    .footer { background: #0f0c09; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>🍽️ Gourmet Bistro</h1>
                    </div>
                    <div class='content'>
                        <p>Dear <strong>{$toName}</strong>,</p>
                        <div class='message-box'>
                            {$customMessage}
                        </div>
                        <p>If you have any questions, please feel free to contact us.</p>
                        <p>Thank you for choosing Gourmet Bistro.</p>
                    </div>
                    <div class='footer'>
                        <p>Gourmet Bistro - Luxury Dining Reimagined</p>
                        <p>456 Gourmet Avenue, New York, NY 10001 | +1 (555) 987-6543</p>
                    </div>
                </div>
            </body>
            </html>
            ";
            
            $mail->Body = $body;
            $mail->AltBody = strip_tags($customMessage);
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            \Log::error('Custom Mail Error: ' . $mail->ErrorInfo);
            return false;
        }
    }
}