"""Generate web-sized brand assets from the master PNGs in ../brand/logos.

Requires Pillow. Optional: fonttools + brotli (pip install fonttools brotli) to decompress the
self-hosted Inter Tight woff2 into a TTF for the OG headline; without them the OG image is logo-only.
Run from web/: python3 scripts/generate-assets.py
Outputs to public/: logo-light.png, logo-dark.png, favicon.png,
apple-touch-icon.png, og-image.png (1200x630, branded on Base Oscura).
"""
import tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
LOGOS = ROOT.parent / "brand" / "logos"
OUT = ROOT / "public"
INK = (14, 0, 51, 255)


def trim(img: Image.Image, pad: int = 0) -> Image.Image:
    box = img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    cropped = img.crop(box)
    if pad:
        canvas = Image.new("RGBA", (cropped.width + 2 * pad, cropped.height + 2 * pad), (0, 0, 0, 0))
        canvas.paste(cropped, (pad, pad))
        return canvas
    return cropped


def resize_w(img: Image.Image, w: int) -> Image.Image:
    return img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)


light = trim(Image.open(LOGOS / "logotipo-light-bg.png").convert("RGBA"))
dark = trim(Image.open(LOGOS / "logotipo-dark-bg.png").convert("RGBA"))
iso = trim(Image.open(LOGOS / "isotipo-light-bg.png").convert("RGBA"))

resize_w(light, 600).save(OUT / "logo-light.png", optimize=True)
resize_w(dark, 600).save(OUT / "logo-dark.png", optimize=True)


def square(img: Image.Image, size: int, pad_ratio: float = 0.12, bg=(0, 0, 0, 0)) -> Image.Image:
    inner = int(size * (1 - 2 * pad_ratio))
    scale = inner / max(img.size)
    r = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), bg)
    canvas.paste(r, ((size - r.width) // 2, (size - r.height) // 2), r)
    return canvas


square(iso, 64).save(OUT / "favicon.png", optimize=True)
square(iso, 180, 0.2, (255, 255, 255, 255)).save(OUT / "apple-touch-icon.png", optimize=True)

# --- OG image (1200x630): Base Oscura to Azul Sistema, isotipo watermark, imagotipo, headline.
W, H = 1200, 630
NAVY = (3, 0, 91)
HEADLINE = "Software a la medida para operaciones que no pueden detenerse."
FONT_WOFF2 = ROOT / "node_modules/@fontsource/inter-tight/files/inter-tight-latin-400-normal.woff2"


def gradient(w: int, h: int, top_left, bottom_right) -> Image.Image:
    """Diagonal gradient, close to the brand's 160deg Base Oscura -> Azul Sistema."""
    base = Image.new("RGB", (w, h))
    px = base.load()
    for y in range(h):
        for x in range(w):
            t = (0.35 * x / w + 0.65 * y / h)
            px[x, y] = tuple(round(a + (b - a) * t) for a, b in zip(top_left, bottom_right))
    return base


def load_headline_font(size: int):
    try:
        from fontTools.ttLib import TTFont

        font = TTFont(str(FONT_WOFF2))
        font.flavor = None
        tmp = Path(tempfile.mkdtemp()) / "InterTight-Regular.ttf"
        font.save(str(tmp))
        return ImageFont.truetype(str(tmp), size)
    except Exception as exc:  # fontTools/brotli missing or font unreadable
        print(f"warning: no headline font ({exc}); OG image will be logo-only")
        return None


def wrap(draw: ImageDraw.ImageDraw, text: str, font, max_w: int) -> list[str]:
    lines, cur = [], ""
    for word in text.split():
        trial = f"{cur} {word}".strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    lines.append(cur)
    return lines


og = gradient(W, H, INK[:3], NAVY).convert("RGBA")

# Isotipo watermark, cropped at the bottom-right corner, low opacity.
iso_dark = trim(Image.open(LOGOS / "isotipo-dark-bg.png").convert("RGBA"))
mark = resize_w(iso_dark, 760)
mark.putalpha(mark.getchannel("A").point(lambda a: round(a * 0.16)))
og.alpha_composite(mark, (W - 470, H - 400))

# Imagotipo for dark backgrounds, top-left.
logo = resize_w(dark, 300)
og.alpha_composite(logo, (72, 64))

font = load_headline_font(66)
if font is not None:
    d = ImageDraw.Draw(og)
    lines = wrap(d, HEADLINE, font, 820)
    line_h = 76
    y = H - 72 - line_h * len(lines)
    for line in lines:
        d.text((72, y), line, font=font, fill=(255, 255, 255, 255))
        y += line_h
else:
    logo = resize_w(dark, 720)
    og = Image.new("RGBA", (W, H), INK)
    og.alpha_composite(logo, ((W - logo.width) // 2, (H - logo.height) // 2))

og.convert("RGB").save(OUT / "og-image.png", optimize=True)
print("ok")
