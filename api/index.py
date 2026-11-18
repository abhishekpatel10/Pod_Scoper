import sys
import os

# Add the backend directory to sys.path so modules like schemas, engine, prompts are discoverable
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app  # noqa: E402
