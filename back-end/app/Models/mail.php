<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class mail extends Model
{
    use HasFactory;
    public $table = 'mail';
    public $timestamps = false;
}
