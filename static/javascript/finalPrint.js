const sendToPrint = xmlHttpRequest

class PrintData{
    constructor(){
        this.Command = 'FINALPRINT'
        this.CellId = ""
        this.ItemId = ""
        this.PrinterIpAddress = ""
        this.RevLevel = ""
        this.Weight = ""
    }
}

const printData = new PrintData()

const handleTestPrint = () => {
    printData.ItemId = document.getElementById('serial-number').value
    if (printData.ItemId === ""){
        document.getElementById('serial-number-error').innerHTML = "**Serial Number field cannot be blanek.**"
        return
    }
    document.getElementById('serial-number-error').innerHTML = ""
    printData.PrinterIpAddress = document.getElementById('ip-address').value
    if (!validateIpAddress(printData.PrinterIpAddress)){
        document.getElementById('ip-address-error').innerHTML = '**IP Address is not valid.**'
        return
    }
    document.getElementById('ip-address-error').innerHTML = ''
    printData.Weight = (document.getElementById('weight').value === "") ? "0.00" : document.getElementById('weight').value
    printData.RevLevel = (document.getElementById('rev-level').value === "") ? "00" : document.getElementById('rev-level').value

    let str = JSON.stringify(printData)
    sendToPrint(str, handleResponse, '/finalPrintPost')
}
const handleResponse = (data) => {
    console.log(data)
}

document.getElementById('print-button').addEventListener('click', handleTestPrint)
document.querySelector('.serial-input-main').addEventListener('click', () => { document.getElementById('serial-number').focus()})
document.querySelector('.ip-address-main').addEventListener('click', () => { document.getElementById('ip-address').focus()})
document.querySelector('.weight-input-main').addEventListener('click', () => { document.getElementById('weight').focus()})
document.querySelector('.rev-level-main').addEventListener('click', () => { document.getElementById('rev-level').focus()})
document.getElementById('serial-number').addEventListener('keydown', () => {
    if (event.keyCode === 13){ event.preventDefault(); document.getElementById('ip-address').focus() }
})
document.getElementById('ip-address').addEventListener('keydown', () => {
    if (event.keyCode === 13){ event.preventDefault(); document.getElementById('weight').focus() }
})
document.getElementById('weight').addEventListener('keydown', () => {
    if (event.keyCode === 13){ event.preventDefault(); document.getElementById('rev-level').focus() }
})
document.getElementById('rev-level').addEventListener('keydown', () => {
    if (event.keyCode === 13 || event.keyCode === 9){ event.preventDefault(); document.getElementById('print-button').focus() }
})
document.getElementById('print-button').addEventListener('keydown', () => {
    if (event.keyCode === 9){ event.preventDefault(); document.getElementById('serial-number').focus() }
})

document.getElementById('serial-number').focus()