<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($user->email);
        });

        // Rate Limiter para autenticação (proteção contra força bruta)
        RateLimiter::for('auth', function (Request $request) {
            return app()->environment('testing')
                ? Limit::none()
                : Limit::perMinute(10)->by($request->ip());
        });

        // Rate Limiter para recuperação de senha (proteção contra email bombing)
        RateLimiter::for('password-reset', function (Request $request) {
            return app()->environment('testing')
                ? Limit::none()
                : Limit::perMinute(5)->by($request->ip());
        });

        // Rate Limiter para cálculo de frete (proteção de cota Google Maps)
        RateLimiter::for('shipping', function (Request $request) {
            return app()->environment('testing')
                ? Limit::none()
                : Limit::perMinute(20)->by($request->ip());
        });

        // Rate Limiter para pedidos (proteção contra spam de pedidos)
        RateLimiter::for('orders', function (Request $request) {
            return app()->environment('testing')
                ? Limit::none()
                : Limit::perMinute(15)->by($request->user()?->id ?: $request->ip());
        });

        // Rate Limiter para validação de cupons (proteção contra enumeração)
        RateLimiter::for('coupons', function (Request $request) {
            return app()->environment('testing')
                ? Limit::none()
                : Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });

        // Rate Limiter para upload de avatar (proteção contra abuso de armazenamento/DoS)
        RateLimiter::for('avatar-upload', function (Request $request) {
            return app()->environment('testing')
                ? Limit::none()
                : Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
        });
    }
}
