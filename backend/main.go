package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-resty/resty/v2"
	"github.com/gorilla/mux"
)

type SatelliteData struct {
	Name      string  `json:"name"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Altitude  float64 `json:"altitude"`
}

type N2YOResponse struct {
	Info struct {
		SatName string `json:"satname"`
		SatID   int    `json:"satid"`
	} `json:"info"`
	Positions []struct {
		SatLatitude  float64 `json:"satlatitude"`
		SatLongitude float64 `json:"satlongitude"`
		SatAltitude  float64 `json:"sataltitude"`
	} `json:"positions"`
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/api/satellites", getSatelliteData).Methods("GET")

	log.Println("Server jalan di :8080")
	err := http.ListenAndServe(":8080", router)
	if err != nil {
		log.Fatalf("Gagal start server: %v", err)
	}
}

func getSatelliteData(w http.ResponseWriter, r *http.Request) {
	client := resty.New()

	const apiKey = "7CY47W-BFPMWJ-QCSQXN-5G4X"
	// Tambah satelit: ISS (25544), Hubble (20580), Starlink-1007 (44713), Starlink-1008 (44714), NOAA 15 (25338)
	satIDs := []int{25544, 20580, 44713, 44714, 25338}
	var satellites []SatelliteData

	for _, satID := range satIDs {
		resp, err := client.R().
			SetQueryParams(map[string]string{
				"id":     strconv.Itoa(satID),
				"apiKey": apiKey,
			}).
			Get("https://api.n2yo.com/rest/v1/satellite/positions/" + strconv.Itoa(satID) + "/0/0/0/1")

		if err != nil || resp.StatusCode() != 200 {
			log.Printf("Gagal narik data satelit %d: %v, status: %d", satID, err, resp.StatusCode())
			continue
		}

		var n2yoData N2YOResponse
		if err := json.Unmarshal(resp.Body(), &n2yoData); err != nil {
			log.Printf("Gagal parse data satelit %d: %v", satID, err)
			continue
		}

		if len(n2yoData.Positions) > 0 {
			pos := n2yoData.Positions[0]
			satellites = append(satellites, SatelliteData{
				Name:      n2yoData.Info.SatName,
				Latitude:  pos.SatLatitude,
				Longitude: pos.SatLongitude,
				Altitude:  pos.SatAltitude,
			})
		}
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	if len(satellites) == 0 {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Gagal mengambil data satelit"})
		return
	}

	json.NewEncoder(w).Encode(satellites)
}