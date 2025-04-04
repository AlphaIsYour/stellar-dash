package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-resty/resty/v2"
	"github.com/gorilla/mux"
)

type SatelliteData struct {
    Name        string  `json:"name"`
    Latitude    float64 `json:"latitude"`
    Longitude   float64 `json:"longitude"`
    Altitude    float64 `json:"altitude"`
}

func main() {
    router := mux.NewRouter()
    router.HandleFunc("/api/satellites", getSatelliteData).Methods("GET")

    log.Println("Server jalan di :8080")
    log.Fatal(http.ListenAndServe(":8080", router))
}

func getSatelliteData(w http.ResponseWriter, r *http.Request) {
    client := resty.New()

    _, err := client.R().
        SetQueryParam("api_key", "YOUR_API_KEY").
        Get("https://api.nasa.gov/planetary/earth/assets?lat=0&lon=0")

    if err != nil {
        http.Error(w, "Gagal narik data", http.StatusInternalServerError)
        return
    }

    // Tambah header CORS
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Content-Type", "application/json")

    // Dummy data
    satellites := []SatelliteData{
        {Name: "ISS", Latitude: 51.0, Longitude: -0.1, Altitude: 408},
        {Name: "Hubble", Latitude: -33.8, Longitude: 151.2, Altitude: 540},
    }

    json.NewEncoder(w).Encode(satellites)
}