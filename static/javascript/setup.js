
class ComponentData{
    constructor(){
        this.accessId = 0
        this.modelNumber = ""
        this.serialNumber = ""
        this.quantity = 0
        this.accepted = false
    }
}

class SetupData{
    constructor(){
        this.requestCount = 0
        this.cellId = ""
        this.modelNumber = ""
        this.opNumber = ""
        this.components = []
        this.acknowledge = 0
        this.errorCode = 0
        this.componentQuantity = 0
        this.plcModelSetup = []
    }
}

let setupData = new SetupData()

window.onload = () => {
    console.log('page loaded')

    document.getElementById("submit").addEventListener('click', handleSubmit)
    document.getElementById('model-number').addEventListener('focusout', () => {
        testFunc('model-number', 'P')
    })
    document.getElementById('model-number').addEventListener('keydown', () => {
        newFunc(event, 'submit')
    })

    document.getElementById('cell-id').addEventListener('focusout', () => {
        testFunc('cell-id', '10S')
    })
    document.getElementById('cell-id').addEventListener('keydown', () => {
        newFunc(event, 'op-number')
    })

    document.getElementById('op-number').addEventListener('focusout', () => {
        testFunc('op-number', '1W')
    })
    document.getElementById('op-number').addEventListener('keydown', () => {
        newFunc(event, 'model-number')
    })

    document.getElementById('cell-id').focus()
    
}

function newFunc(event, next){
        console.log(event.which)
        if (event.keyCode === 13){
            event.preventDefault()
            document.getElementById(next).focus()
        }
}

function testFunc(val, ch) {
    let str = document.getElementById(`${val}`).value
    let subStr = str.substring(0, ch.length)
    if (subStr === ch) {
        str = str.substring(ch.length)
    }

    document.getElementById(val).value = str
}

function handleSubmit(){
    
    setupData.cellId = document.querySelector("#cell-id").value.toUpperCase()
    if (setupData.cellId === ""){
        document.getElementById('cell-id-error').innerHTML = 'Cell ID cannot be blank'
        return
    }else{
        document.getElementById('cell-id-error').innerHTML = ''

    }
    setupData.modelNumber = document.querySelector('#model-number').value.toUpperCase()
    if (setupData.modelNumber === ""){
        document.getElementById('model-number-error').innerHTML = 'Model Number cannot be blank'
        return
    }else{
        document.getElementById('model-number-error').innerHTML = ''

    }
    setupData.opNumber = document.querySelector('#op-number').value.toUpperCase()
    if (setupData.opNumber === ""){
        document.getElementById('op-number-error').innerHTML = 'OP Number cannot be blank'
        return
    }else{
        document.getElementById('op-number-error').innerHTML = ''

    }

    let data = `request=4&cellId=${setupData.cellId}&modelNumber=${setupData.modelNumber}&opNumber=${setupData.opNumber}`
    
    setupRequest(data)


}

function setupRequest(data){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {

            let responseData = JSON.parse(xhr.responseText)
            parseSetupReturn(responseData)
        }
    }
    xhr.open('POST', '/setupRequest', true);
    xhr.send(data);
}

function parseSetupReturn(responseData){

    if (responseData.Component1.AccessId !== "0") {
        let newComp = new ComponentData()
        newComp.accessId = parseInt(responseData.Component1.AccessId)
        newComp.modelNumber = responseData.Component1.ModelNumber
        setupData.components.push(newComp)
    }
    if (responseData.Component2.AccessId !== "0") {
        let newComp = new ComponentData()
        newComp.accessId = parseInt(responseData.Component2.AccessId)
        newComp.modelNumber = responseData.Component2.ModelNumber
        setupData.components.push(newComp)
    }
    if (responseData.Component3.AccessId !== "0") {
        let newComp = new ComponentData()
        newComp.accessId = parseInt(responseData.Component3.AccessId)
        newComp.modelNumber = responseData.Component3.ModelNumber
        setupData.components.push(newComp)
    }
    if (responseData.Component4.AccessId !== "0") {
        let newComp = new ComponentData()
        newComp.accessId = parseInt(responseData.Component4.AccessId)
        newComp.modelNumber = responseData.Component4.ModelNumber
        setupData.components.push(newComp)
    }
    if (responseData.Component5.AccessId !== "0") {
        let newComp = new ComponentData()
        newComp.accessId = parseInt(responseData.Component5.AccessId)
        newComp.modelNumber = responseData.Component6.ModelNumber
        setupData.components.push(newComp)
    }
    if (responseData.Component6.AccessId !== "0") {
        let newComp = new ComponentData()
        newComp.accessId = parseInt(responseData.Component6.AccessId)
        newComp.modelNumber = responseData.Component6.ModelNumber
        setupData.components.push(newComp)
    }
    setupData.acknowledge = responseData.Acknowledge
    setupData.errorCode = responseData.ErrorCode
    setupData.componentQuantity = responseData.Quantity
    setupData.plcModelSetup = responseData.PlcModelSetup

    updateDisplay()
}

