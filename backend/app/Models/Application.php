<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    protected $fillable = ['user_id', 'company', 'role', 'status', 'applied_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
