
const handleRequest = () => {
    document.getElementById('current-serial-number').innerHTML = ""
    const cellId = document.getElementById('cell-id').value.toUpperCase()
    if (cellId === "") {
        document.getElementById('cell-id-error').innerHTML = "** Cell ID cannot be blank **"
        return
    }else{
        document.getElementById('cell-id-error').innerHTML = ""
    }
    const printerIpAddess = document.getElementById('ipAddress').value
    if (printerIpAddess === "" || !validateIpAddress(printerIpAddess)){
        document.getElementById('ipAddress-error').innerHTML = "** Printer IP Address is not valid **"
        return
    }else{
        document.getElementById('ipAddress-error').innerHTML = ""
    }

    sendRequest(`request=${21}&cellId=${cellId}`)

    hidePrintCode()
}

const validateIpAddress = (ipAddress) => {
    let s = ipAddress.toString()
    let sArr = s.split('.')
    if (sArr.length !== 4)
        return false

    for (let i = 0; i < sArr.length; i++){
        const a = parseInt(sArr[i])
        if (a < 0 || a > 255)
            return false

        if (isNaN(a)){
            return false
        }
    }

    return true
}

const sendPrintRequest = (serialNumber) => {
    document.getElementById('current-serial-number').innerHTML = serialNumber
    
    let newPrintCode = localStorage.getItem("printCode").replace(/FD_SerialNumber_/g, serialNumber)
    const printerIpAddress = document.getElementById('ipAddress').value
    sendRequest2(`printCode=${newPrintCode}&ipAddress=${printerIpAddress}`)

}

const sendRequest = (str) => {
    let req = new XMLHttpRequest()
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            const res = JSON.parse(req.responseText)
            console.log(res)
            sendPrintRequest(res.Serial)
        }
    }
    req.open('POST', '/serialRequestPost', true)
    req.send(str)
}

const sendRequest2 = (str) => {
    let req = new XMLHttpRequest()
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            const res = JSON.parse(req.responseText)
            console.log(res)
        }
    }
    req.open('POST', '/sendToPrinter', true)
    req.send(str)
}

const showPrintCode = () => {

    if (document.getElementById('test-button').classList.contains('hidden')){
        document.getElementById('view-button').innerHTML = "Hide Print Code"
        document.getElementById('print-text-area').classList.remove('hidden')
        document.getElementById('save-button').classList.remove('hidden')
        document.getElementById('test-button').classList.remove('hidden')
    }else{
        hidePrintCode()
    }


}

const hidePrintCode = () => {
    document.getElementById('view-button').innerHTML = "View Print Code"
        document.getElementById('print-text-area').classList.add('hidden')
        document.getElementById('save-button').classList.add('hidden')
        document.getElementById('test-button').classList.add('hidden')
}

const savePrintCode = () => {
    const thisPrintCode = document.getElementById('print-text-area').innerHTML
    if (localStorage.getItem('printCode') !== thisPrintCode){
        localStorage.setItem('printCode', thisPrintCode) 
    }

}

const printTest = () => {

    const printerIpAddess = document.getElementById('ipAddress').value
    if (printerIpAddess === "" || !validateIpAddress(printerIpAddess)){
        document.getElementById('ipAddress-error').innerHTML = "** Printer IP Address is not valid **"
        return
    }else{
        document.getElementById('ipAddress-error').innerHTML = ""
    }


    sendPrintRequest('QG9TEST0001')
}

document.getElementById('request-serial-number-button').addEventListener('click', handleRequest)
document.getElementById('view-button').addEventListener('click', showPrintCode)
document.getElementById('save-button').addEventListener('click', savePrintCode)
document.getElementById('test-button').addEventListener('click', printTest)

let PrintCode = `^XA^PQ1^PRA^LH000,000
^FO030,140^BXN,5,200,,,6,,^FD_SerialNumber_^FS
^FO030,230^A0N,015,015^FD_SerialNumber_^FS
^XZ`

if (window.localStorage.getItem("printCode") === null){
    console.log('set local storage')
    window.localStorage.setItem("printCode", PrintCode)
}

document.getElementById('print-text-area').innerHTML = localStorage.getItem('printCode')