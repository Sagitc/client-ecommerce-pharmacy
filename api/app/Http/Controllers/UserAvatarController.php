<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver; // Driver padrão para Ubuntu/GD
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserAvatarController extends Controller
{
    public function upload(Request $request)
{
    // 1. Validação robusta
    $request->validate([
        'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    $user = User::find(Auth::user()->id);

    $manager = new ImageManager(new Driver());
    $image = $manager->read($request->file('avatar'));

    // O método 'cover' redimensiona e corta para preencher o espaço sem distorcer
    $image->cover(400, 400);

    $encoded = $image->toJpeg(85);

    $filename = Str::uuid() . '.jpg';
    $path = 'avatars/' . $filename;

    if ($user->avatar) {
        Storage::disk('public')->delete($user->avatar);
    }

    Storage::disk('public')->put($path, (string) $encoded);

    $user->update(['avatar' => $path]);

    return back()->with('success', 'Avatar atualizado com sucesso!');
}

    public function delete()
    {
        $user = User::find(Auth::user()->id);

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);

            $user->update(['avatar' => null]);
        }

        return back()->with('success', 'Avatar removido!');
    }
}
