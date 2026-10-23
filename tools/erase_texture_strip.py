"""Erase the map's flat photo of Taksin bridge from the river, under Harbor Bridge.

The TerraMesh aerial texture shows the real bridge lying flat on the water; our 3D bridge stands over it.
Original texture: git history (commit 4df1bc6) or assets-original/ (git-ignored local copy).
Usage (24 Oct 2026 run):
  python -P -E tools/erase_texture_strip.py assets-original/Map1_baseColor.jpeg       public/models/city/bangkok-full/textures/Map1_baseColor.jpeg preview.png erase -1.3 0.97 -0.42 0.4
Arguments after the mode are the bridge-local box (x along the deck, z across) to inpaint.
U/V map world x/z to texture uv; measured from the Map mesh (uv vs world position, exact fit).
"""
import sys, math, numpy as np, cv2
from PIL import Image
src, out, preview, mode = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
im = np.asarray(Image.open(src).convert('RGB')).copy()
H, W = im.shape[:2]
U = (0.0071954655280959505, 0.9123329894158911); V = (-0.01308266507063522, -0.20104302927966966)
F = (-38.19, -19.57); yaw = math.radians(-13.3)
def px(lx, lz):
    x = F[0] + lx * math.cos(yaw) + lz * math.sin(yaw); z = F[1] - lx * math.sin(yaw) + lz * math.cos(yaw)
    return ((U[0] * x + U[1]) * W, (V[0] * z + V[1]) * H)
# the photo bridge over the water: west bank to east bank along the deck, deck width plus its shadow
x0, x1, z0, z1 = float(sys.argv[5]), float(sys.argv[6]), float(sys.argv[7]), float(sys.argv[8])
poly = np.array([px(x0, z0), px(x1, z0), px(x1, z1), px(x0, z1)], np.int32)
mask = np.zeros((H, W), np.uint8); cv2.fillPoly(mask, [poly], 255)
bx, by, bw, bh = cv2.boundingRect(poly); pad = 120
cx0, cy0, cx1, cy1 = max(bx - pad, 0), max(by - pad, 0), min(bx + bw + pad, W), min(by + bh + pad, H)
if mode == 'erase':
    crop = im[cy0:cy1, cx0:cx1]; m = mask[cy0:cy1, cx0:cx1]
    fixed = cv2.inpaint(np.ascontiguousarray(crop[..., ::-1]), m, 9, cv2.INPAINT_TELEA)[..., ::-1]
    # soften: blur only inside the mask so the patch has the water's smoothness
    blur = cv2.GaussianBlur(fixed, (0, 0), 3)
    mm = (cv2.GaussianBlur(m, (0, 0), 2) / 255.0)[..., None]
    im[cy0:cy1, cx0:cx1] = (blur * mm + crop * (1 - mm)).astype(np.uint8)
    Image.fromarray(im).save(out, quality=92)
vis = im[cy0:cy1, cx0:cx1].copy()
if mode != 'erase': cv2.polylines(vis, [poly - [cx0, cy0]], True, (255, 0, 0), 2)
Image.fromarray(vis).save(preview)
print('bbox', cx0, cy0, cx1, cy1, 'poly', poly.tolist())
