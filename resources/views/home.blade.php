@extends('layout')

@section('title', 'Drogarias Camargo | Home')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/home.css') }}">
@endpush

@section('content')
    <h1>Bem-vindo à Drogarias Camargo</h1>
    <p>Aqui você encontra os melhores produtos para a sua saúde.</p>
@endsection

