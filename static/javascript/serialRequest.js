const sendRequest = xmlHttpRequest

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

    sendRequest(`request=${21}&cellId=${cellId}`, handleGetSerialReturn, '/serialRequestPost')
    
    hidePrintCode()
}

const handleGetSerialReturn = (data) => {

    const res = JSON.parse(data)
    
    if (res.Serial[0] === "\u0000"){
        document.getElementById('current-serial-number').innerHTML = "Error: Serial number did not return or is invalid."
        return
    }else{
        document.getElementById('current-serial-number').innerHTML = res.Serial
    }
    
    
    let newPrintCode = localStorage.getItem("printCode").replace(/FD_SerialNumber_/g, res.Serial)
    const printerIpAddress = document.getElementById('ipAddress').value

    sendRequest(`printCode=${newPrintCode}&ipAddress=${printerIpAddress}`, handlePrintRequestReturn, '/sendToPrinter')
}

const handlePrintRequestReturn = (data) => {
    const printStatus = JSON.parse(data)
    
    if (printStatus.status === 'Good'){
        document.getElementById('current-serial-number').innerHTML  += ' : Successfully sent to printer'
    }else {
        document.getElementById('current-serial-number').innerHTML  += ' : ' + printStatus.status   
    }
    
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
    document.getElementById('current-serial-number').innerHTML = ''
    const printerIpAddess = document.getElementById('ipAddress').value
    if (printerIpAddess === "" || !validateIpAddress(printerIpAddess)){
        document.getElementById('ipAddress-error').innerHTML = "** Printer IP Address is not valid **"
        return
    }else{
        document.getElementById('ipAddress-error').innerHTML = ""
    }

    let newPrintCode = localStorage.getItem("printCode").replace(/FD_SerialNumber_/g, 'QG9TEST001')
    const printerIpAddress = document.getElementById('ipAddress').value

    sendRequest(`printCode=${newPrintCode}&ipAddress=${printerIpAddress}`, handlePrintRequestReturn, '/sendToPrinter')
}

document.getElementById('request-serial-number-button').addEventListener('click', handleRequest)
document.getElementById('view-button').addEventListener('click', showPrintCode)
document.getElementById('save-button').addEventListener('click', savePrintCode)
document.getElementById('test-button').addEventListener('click', printTest)
document.querySelector('.cell-id-input').addEventListener('click', () => {
    document.getElementById('cell-id').focus()
})
document.querySelector('.ipAddress-input').addEventListener('click', () => {
    document.getElementById('ipAddress').focus()
})

let PrintCode = `^XA^PQ1^PRA^LH000,000
^FO030,140^BXN,5,200,,,6,,^FD_SerialNumber_^FS
^FO030,230^A0N,015,015^FD_SerialNumber_^FS
^XZ`

if (window.localStorage.getItem("printCode") === null){
    console.log('set local storage')
    window.localStorage.setItem("printCode", PrintCode)
}

document.getElementById('print-text-area').innerHTML = localStorage.getItem('printCode')

document.getElementById('cell-id').addEventListener('keydown', () => {
    if (event.keyCode === 13){ event.preventDefault(); document.getElementById('ipAddress').focus() }
})
document.getElementById('ipAddress').addEventListener('keydown', () => {
    if (event.keyCode === 13 || event.keyCode === 9){ event.preventDefault(); document.getElementById('request-serial-number-button').focus() }
})
document.getElementById('request-serial-number-button').addEventListener('keydown', () => {
    if (event.keyCode === 9){ event.preventDefault(); document.getElementById('cell-id').focus() }
})

document.getElementById('cell-id').focus()