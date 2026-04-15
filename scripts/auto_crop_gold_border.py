#!/usr/bin/env python3
import argparse
import json
from pathlib import Path
from PIL import Image


def is_gold(rgb):
    r, g, b = rgb[:3]
    return (
        r > 90
        and g > 70
        and b < 190
        and r >= g >= b
        and (r - b) > 12
    )


def edge_profile(img, axis, search_limit):
    w, h = img.size
    pix = img.load()
    limit = min(search_limit, w if axis == "x" else h)
    values = []

    if axis == "x":
        for x in range(limit):
            ratio = sum(1 for y in range(h) if is_gold(pix[x, y])) / h
            values.append(ratio)
    else:
        for y in range(limit):
            ratio = sum(1 for x in range(w) if is_gold(pix[x, y])) / w
            values.append(ratio)

    return values


def reverse_edge_profile(img, axis, search_limit):
    w, h = img.size
    pix = img.load()
    limit = min(search_limit, w if axis == "x" else h)
    values = []

    if axis == "x":
        for offset in range(limit):
            x = w - 1 - offset
            ratio = sum(1 for y in range(h) if is_gold(pix[x, y])) / h
            values.append(ratio)
    else:
        for offset in range(limit):
            y = h - 1 - offset
            ratio = sum(1 for x in range(w) if is_gold(pix[x, y])) / w
            values.append(ratio)

    return values


def first_stable_edge(profile, min_ratio, min_run, smooth_window):
    for i in range(len(profile) - smooth_window - min_run + 1):
        smoothed = []
        for j in range(min_run):
            window = profile[i + j : i + j + smooth_window]
            smoothed.append(sum(window) / len(window))
        if all(v >= min_ratio for v in smoothed):
            return i
    return None


def crop_box(img, search_limit, min_ratio, min_run, smooth_window, outer_pad):
    w, h = img.size

    left_profile = edge_profile(img, "x", search_limit)
    top_profile = edge_profile(img, "y", search_limit)
    right_profile = reverse_edge_profile(img, "x", search_limit)
    bottom_profile = reverse_edge_profile(img, "y", search_limit)

    left = first_stable_edge(left_profile, min_ratio, min_run, smooth_window)
    top = first_stable_edge(top_profile, min_ratio, min_run, smooth_window)
    right_offset = first_stable_edge(right_profile, min_ratio, min_run, smooth_window)
    bottom_offset = first_stable_edge(bottom_profile, min_ratio, min_run, smooth_window)

    if None in (left, top, right_offset, bottom_offset):
      raise RuntimeError("Could not detect stable gold border on all sides")

    right = w - right_offset
    bottom = h - bottom_offset

    left = max(0, left - outer_pad)
    top = max(0, top - outer_pad)
    right = min(w, right + outer_pad)
    bottom = min(h, bottom + outer_pad)

    if right <= left or bottom <= top:
        raise RuntimeError("Computed invalid crop box")

    return left, top, right, bottom


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("inputs", nargs="+")
    parser.add_argument("--output-root", required=True)
    parser.add_argument("--source-root", required=True)
    parser.add_argument("--search-limit", type=int, default=220)
    parser.add_argument("--min-ratio", type=float, default=0.04)
    parser.add_argument("--min-run", type=int, default=2)
    parser.add_argument("--smooth-window", type=int, default=2)
    parser.add_argument("--outer-pad", type=int, default=2)
    parser.add_argument("--summary")
    args = parser.parse_args()

    source_root = Path(args.source_root).resolve()
    output_root = Path(args.output_root).resolve()
    output_root.mkdir(parents=True, exist_ok=True)

    results = []

    for raw in args.inputs:
        src = Path(raw).resolve()
        rel = src.relative_to(source_root)
        dst = output_root / rel
        dst.parent.mkdir(parents=True, exist_ok=True)

        try:
            img = Image.open(src).convert("RGBA")
            box = crop_box(
                img,
                args.search_limit,
                args.min_ratio,
                args.min_run,
                args.smooth_window,
                args.outer_pad,
            )
            cropped = img.crop(box)
            cropped.save(dst)
            results.append({
                "source": str(src),
                "output": str(dst),
                "status": "cropped",
                "box": box,
                "size": cropped.size,
            })
        except Exception as error:
            results.append({
                "source": str(src),
                "output": str(dst),
                "status": "failed",
                "error": str(error),
            })

    if args.summary:
        Path(args.summary).write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    else:
        print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
