<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_section', function (Blueprint $table) {
            $table->id();
            $table->string('heading_1')->default('Luxury Dining');      // First heading
            $table->string('heading_2')->default('Reimagined');         // Second heading
            $table->text('description')->nullable();                     // Paragraph text
            $table->string('btn_1_text')->default('Explore Menu');       // First button text
            $table->string('btn_1_icon')->default('fa-utensils');        // First button icon
            $table->string('btn_2_text')->default('Reserve Now');        // Second button text
            $table->string('btn_2_icon')->default('fa-calendar-alt');    // Second button icon
            $table->string('video_url')->default('/video/burg_vid.mp4'); // Video path
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_section');
    }
};