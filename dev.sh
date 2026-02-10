#!/bin/bash
set -euo pipefail

# Development server script for local development.
# Ensures local URLs and a stable localhost port.

PORT=1313
HOST="127.0.0.1"
BASE_URL="http://localhost:${PORT}/"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

if command -v lsof >/dev/null 2>&1; then
  existing_pid="$(lsof -ti "tcp:${PORT}" -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"
  if [[ -n "${existing_pid}" ]]; then
    existing_cmd="$(ps -p "${existing_pid}" -o command= 2>/dev/null || true)"
    if [[ "${existing_cmd}" == *hugo* ]]; then
      echo "♻️  Found existing Hugo server on :${PORT} (PID ${existing_pid}). Restarting it..."
      kill "${existing_pid}" || true
      sleep 1
    else
      echo "❌ Port ${PORT} is already in use by another process:"
      echo "   ${existing_cmd}"
      echo "   Stop that process first, then run ./dev.sh again."
      exit 1
    fi
  fi
fi

echo "🚀 Starting Hugo development server..."
echo "📍 Server will be available at ${BASE_URL}"
echo "🔗 All links will use localhost URLs for proper local development"
echo ""

exec hugo server \
  --buildDrafts \
  --buildFuture \
  --baseURL="${BASE_URL}" \
  --bind="${HOST}" \
  --port="${PORT}"
