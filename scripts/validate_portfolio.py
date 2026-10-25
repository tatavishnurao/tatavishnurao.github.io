"""Validate the migrated static portfolio without installing dependencies."""
import argparse
import base64
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree
from portfolio_release import build


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = {}
        self.local = []
        self.inline = []
        self.script = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a' and attrs.get('id', '').startswith('nav-'):
            self.links[attrs['id']] = attrs.get('href')
        if tag == 'script' and not attrs.get('src'):
            self.script = ''
        for name in ('src', 'poster'):
            value = attrs.get(name, '')
            if value and not urlsplit(value).scheme and not value.startswith('//'):
                self.local.append(value)

    def handle_data(self, data):
        if self.script is not None:
            self.script += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            self.inline.append(self.script)
            self.script = None


def validate(root):
    root = root.resolve()
    text = (root / 'index.html').read_text(encoding='utf-8')
    page = Page()
    page.feed(text)
    assert len(page.ids) == len(set(page.ids)), 'Duplicate HTML IDs'
    match = re.search(r'const PROJECTS=(.*?);\n', text)
    assert match, 'Expected portfolio project data was not found'
    projects = json.loads(match.group(1))
    assert [p['id'] for p in projects] == ['tailbench', 'ctxd', 'dubpatch', 'signalflow', 'glyph', 'latent'], 'Project order changed'
    assert not re.search(r'sochdb|locomo|realkv', text, re.I), 'Retired project reference in homepage'
    expected = {'nav-portfolio': '#about', 'nav-projects': '#projects', 'nav-blogs': '#blogs', 'nav-socials': '#contact', 'nav-github': 'https://github.com/tatavishnurao', 'nav-resume': 'https://tatavishnurao.github.io/assets/resume.pdf'}
    assert page.links == expected, 'Header destination changed'
    for value in page.local:
        path = root / unquote(urlsplit(value).path.lstrip('/'))
        assert path.resolve().is_relative_to(root), f'Asset escapes site: {value}'
        assert path.is_file(), f'Missing local asset: {value}'
    # Blog assets are stored in the embedded article data rather than static markup.
    for value in set(re.findall(r'assets/blogs/[A-Za-z0-9_.-]+', text)):
        assert (root / value).is_file(), f'Missing blog asset: {value}'
    for p in projects:
        assert p['repo'] and p['lead'] and p['body'], f'Incomplete project: {p["id"]}'
        for link in p['links']:
            if not urlsplit(link['href']).scheme:
                resource = (root / unquote(urlsplit(link['href']).path)).resolve()
                assert resource.is_relative_to(root) and resource.is_file(), f'Missing project resource: {resource}'
        diagram = p.get('diagram')
        if diagram:
            assert 70 <= len(p['body'].split()) <= 110, f'Story length: {p["id"]}'
            assert len(p['lead']) < 90, f'Pitch too long: {p["id"]}'
            assert diagram['alt'].strip(), f'Missing diagram alt: {p["id"]}'
            path = (root / diagram['src']).resolve()
            assert path.is_relative_to(root) and path.is_file(), f'Missing local diagram: {path}'
            if path.suffix.lower() == '.png':
                data = path.read_bytes()
                assert data[:16] == b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR', f'Invalid PNG header: {path}'
                dimensions = [int.from_bytes(data[i:i + 4], 'big') for i in (16, 20)]
                assert dimensions == [diagram['width'], diagram['height']], f'Diagram dimensions: {path}'
                assert all(n > 0 for n in dimensions), f'Empty PNG: {path}'
            else:
                assert path.suffix.lower() == '.svg', f'Unsupported diagram format: {path}'
                svg = ElementTree.parse(path).getroot()
                assert svg.tag == '{http://www.w3.org/2000/svg}svg', f'Not an SVG: {path}'
                assert [float(n) for n in svg.attrib['viewBox'].split()] == [0, 0, diagram['width'], diagram['height']], f'Diagram aspect ratio: {path}'
        else:
            assert p['scope'], f'Missing project scope: {p["id"]}'
            assert base64.b64decode(p['image'].split(',', 1)[1], validate=True).lstrip().startswith(b'<svg'), 'Invalid project diagram'
    js = (root / 'assets/timely.js').read_text(encoding='utf-8')
    assert 'setTimeout(()=>close(dialog.contains(document.activeElement)),1750)' in js, 'Dialogue timeout changed'
    effects = re.search(r'const manifestations=(.*?);', js).group(1)
    assert len(re.findall(r"'[^']+'", effects)) == 6, 'Expected six manifestations'
    assert "name!==lastManifestation" in js, 'Consecutive-repeat guard missing'
    assert "const reading=()=>document.documentElement.dataset.layout==='blog'" in js
    assert "const motion=()=>effectiveMotion()&&!document.hidden&&!reading()&&!guide.docked" in js
    assert 'materialCompact?1.5:2' in js, 'Mobile rendering budget missing'
    assert 'miss minutes' in text.lower()
    resume = root / 'assets/resume.pdf'
    assert resume.is_file() and resume.read_bytes().startswith(b'%PDF-'), 'Preserve the existing assets/resume.pdf before deployment'
    node = shutil.which('node')
    assert node, 'Install Node.js for JavaScript syntax validation'
    with tempfile.TemporaryDirectory() as temp:
        for i, code in enumerate(page.inline):
            path = Path(temp) / f'inline-{i}.js'
            path.write_text(code, encoding='utf-8')
            subprocess.run([node, '--check', str(path)], check=True)
    subprocess.run([node, '--check', str(root / 'assets/timely.js')], check=True)
    release = json.loads((root / 'release.json').read_text(encoding='utf-8'))
    assert release == build(root), 'Release manifest is stale; run portfolio_release.py'
    print(f'PASS: {len(projects)} projects, six header destinations/effects, local assets, résumé, JS syntax and release {release["release_id"]}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--site', type=Path, default=Path('site'))
    args = parser.parse_args()
    try:
        validate(args.site)
    except (AssertionError, OSError, ValueError, subprocess.CalledProcessError) as error:
        raise SystemExit(f'FAIL: {error}') from error
