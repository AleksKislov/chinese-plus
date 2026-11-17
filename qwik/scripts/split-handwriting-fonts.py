#!/usr/bin/env python3
"""Splits the handwriting model fonts (/admin/handwriting/) into small woff2 slices.

A whole Chinese font is 2-3 MB. Split by character, as Google Fonts serves CJK fonts: the
browser downloads only the slices with the characters on screen (unicode-range), a few hundred
KB for an HSK level. Common characters come first, in small slices: Jun Da's top 1000 by
frequency, then the rest of GB2312 level 1 (3755 common characters), level 2, everything else.

In:  qwik/public/fonts/handwriting/<font id>.woff2 (or .ttf / .otf), the id of fonts.ts
Out: qwik/public/fonts/handwriting/<font id>/font.css and <n>-<hash>.woff2 slices
     (names change with the content, so the server can cache them forever)

The fonts are not in git (commercial): run this where the files are, then copy the output
folders to the server's checkout before building the FE image.

    pip install fonttools brotli
    python3 qwik/scripts/split-handwriting-fonts.py            # every font
    python3 qwik/scripts/split-handwriting-fonts.py aini-wenrou  # one font
"""
import hashlib
import io
import shutil
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

QWIK = Path(__file__).resolve().parent.parent
FONTS = QWIK / "public" / "fonts" / "handwriting"
FREQ = QWIK.parent / "server" / "scripts" / "data" / "junda-char-freq.tsv"

# (how many characters of the order, slice size): small slices for common characters
PLAN = [(1000, 100), (2755, 200), (3008, 500), (None, 1000)]


def char_order():
    """Codepoints from most to least common: Jun Da top 1000, GB2312 level 1, level 2."""
    order, seen = [], set()

    def add(ch):
        cp = ord(ch)
        if cp not in seen:
            seen.add(cp)
            order.append(cp)

    for line in FREQ.read_text(encoding="utf-8").splitlines():
        if line and not line.startswith("#"):
            add(line.split("\t")[1])
    for first in range(0xB0, 0xF8):  # GB2312 rows: 0xB0-0xD7 level 1, 0xD8-0xF7 level 2
        for second in range(0xA1, 0xFF):
            try:
                add(bytes([first, second]).decode("gb2312"))
            except UnicodeDecodeError:
                pass
    return order


def slices_for(cmap, order):
    """The font's codepoints in slices: by the order, then the rest by codepoint."""
    known = [cp for cp in order if cp in cmap]
    rest = sorted(set(cmap) - set(known))
    cps = known + rest
    out, pos = [], 0
    for count, size in PLAN:
        end = len(cps) if count is None else min(len(cps), pos + count)
        while pos < end:
            out.append(cps[pos : min(pos + size, end)])
            pos += size
        pos = end
    return [s for s in out if s]


def unicode_range(cps):
    """U+4E00-4E05,U+4E07 from codepoints."""
    cps = sorted(cps)
    parts, start = [], cps[0]
    for prev, cp in zip(cps, cps[1:] + [None]):
        if cp != prev + 1:
            parts.append(f"U+{start:X}" if start == prev else f"U+{start:X}-{prev:X}")
            start = cp
    return ",".join(parts)


def split_font(src, order):
    font_id = src.stem
    out_dir = FONTS / font_id
    # decompress once, every slice is cut from these bytes
    buf = io.BytesIO()
    whole = TTFont(src)
    whole.flavor = None
    whole.save(buf)
    ttf = buf.getvalue()
    cmap = whole.getBestCmap()

    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True)

    options = subset.Options()
    options.flavor = "woff2"
    options.hinting = False
    options.layout_features = ["*"]
    options.notdef_outline = False
    options.name_IDs = [1, 2]  # family and style only

    css, total = [], 0
    for n, cps in enumerate(slices_for(cmap, order)):
        font = TTFont(io.BytesIO(ttf))
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=cps)
        subsetter.subset(font)
        out = io.BytesIO()
        subset.save_font(font, out, options)
        data = out.getvalue()
        name = f"{n}-{hashlib.sha1(data).hexdigest()[:8]}.woff2"
        (out_dir / name).write_bytes(data)
        total += len(data)
        css.append(
            f"@font-face{{font-family:'hw-{font_id}';src:url('{name}') format('woff2');"
            f"font-display:swap;unicode-range:{unicode_range(cps)}}}"
        )
    (out_dir / "font.css").write_text("\n".join(css) + "\n", encoding="utf-8")
    print(f"{font_id}: {len(cmap)} chars -> {len(css)} slices, {total // 1024} KB")


def main():
    wanted = set(sys.argv[1:])
    sources = [
        p
        for p in sorted(FONTS.iterdir())
        if p.is_file() and p.suffix.lower() in (".woff2", ".ttf", ".otf")
        and (not wanted or p.stem in wanted)
    ]
    if not sources:
        sys.exit(f"no fonts in {FONTS}")
    order = char_order()
    for src in sources:
        split_font(src, order)


if __name__ == "__main__":
    main()
