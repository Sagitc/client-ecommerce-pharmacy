<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;
use LaravelLegends\PtBrValidator\Rules\Cpf;

class CpfOrEmailRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        
        $isEmail = Validator::make([$attribute => $value], [
            $attribute => 'email',
        ])->passes();

        $isCpf = Validator::make([$attribute => $value], [
            $attribute => [new Cpf],
        ])->passes();

        if (!$isEmail && !$isCpf) {
            $fail('O campo :attribute deve ser um CPF ou um e-mail válido.');
        }
    }
}
