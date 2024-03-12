<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class timeoffapproval extends Model
{
    use HasFactory;
    public $table = 'timeoffapproval';
    public $timestamps = false;
}
