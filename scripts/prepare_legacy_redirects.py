"""Regenerate reviewed legacy entrypoints; no retired project descriptions."""
from pathlib import Path
from html import escape

ROUTES = {
    'projects': '/#projects',
    'research': '/#research',
    'writing': '/#blogs',
    'resume': '/assets/resume.pdf',
    'projects/RealKV-Serve': '/#projects',
    'projects/realkv-serve': '/#projects',
    'projects/realkv': '/#projects',
    'projects/SochDB': '/#projects',
    'projects/sochdb': '/#projects',
}


def redirect(target):
    url = escape(target, quote=True)
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portfolio — moved</title>
<link rel="canonical" href="https://tatavishnurao.github.io{url}">
<meta http-equiv="refresh" content="0; url={url}">
</head><body><p>This page moved. <a href="{url}">Continue to the portfolio</a>.</p></body></html>
'''


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1] / 'site'
    for route, target in ROUTES.items():
        path = root / route / 'index.html'
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(redirect(target), encoding='utf-8')
        # Explicit .html aliases cover old bookmarked file-style entrypoints.
        (root / (route + '.html')).write_text(redirect(target), encoding='utf-8')
