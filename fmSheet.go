package main

import (
	"fmt"
	"io/ioutil"
	"net/http"

	// "strconv"
	"strings"
)

func fmSheetCreate(w http.ResponseWriter, r *http.Request) {
	pageSetting := PageSettings{Title: "FM Sheet Create", Javascript: "fmSheetCreate.js", CSS: "fmSheetCreate.css"}
	tmp.ExecuteTemplate(w, "fmSheet.gohtml", pageSetting)
}

func getFmSheet(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	fmt.Println(r.URL.Query()["id"])
	keys, ok := r.URL.Query()["key"]

	if !ok || len(keys[0]) < 1 {
		fmt.Println("Url Param 'key' is missing")
		return
	}

	fmt.Println(keys)

	bodyByte, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	bodyString := string(bodyByte)
	resultsString := strings.Split(bodyString, "&")
	fmt.Println(resultsString)
	// var results = make(map[string]string)
	// for _, val := range resultsString {
	// 	element := strings.Split(val, "=")
	// 	key := element[0]
	// 	results[key] = element[1]
	// }
	// reqCode, err := strconv.Atoi(results["request"])
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// sd := loginData{"LOGIN", results["cellId"], reqCode, results["operatorId"]}

	//jData, err := json.Marshal(sd)

	data := "[{one: one}, {two: two}]"

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(data))
}
