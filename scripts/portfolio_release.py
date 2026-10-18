"""Create a deterministic content identity; standard library only."""
import argparse
import hashlib
import json
from pathlib import Path


def inventory(root):
    result = {}
    for path in sorted(root.rglob('*')):
        if path.is_symlink():
            raise ValueError(f'Symlinks are not allowed: {path}')
        if path.is_file() and path.relative_to(root).as_posix() != 'release.json':
            result[path.relative_to(root).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result


def build(root):
    files = inventory(root)
    content_id = hashlib.sha256(json.dumps(files, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    return {'schema': 1, 'release_id': content_id, 'files': files}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--site', type=Path, default=Path('site'))
    args = parser.parse_args()
    if not (args.site / 'index.html').is_file():
        parser.error('The site directory must contain index.html')
    release = build(args.site)
    (args.site / 'release.json').write_text(json.dumps(release, indent=2) + '\n', encoding='utf-8')
    print(release['release_id'])
