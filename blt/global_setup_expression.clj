;; Optional: store the API URL in globals so multiple triggers can reuse it.

(defn init-globals []
  (let [url "http://127.0.0.1:5001/api/receive_data"]
    (swap! globals assoc-in [:blt-webui :server-url] url)))

(init-globals)
