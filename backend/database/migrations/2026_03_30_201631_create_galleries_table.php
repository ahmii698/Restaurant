<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title');              // Image title
            $table->string('image_url');           // Image URL
            $table->string('category')->default('general');
            $table->integer('order')->default(0);   // Display order (1,2,3...8)
            $table->string('span_type')->nullable(); // 'row-span-2 col-span-2' or 'col-span-2'
            $table->string('text_size')->default('normal'); // 'large' or 'normal'
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('galleries');
    }
};