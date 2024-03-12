<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class workinghours extends Model
{
    use HasFactory;
    public $table = 'workinghours';
    public $timestamps = false;
}
