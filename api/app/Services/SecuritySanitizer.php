<?php

namespace App\Services;

class SecuritySanitizer
{
    /**
     * Remove tags <script> e seu conteúdo, além de quaisquer outras tags HTML.
     */
    public static function clean(?string $input): ?string
    {
        if ($input === null) {
            return null;
        }

        // Remove blocos <script>...</script> e <style>...</style> inteiros com seu conteúdo
        $clean = preg_replace('/<(script|style)\b[^>]*>(.*?)<\/\1>/is', '', $input);

        // Remove quaisquer outras tags HTML remanescentes
        $clean = strip_tags($clean);

        // Remove caracteres de controle invisíveis
        $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $clean);

        return trim($clean);
    }
}