function updateDisplay(){
    // let setupDiv = document.getElementById('setupDiv')
    // setupDiv.innerHTML = ""

    let cellHeader = document.createElement('label')
    cellHeader.innerHTML = `${setupData.cellId}`
    let modelHeader = document.createElement('label')
    modelHeader.innerHTML = `${setupData.modelNumber}`
    let opHeader = document.createElement('label')
    opHeader.innerHTML = `${setupData.opNumber}`

    let temp = document.querySelector('.cell-id-input')
    temp.innerHTML = ''
    temp.appendChild(cellHeader)
    temp = document.querySelector('.model-input')
    temp.innerHTML = ''
    temp.appendChild(modelHeader)
    temp = document.querySelector('.op-input')
    temp.innerHTML = ''
    temp.appendChild(opHeader)

    let subDiv = document.getElementById('submit')
    subDiv.parentElement.removeChild(subDiv)

    if (setupData.errorCode !== '1'){
        displayStatus(setupData.errorCode)
        return
    }

    if (setupData.components.length === 0){
        setupComplete()
        return
    }

    let componentsDiv = document.createElement('div')
    componentsDiv.classList.add('components-div')

    let d1 = document.createElement('div')
    d1.innerHTML = "Acesss ID"
    d1.classList.add('top-row')
    let d2 = document.createElement('div')
    d2.innerHTML = "Component"
    d2.classList.add('top-row')
    let d3 = document.createElement('div')
    d3.innerHTML = "Serial Number"
    d3.classList.add('top-row')
    let d4 = document.createElement('div')
    d4.innerHTML = "Quantity"
    d4.classList.add('top-row')

    componentsDiv.appendChild(d1)
    componentsDiv.appendChild(d2)
    componentsDiv.appendChild(d3)
    componentsDiv.appendChild(d4)

    for (let index = 0; index < setupData.components.length; index++) {
        const element = setupData.components[index];
        let compDiv = document.createElement('div')
        let accessLabel = document.createElement('label')
        accessLabel.innerHTML = element.accessId
        let componentLabel = document.createElement('label')
        componentLabel.innerHTML = element.modelNumber
        let newInput = document.createElement('input')
        newInput.type = 'text'
        newInput.id = `comp${index}`
        newInput.addEventListener('focusout', () => {
            testFunc(`comp${index}`, 'S')
        })
        newInput.addEventListener('keydown', () => {
            if (index + 1 === setupData.components.length){
                newFunc(event, 'submit-comp')
            }else{
                newFunc(event, `comp${index + 1}`)
            }
            
        })

        let errorLabel = document.createElement('label')
        errorLabel.innerHTML = ""
        errorLabel.id = `comp${index}-error`
        
        componentsDiv.appendChild(accessLabel)
        componentsDiv.appendChild(componentLabel) 
        componentsDiv.appendChild(newInput) 
        componentsDiv.appendChild(errorLabel) 
        
        
    }

    let submitDiv = document.createElement('div')
    submitDiv.classList.add('submit-comp')
    let submitButton = document.createElement('button')
    submitButton.innerHTML = "Submit"
    submitButton.id = "submit-comp"
    submitButton.addEventListener('click', submitComponents)

    submitDiv.appendChild(submitButton)
    // componentsDiv.appendChild(submitDiv)

    document.getElementById('mainDiv').appendChild(componentsDiv)
    document.getElementById('mainDiv').appendChild(submitDiv)
    
}

function submitComponents(){
    console.log('components submitted')

    for (let i = 0; i < setupData.components.length; i++) {
        const element = setupData.components[i];
        element.serialNumber = document.getElementById(`comp${i}`).value.toUpperCase()
        if (element.serialNumber === ""){
            document.getElementById(`comp${i}-error`).innerHTML = `Serial number cannot be blank`
            document.getElementById(`comp${i}-error`).classList.add('error')
            return
        }else{
            document.getElementById(`comp${i}-error`).innerHTML = ``
            document.getElementById(`comp${i}-error`).classList.remove('error')
        }
    }

    setupData.requestCount = 0

    if (setupData.components.length > 0)
        sendComponent()

}

function sendComponent(){

    let data = `request=5&cellId=${setupData.cellId}&modelNumber=${setupData.modelNumber}&opNumber=${setupData.opNumber}&accessId=${setupData.components[setupData.requestCount].accessId}&component=${setupData.components[setupData.requestCount].serialNumber}`


    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            // alert(xhr.responseText);
            // console.log(xhr.responseType);
            //console.log(xhr.responseText);
            let responseData = JSON.parse(xhr.responseText)
            console.log(responseData)
            
            if (responseData.ErrorCode !== '1' && responseData.ErrorCode !== '331'){
                document.getElementById(`comp${setupData.requestCount}-error`).innerHTML = `ManIT Error ${responseData.ErrorCode} - ${manITErrors[responseData.ErrorCode]}`
                return
            }
            else{
                setupData.components[setupData.requestCount].accepted = true
                if (responseData.ErrorCode === '1')
                    setupData.components[setupData.requestCount].quantity = responseData.Quantity
                //document.getElementById(`comp${setupData.requestCount}-error`).innerHTML = `${responseData.Quantity}`

            }  
            setupData.requestCount++
            if (setupData.components.length > setupData.requestCount)
                sendComponent()
            else{
                for (let i = 0; i < setupData.components.length; i++) {
                    document.getElementById(`comp${i}-error`).innerHTML = setupData.components[i].quantity
                    
                }
                setupComplete()
            }
        }
    }

    xhr.open('POST', '/setupRequest', true);
    xhr.send(data);
}

function displayStatus(status){
    if (status === 1){
        document.getElementById('setup-status').innerHTML = "Setup Complete"
        
    }else{
        document.getElementById('setup-status').innerHTML = `Error ${status} - ${manITErrors[status]}`
    }
}

function setupComplete(){

    displayStatus(1)

    let h3 = document.createElement('h3')
    h3.innerHTML = 'PLC Model Setup'
    document.querySelector('.right').appendChild(h3)

    for (let i = 0; i < setupData.plcModelSetup.length; i++) {
        let d = document.createElement('div')
        d.innerHTML = `Val ${i+1} = ${setupData.plcModelSetup[i]}`
        document.querySelector('.right').appendChild(d)
        
    }
}
