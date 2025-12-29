# BLT (Beat Link Trigger) expressions

This folder contains the Clojure expressions used in Beat Link Trigger (BLT) to send JSON payloads to this project.

## Target URL

Configure BLT to POST to:

```text
http://127.0.0.1:5001/api/receive_data
```

If you run the API on a different port, update the URL accordingly.

## Files

- `shared_functions.clj`: HTTP helper to POST JSON.
- `global_setup_expression.clj`: Optional shared setup (server URL).
- `beat_expression.clj`: Example payload for track/beat updates.
- `phrase_beat_expression.clj`: Example payload for phrase/section updates.

## Notes

- Do **not** rename BLT keys (e.g. `beat-number` stays `beat-number`).
- Unknown fields are fine; the UI shows them under “Raw JSON”.
