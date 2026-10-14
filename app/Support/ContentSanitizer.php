<?php

namespace App\Support;

/**
 * Sanitasi HTML konten berita (pengganti ringan HTMLPurifier).
 *
 * Tujuan: kiriman `<script>alert(1)</script>` / event-handler (`onclick=...`)
 * / `javascript:` URI tersimpan & ter-render jinak, tapi format wajar
 * (p, strong, ul, a, img, ...) tetap hidup.
 *
 * Dipakai saat SIMPAN (store/update/approve) dan saat BACA (output API &
 * Inertia) agar baris lama yang sudah kotor ikut jinak saat dirender
 * via `dangerouslySetInnerHTML` di Frontend/Berita/Show.tsx.
 */
class ContentSanitizer
{
    /** Tag yang selalu dibuang beserta isinya. */
    private const DANGEROUS_TAGS = [
        'script', 'style', 'iframe', 'object', 'embed',
        'base', 'link', 'meta', 'form',
    ];

    public static function clean(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        // 1) Regex cepat: buang blok berbahaya sebelum parsing DOM.
        $html = (string) preg_replace(
            '#<(script|style|iframe|object|embed|form|base)[^>]*?>.*?</\\1\s*>#is',
            '',
            $html
        );
        $html = (string) preg_replace(
            '#<(script|style|iframe|object|embed|base|link|meta)[^>]*?/?>#i',
            '',
            $html
        );

        // 2) DOM pass: hapus atribut on* + URI berbahaya.
        $prev = libxml_use_internal_errors(true);
        try {
            $doc = new \DOMDocument('1.0', 'UTF-8');
            // Bungkus agar fragment selalu punya root.
            $doc->loadHTML(
                '<div>' . mb_encode_numericentity($html, [0x80, 0x10FFFF, 0, ~0], 'UTF-8') . '</div>',
                LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
            );

            // Hapus tag berbahaya yang lolos regex (case aneh / namespace).
            foreach (self::DANGEROUS_TAGS as $tag) {
                $nodes = $doc->getElementsByTagName($tag);
                for ($i = $nodes->length - 1; $i >= 0; $i--) {
                    $node = $nodes->item($i);
                    $node?->parentNode?->removeChild($node);
                }
            }

            /** @var \DOMElement $el */
            foreach ($doc->getElementsByTagName('*') as $el) {
                // Hapus event-handler: onclick, onerror, onload, ...
                $remove = [];
                foreach ($el->attributes ?? [] as $attr) {
                    $name = strtolower($attr->nodeName);
                    if (str_starts_with($name, 'on')) {
                        $remove[] = $attr->nodeName;
                    }
                }
                foreach ($remove as $name) {
                    $el->removeAttribute($name);
                }

                // Jinakkan URI javascript:/vbscript:/data:text/html.
                foreach (['href', 'src', 'action', 'formaction', 'xlink:href'] as $attrName) {
                    if (! $el->hasAttribute($attrName)) {
                        continue;
                    }
                    $val = trim($el->getAttribute($attrName));
                    $lower = strtolower(preg_replace('/\s+/', '', $val) ?? '');
                    if (
                        str_starts_with($lower, 'javascript:')
                        || str_starts_with($lower, 'vbscript:')
                        || str_starts_with($lower, 'data:text/html')
                    ) {
                        if ($el->tagName === 'a') {
                            $el->setAttribute($attrName, '#');
                        } else {
                            $el->removeAttribute($attrName);
                        }
                    }
                }
            }

            $out = $doc->saveHTML();
            if ($out === false) {
                return strip_tags($html);
            }

            // Lepas <div> pembungkus.
            if (str_starts_with(ltrim($out), '<div>')) {
                $out = (string) preg_replace('#^\\s*<div>(.*)</div>\\s*$#s', '$1', $out);
            }

            return trim($out);
        } catch (\Throwable) {
            return trim((string) strip_tags($html));
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($prev);
        }
    }
}
