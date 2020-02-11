const requestLogon = xmlHttpRequest

const handleReturn = (resData) => {
    
    let responseData = JSON.parse(resData)

    if (responseData.FaultCode !== 0){
        let status = document.getElementById('login-status')
        status.innerHTML = `Error ${responseData.FaultCode} - ${manITErrors[responseData.FaultCode]}`
    }else{
        if (responseData.ProcessIndicator === 2){
            document.getElementById('login-status').innerHTML = "Log On Complete"
            setTimeout(resetLogin, 2000)
        }else{
            document.getElementById('login-status').innerHTML = "Log Off Complete"
            setTimeout(resetLogin, 2000)
        }
    }
    
}

const resetLogin = () => {
    document.getElementById('login-status').innerHTML = ''
    document.getElementById('cell-id').value = ''
    document.getElementById('operator-id').value = ''
}

const handleLogon = (requestCode) => {

    const doc = document

    let cellId = doc.getElementById('cell-id').value.toUpperCase()
    if (cellId === ""){
        doc.getElementById('cell-id-error').innerHTML = "**Cell ID cannot be blank**"
        return
    }else{
        doc.getElementById('cell-id-error').innerHTML = ""
    }
    let operatorId = doc.querySelector('#operator-id').value.toUpperCase()
    if (operatorId === "" && requestCode === 2){
        doc.getElementById('operator-id-error').innerHTML = '**Operator ID cannot be blank**'
        return
    }else{
        doc.getElementById('operator-id-error').innerHTML = ''
    }

    if (operatorId === "" && requestCode === 3)
        requestCode = 19

    let data = `request=${requestCode}&cellId=${cellId}`
    if (requestCode !== 19)
        data += `&operatorId=${operatorId}`

    requestLogon(data, handleReturn, '/loginRequest')
}

document.getElementById('logon').addEventListener('click', () => { handleLogon(2) })
document.getElementById('logoff').addEventListener('click', () => { handleLogon(3) })
document.getElementById('cell-id').focus()
document.querySelector('.cell-id-main').addEventListener('click', () => {
    document.getElementById('cell-id').focus()
})
document.querySelector('.operator-id-main').addEventListener('click', () => {
    document.getElementById('operator-id').focus()
})
document.getElementById('cell-id').addEventListener('keydown', () => {
    if (event.keyCode === 13){ event.preventDefault(); document.getElementById('operator-id').focus() }
})
document.getElementById('operator-id').addEventListener('keydown', () => {
    if (event.keyCode === 13 || event.keyCode === 9){ event.preventDefault(); document.getElementById('logon').focus() }
})
document.getElementById('logon').addEventListener('keydown', () => {
    if (event.keyCode === 9){ event.preventDefault(); document.getElementById('logoff').focus() }
})
document.getElementById('logoff').addEventListener('keydown', () => {
    if (event.keyCode === 9){ event.preventDefault(); document.getElementById('cell-id').focus() }
})