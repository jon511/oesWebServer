package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net"
	"net/http"
	"strconv"
	"strings"
)

var tmp *template.Template

type settings struct {
	IPAddress string
}

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

type loginData struct {
	Command     string
	CellID      string
	RequestCode int
	OperatorID  string
}

type serialRequest struct {
	Serial string
}

var mySettings settings
var versionString = "1.1.2"

func init() {
	tmp = template.Must(template.ParseGlob("templates/*"))
}

func main() {

	dat, err := ioutil.ReadFile("oesWebConfig.json")
	if err != nil {
		fmt.Println("error reading oesWEbConfig.json file")
		fmt.Println(err)
		mySettings.IPAddress = "10.50.5.34"
	}

	json.Unmarshal(dat, &mySettings)

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", handleIndex)

	http.HandleFunc("/help", handleHelp)

	http.HandleFunc("/setup", setup)

	http.HandleFunc("/setupRequest", setupRequest)

	http.HandleFunc("/login", login)

	http.HandleFunc("/loginRequest", loginRequest)

	http.HandleFunc("/test", handleTest)

	http.HandleFunc("/serialRequest", handleSerialRequest)

	http.HandleFunc("/serialRequestPost", handleSerialRequestPost)

	http.HandleFunc("/sendToPrinter", handlePrintRequest)

	fmt.Println("Version: " + versionString)
	fmt.Println("Using OES Server: " + mySettings.IPAddress)
	fmt.Println("Listening .....")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println(err)
	}

}

func handleTest(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	bodyByte, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	bodyString := string(bodyByte)
	fmt.Println(bodyString)

	fmt.Println("sending shit back")

	data := "{\"extraFrosting\":false,\"quantity\":100,\"city\":\"3\",\"zip\":\"4\",\"streetAddress\":\"2\",\"type\":3,\"name\":\"1\",\"addSprinkles\":false}"
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(data))
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	tmp.ExecuteTemplate(w, "index.gohtml", nil)
}

func handleHelp(w http.ResponseWriter, r *http.Request) {

	tmp.ExecuteTemplate(w, "help.gohtml", nil)
}

func setup(w http.ResponseWriter, r *http.Request) {
	tmp.ExecuteTemplate(w, "setup.gohtml", nil)
}

func login(w http.ResponseWriter, r *http.Request) {
	tmp.ExecuteTemplate(w, "login.gohtml", nil)
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

func handleSerialRequest(w http.ResponseWriter, r *http.Request) {
	tmp.ExecuteTemplate(w, "serialRequest.gohtml", nil)
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

	sendToPrinter(results["printCode"], results["ipAddress"])

	status := "{\"status\":\"Good\"}"

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(status))

}

func sendSetupTransaction1(sendData []byte) string {

	// conn, err := net.Dial("tcp", "127.0.0.1:55001")
	conn, err := net.Dial("tcp", mySettings.IPAddress+":55001")
	// conn, err := net.Dial("tcp", "10.53.1.122:55001")
	if err != nil {
		fmt.Println(err)
	}

	conn.Write([]byte(sendData))

	bytes := make([]byte, 2048)

	n, err := conn.Read(bytes)
	if err != nil {
		fmt.Println(err)
	}

	readBytes := make([]byte, n)
	copy(readBytes, bytes[:n])

	response := string(readBytes)
	return response

}

func sendToPrinter(printCode, ipAddress string) {
	conn, err := net.Dial("tcp", ipAddress+":9100")
	if err != nil {
		fmt.Println(err)
	}

	conn.Write([]byte(printCode))

	conn.Close()
}
