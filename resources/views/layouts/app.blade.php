<!DOCTYPE html>
<html lang="pt_BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    @stack('styles')

    @vite(['resources/css/app.css'])

    <title>@yield('title', 'Drogarias Camargo')</title>

</head>
<body>
    <header>
        @yield('header')
        @yield('nav')
    </header>

    <main>
        @yield('content')
    </main>

    <footer>
        @yield('footer')
    </footer>

    @stack('scripts')
</body>
</html>