#!/usr/bin/env bash
set -euo pipefail

CHANGE="ship-real-rust-learning-runtime"

echo "== OpenSpec list =="
openspec list --json

echo "\n== OpenSpec status ($CHANGE) =="
openspec status --change "$CHANGE" --json

echo "\n== Apply instructions ($CHANGE) =="
openspec instructions apply --change "$CHANGE" --json

echo "\n== Baseline tests =="
npm test
npm run test:fixtures

echo "\nReady to run: /opsx:apply $CHANGE"
