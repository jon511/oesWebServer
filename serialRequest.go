package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
)

func handleSerialRequest(w http.ResponseWriter, r *http.Request) {
	pageSetting := PageSettings{Title: "Interim Label", Javascript: "serialRequest.js", CSS: "serialRequest.css"}
	tmp.ExecuteTemplate(w, "serialRequest.gohtml", pageSetting)
}

func handleSerialRequestPost(w http.ResponseWriter, r *http.Request) {
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
	// reqCode, err := strconv.Atoi(results["request"])
	// if err != nil {
	// 	fmt.Println(err)
	// }

	s := "SERIAL," + results["cellId"] + "," + results["request"]

	data := sendSetupTransaction1([]byte(s))

	dArr := strings.Split(data, ",")
	sr := serialRequest{dArr[1]}

	retData, err := json.Marshal(sr)

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(retData))

}
