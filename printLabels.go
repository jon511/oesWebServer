package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func handlePrintRequest(w http.ResponseWriter, r *http.Request) {
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

	status := "{\"status\":\"Good\"}"

	err = sendToPrinter(results["printCode"], results["ipAddress"])
	if err != nil {
		status = "{\"status\":\"Error sending to printer\"}"
	}

	//status := "{\"status\":\"Good\"}"

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(status))

}

func handleFinalPrintRequest(w http.ResponseWriter, r *http.Request) {
	pageSetting := PageSettings{Title: "Final Label Print", Javascript: "finalPrint.js", CSS: "finalPrint.css"}
	tmp.ExecuteTemplate(w, "finalLabel.gohtml", pageSetting)
}

func handleFinalPrintPost(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	bodyByte, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	bodyString := string(bodyByte)
	fmt.Println(bodyString)

	retStr := sendSetupTransaction1([]byte(bodyString))

	// resultsString := strings.Split(bodyString, "&")
	// var results = make(map[string]string)
	// for _, val := range resultsString {
	// 	element := strings.Split(val, "=")
	// 	key := element[0]
	// 	results[key] = element[1]
	// }

	// status := "{\"status\":\"Good\"}"

	// err = sendToPrinter(results["printCode"], results["ipAddress"])
	// if err != nil {
	// 	status = "{\"status\":\"Error sending to printer\"}"
	// }

	//status := "{\"status\":\"Good\"}"

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(retStr))
}
