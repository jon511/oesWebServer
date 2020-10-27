package main

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