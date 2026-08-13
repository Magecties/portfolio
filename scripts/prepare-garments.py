from PIL import Image, ImageFilter
import sys
import pathlib

SRC = pathlib.Path(sys.argv[1])
OUT = pathlib.Path("public/garments")
OUT.mkdir(parents=True, exist_ok=True)

first = None
for f in sorted(SRC.glob("*.png")):
    im = Image.open(f).convert("RGBA")
    im = im.crop(im.getbbox())
    im.thumbnail((660, 660), Image.LANCZOS)
    im.save(OUT / (f.stem + ".webp"), "WEBP", quality=80, method=6)
    print(f.stem, im.size)
    if first is None:
        first = im

a = first.getchannel("A")
w, h = a.size
squashed = a.resize((w, int(h * 0.16)), Image.LANCZOS)
canvas = Image.new("L", (int(w * 1.45), int(h * 0.42)), 0)
canvas.paste(
    squashed,
    (
        (canvas.width - squashed.width) // 2,
        (canvas.height - squashed.height) // 2,
    ),
)
canvas = canvas.filter(ImageFilter.GaussianBlur(21)).point(lambda v: int(v * 0.42))
shadow = Image.new("RGBA", canvas.size, (22, 24, 28, 255))
shadow.putalpha(canvas)
shadow.save(OUT / "shadow.webp", "WEBP", quality=68, method=6)
