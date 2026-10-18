"""Compare two materialized published directories, without credentials or network access."""
import argparse
import json
from pathlib import Path
from portfolio_release import build

parser = argparse.ArgumentParser()
parser.add_argument('first', type=Path)
parser.add_argument('second', type=Path)
args = parser.parse_args()
try:
    releases = []
    for directory in (args.first, args.second):
        release = json.loads((directory / 'release.json').read_text(encoding='utf-8'))
        assert release == build(directory), f'Manifest does not match actual files in {directory}'
        releases.append(release)
    a, b = releases
    if a != b:
        changed = sorted(k for k in set(a['files']) | set(b['files']) if a['files'].get(k) != b['files'].get(k))
        raise SystemExit('DIFFERENT: ' + ', '.join(changed))
    print('MATCH: ' + a['release_id'])
except (OSError, ValueError, AssertionError) as error:
    raise SystemExit(f'FAIL: {error}') from error
