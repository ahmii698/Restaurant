<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_section', function (Blueprint $table) {
            $table->id();
            $table->string('badge')->default('Our Story');           // Badge text
            $table->string('heading')->default('A Legacy of Culinary Excellence'); // Main heading
            $table->text('paragraph_1')->nullable();                  // First paragraph
            $table->text('paragraph_2')->nullable();                  // Second paragraph
            $table->string('image_url')->nullable();                  // About section image
            $table->string('established_year')->default('2010');      // Est. year
            $table->string('image_badge_text')->default('Where Flavor Meets Passion'); // Image badge text
            $table->string('button_text')->default('Discover Our Space'); // Button text
            $table->string('button_icon')->default('fa-arrow-right'); // Button icon
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_section');
    }
};