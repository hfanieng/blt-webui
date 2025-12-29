;; Example BLT beat/track payload.
;; Expects BLT convenience vars like device-number, device-name, beat-number,
;; and track-* fields to be available.

(let [url (or (get-in @globals [:blt-webui :server-url])
              "http://127.0.0.1:5001/api/receive_data")
      payload {"Message" "Track"
               "beat-number" beat-number
               "device_name" device-name
               "device_number" device-number
               "track_album" track-album
               "track_artist" track-artist
               "track_bpm" track-bpm
               "track_genre" track-genre
               "track_label" track-label
               "track_length" track-length
               "track_title" track-title}]
  (send-json url payload))
