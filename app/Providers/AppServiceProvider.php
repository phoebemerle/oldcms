<?php

namespace App\Providers;

use App\Services\HttpService\GuzzleHttpService;
use App\Services\HttpService\HttpService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(HttpService::class, GuzzleHttpService::class);
    }
}
