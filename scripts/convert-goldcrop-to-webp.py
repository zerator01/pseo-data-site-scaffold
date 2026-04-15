#!/usr/bin/env python3
import argparse
import json
from pathlib import Path
from PIL import Image


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-root", required=True)
    parser.add_argument("--output-root", required=True)
    parser.add_argument("--quality", type=int, default=92)
    parser.add_argument("--summary", required=True)
    args = parser.parse_args()

    source_root = Path(args.source_root).resolve()
    output_root = Path(args.output_root).resolve()
    output_root.mkdir(parents=True, exist_ok=True)

    results = []

    for src in sorted(source_root.rglob("*.png")):
      rel = src.relative_to(source_root)
      dst = output_root / rel.with_suffix(".webp")
      dst.parent.mkdir(parents=True, exist_ok=True)

      with Image.open(src) as img:
        img.save(dst, "WEBP", quality=args.quality, method=6)

      results.append({
        "source": str(src),
        "output": str(dst),
        "source_size": src.stat().st_size,
        "output_size": dst.stat().st_size,
      })

    Path(args.summary).write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
