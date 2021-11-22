<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Weather;
use Illuminate\Support\Carbon;

class WeatherController extends Controller
{
    public function index()
    {
        $records = Weather::whereDate('created_at', Carbon::today())->get();
        return $records;
    }
    public function store(Request $request)
    {
        try {
            return response()->json(Weather::create($request->all()), 201);
        } catch (\Exception $e) {
            // Return Json Response
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
