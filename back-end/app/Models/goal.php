<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class goal extends Model
{
    use HasFactory;
    public $table = 'goal';
    public $timestamps = false;
}
