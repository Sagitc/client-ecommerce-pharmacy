@extends('layouts.app')

@section('title', 'Título do produto aqui | Drogarias Camargo')

@push('styles')
    @vite('resources/css/pages/product.css')
@endpush

@section('content')
    
@endsection

@push('scripts')
    @vite('resources/js/pages/_product.ts')
@endpush