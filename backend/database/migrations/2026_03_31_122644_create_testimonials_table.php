<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');              // Customer name
            $table->string('title');              // Customer title (Food Critic, Regular Customer etc)
            $table->string('initials');           // Initials for avatar (MK, SR, DC)
            $table->integer('stars')->default(5); // Rating (1-5)
            $table->text('quote');                // Testimonial quote
            $table->string('avatar_color')->nullable(); // Avatar color (optional)
            $table->integer('order')->default(0); // Display order
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};