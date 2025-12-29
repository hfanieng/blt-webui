;; Example BLT phrase/section payload.
;; Expects BLT convenience vars like effective-tempo, phrase-type, section,
;; and track-* fields to be available.

(let [url (or (get-in @globals [:blt-webui :server-url])
              "http://127.0.0.1:5001/api/receive_data")
      payload {"Message" "phrase"
               "beat-number" beat-number
               "bpm" effective-tempo
               "device_name" device-name
               "device_number" device-number
               "fill" (= section :fill)
               "phrase_type" phrase-type
               "section" section
               "track_album" track-album
               "track_bank" track-bank
               "track_artist" track-artist
               "track_bpm" track-bpm
               "track_genre" track-genre
               "track_key" track-key
               "track_label" track-label
               "track_length" track-length
               "track_time_reached" track-time-reached
               "track_title" track-title}]
  (send-json url payload))
