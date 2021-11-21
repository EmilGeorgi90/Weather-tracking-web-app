<?php

use App\Http\Controllers\WeatherController;
use Illuminate\Support\Facades\Route;
Use App\Weather;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('weather', [WeatherController::class, 'store']);
Route::get('weather', [WeatherController::class, 'index']);
