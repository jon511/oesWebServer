window.onload = () => {
    //     let ws = new WebSocket("ws://10.50.5.34:55001")
    //     ws.onopen = () => {
    //         ws.send("PROD,130401,QG9WebSocket,,0,0,0,0,0,0")
    //         console.log('sent')
    //     }
    
    //     ws.onmessage = (evt) => {
    //         let mes = evt.data
    //         console.log(mes)
    
    //     }
    
    //     ws.onclose = () => {
    //         console.log('closed')
    //     }
    // }
    
        let mySocket = TCPSocket("10.50.5.34", 55001)
    
    
    }