package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
)

type loginData struct {
	Command     string
	CellID      string
	RequestCode int
	OperatorID  string
}

func login(w http.ResponseWriter, r *http.Request) {
	pageSetting := PageSettings{Title: "Login", Javascript: "login.js", CSS: "login.css"}
	tmp.ExecuteTemplate(w, "login.gohtml", pageSetting)
}

func loginRequest(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	bodyByte, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	bodyString := string(bodyByte)
	resultsString := strings.Split(bodyString, "&")
	fmt.Println(resultsString)
	var results = make(map[string]string)
	for _, val := range resultsString {
		element := strings.Split(val, "=")
		key := element[0]
		results[key] = element[1]
	}
	reqCode, err := strconv.Atoi(results["request"])
	if err != nil {
		fmt.Println(err)
	}

	sd := loginData{"LOGIN", results["cellId"], reqCode, results["operatorId"]}

	jData, err := json.Marshal(sd)

	data := sendSetupTransaction1(jData)

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(data))
}
