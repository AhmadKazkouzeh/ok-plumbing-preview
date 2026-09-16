"""Trace the official Gas Safe Register logo raster into a two-colour SVG.

Source: https://sa-chat-assets.s3.eu-west-2.amazonaws.com/prod/capitaccm/gassafe/gassafe-logo.png
(served by Gas Safe Register's own asset host, 1086x1219 JPEG on white).

Two masks are traced separately:
  * silhouette = every non-white pixel  -> the yellow triangle, filled solid
  * ink        = every dark pixel       -> keyline, "GAS safe", "REGISTER"

The silhouette is drawn first and the ink on top, so there is no hairline seam
between the yellow fill and the black keyline.
"""

import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path("gassafe-logo.png")
UPSCALE = 2

im = Image.open(SRC).convert("RGB")
im = im.resize((im.width * UPSCALE, im.height * UPSCALE), Image.LANCZOS)
a = np.asarray(im).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]

lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

ink = lum < 110                       # black keyline + lettering
white = (r > 235) & (g > 235) & (b > 225)
silhouette = ~white                   # triangle incl. the ink sitting on it

masks = {"silhouette": silhouette, "ink": ink}
paths = {}

for name, mask in masks.items():
    # potrace PBM: 1 = black = traced
    pbm = Path(f"{name}.pbm")
    h, w = mask.shape
    packed = np.packbits(mask.astype(np.uint8), axis=1)
    with pbm.open("wb") as fh:
        fh.write(f"P4\n{w} {h}\n".encode())
        fh.write(packed.tobytes())

    svg = Path(f"{name}.svg")
    subprocess.run(
        ["potrace", str(pbm), "-s", "-o", str(svg),
         "--turdsize", "4", "--alphamax", "1.0", "--opttolerance", "0.45",
         "--flat"],
        check=True,
    )
    text = svg.read_text()
    d_start = text.index('<path d="') + len('<path d="')
    d_end = text.index('"', d_start)
    paths[name] = text[d_start:d_end]
    # potrace emits a y-flip transform on a group; capture it once
    if name == "silhouette":
        t_start = text.index('transform="') + len('transform="')
        paths["transform"] = text[t_start:text.index('"', t_start)]

W, H = im.width, im.height
out = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Gas Safe Register">
<g transform="{paths['transform']}" fill-rule="evenodd">
<path fill="#FFED00" d="{paths['silhouette']}"/>
<path fill="#000000" d="{paths['ink']}"/>
</g>
</svg>
"""
Path("gas-safe-raw.svg").write_text(out)
print("wrote gas-safe-raw.svg", len(out), "bytes; viewBox", W, H)
