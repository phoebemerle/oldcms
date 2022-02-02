<?php

use Illuminate\Http\Request;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::any('inventory/{any?}', 'ApiController@inventory')->where('any', '.*');
Route::any('catalogue/{any?}', 'ApiController@catalogue')->where('any', '.*');
Route::any('marketing/{any?}', 'ApiController@marketing')->where('any', '.*');
Route::any('accounts/{any?}', 'ApiController@accounts')->where('any', '.*');
Route::any('cdn/{any?}', 'ApiController@cdn')->where('any', '.*');;

// Get Search URL
Route::any('get_search_url_staging', 'ApiController@GetSearchURLStaging');
Route::any('get_search_url_production', 'ApiController@GetSearchURLProduction');