(require '[org.httpkit.client :as httpkit-client])
(require '[cheshire.core :as json])

(defn send-json
  "Encodes a map as JSON and sends it via HTTP POST."
  [url payload]
  (let [json-payload (json/encode payload)
        headers {"Content-Type" "application/json"}
        request-options {:body json-payload
                         :headers headers}]
    (httpkit-client/post url request-options)))
