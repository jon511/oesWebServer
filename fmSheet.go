package main

import "net/http"

func fmSheetCreate(w http.ResponseWriter, r *http.Request) {
	pageSetting := PageSettings{Title: "FM Sheet Create", Javascript: "fmSheetCreate.js", CSS: "fmSheetCreate.css"}
	tmp.ExecuteTemplate(w, "fmSheet.gohtml", pageSetting)
}
