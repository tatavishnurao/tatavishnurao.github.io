"""Local preservation and legacy-route checks, complementary to the supplied validator."""
from pathlib import Path
import hashlib
import unittest
from prepare_legacy_redirects import ROUTES, redirect

ROOT = Path(__file__).resolve().parents[1]


class MigrationTests(unittest.TestCase):
    def test_resume_preserved(self):
        self.assertEqual((ROOT / 'assets/resume.pdf').read_bytes(),
                         (ROOT / 'site/assets/resume.pdf').read_bytes())

    def test_retained_resources_preserved(self):
        for directory in ['assets', 'content', 'images']:
            for source in (ROOT / directory).rglob('*'):
                if source.is_file():
                    target = ROOT / 'site' / source.relative_to(ROOT)
                    self.assertTrue(target.is_file(), str(target))
                    # Blog images are owned by the supplied current Site.
                    if 'blogs' not in source.parts:
                        self.assertEqual(source.read_bytes(), target.read_bytes(), str(target))

    def test_recovered_note(self):
        note = ROOT / 'site/content/notes/real-time-log-mel-rust.md'
        self.assertEqual(hashlib.sha256(note.read_bytes()).hexdigest(),
                         '2cb0afbaebd76497f05bcb2e193175d8de44753281198438db031c02188f981a')

    def test_legacy_routes(self):
        for route, target in ROUTES.items():
            for name in [route + '/index.html', route + '.html']:
                self.assertEqual((ROOT / 'site' / name).read_text(), redirect(target))

    def test_only_canonical_artifact_published(self):
        workflows = list((ROOT / '.github/workflows').glob('*'))
        publishers = [p for p in workflows if 'actions/upload-pages-artifact@' in p.read_text()]
        self.assertEqual(len(publishers), 1)
        self.assertIn('path: site\n', publishers[0].read_text())


if __name__ == '__main__':
    unittest.main()
