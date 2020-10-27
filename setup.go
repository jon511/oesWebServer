package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
)

type bomData struct {
	accessID    int
	modelNumber string
}

type setupResponse struct {
	components [6]bomData
	ack        int
	errorCode  int
	quantity   int
}

type setupSendData struct {
	Command     string
	CellID      string
	RequestCode int
	ModelNumber string
	OpNumber    string
	AccessID    int
	Component   string
}

type serialRequest struct {
	Serial string
}

func setup(w http.ResponseWriter, r *http.Request) {
	pageSetting := PageSettings{Title: "Setup", Javascript: "setup.js", CSS: "setup.css"}
	tmp.ExecuteTemplate(w, "setup.gohtml", pageSetting)
}

func setupRequest(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	bodyByte, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	bodyString := string(bodyByte)
	resultsString := strings.Split(bodyString, "&")
	var results = make(map[string]string)

	for _, val := range resultsString {
		element := strings.Split(val, "=")
		key := element[0]
		results[key] = element[1]
	}
	if results["request"] == "" {
		results["request"] = "0"
	}
	reqCode, err := strconv.Atoi(results["request"])
	if err != nil {
		fmt.Println(err)
	}
	if results["accessId"] == "" {
		results["accessId"] = "0"
	}
	accessID, err := strconv.Atoi(results["accessId"])
	if err != nil {
		fmt.Println(err)
	}
	sd := setupSendData{"SETUP", results["cellId"], reqCode, results["modelNumber"], results["opNumber"], accessID, results["component"]}
	jData, err := json.Marshal(sd)

	data := sendSetupTransaction1(jData)

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(data))
	
}
