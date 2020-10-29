package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net"
	"net/http"
	"strings"
	"time"
)

var tmp *template.Template

type settings struct {
	IPAddress string
}

//PageSettings is data to pass to webpages
type PageSettings struct {
	Title      string
	Javascript string
	CSS        string
}

var mySettings settings
var versionString = "1.2.2"

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

	http.HandleFunc("/finalPrint", handleFinalPrintRequest)

	http.HandleFunc("/finalPrintPost", handleFinalPrintPost)

	http.HandleFunc("/fmSheetCreate", fmSheetCreate)

	http.HandleFunc("/getFmSheet", getFmSheet)

	fmt.Println("Version: " + versionString)
	fmt.Println("Using OES Server: " + mySettings.IPAddress)
	fmt.Println("Listening on port 8000.....")
	err = http.ListenAndServe(":8000", nil)
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
	pageSetting := PageSettings{Title: "Main Page", Javascript: "index.js", CSS: "style.css"}
	tmp.ExecuteTemplate(w, "index.gohtml", pageSetting)
}

func handleHelp(w http.ResponseWriter, r *http.Request) {
	pageSetting := PageSettings{Title: "Help", Javascript: "help.js", CSS: "help.css"}
	tmp.ExecuteTemplate(w, "help.gohtml", pageSetting)
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

func sendToPrinter(printCode, ipAddress string) error {
	conn, err := net.DialTimeout("tcp", ipAddress+":9100", 3*time.Second)
	if err != nil {
		return err
	}

	conn.Write([]byte(printCode))

	conn.Close()
	return nil
}
