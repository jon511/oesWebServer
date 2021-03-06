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

const xmlHttpRequest = (requestString, callback, url) => {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            callback(xhr.responseText)
        }
    }

    xhr.open('POST', url, true);
    xhr.send(requestString);
}


const manITErrors = {
    101: 'Machine input exptected',
    102: 'Machine processing failed for part',
    106: 'No one logged on to cell',
    108: 'Machine process failed part scrapped',
    110: 'Failed X times must report as scrap',
    207: 'Container does not match setup model ID',
    211: 'Container status invalid - must be pending',
    302: 'Error update table',
    303: 'No one logged on to cell',
    304: 'Error select item serial not in database',
    307: 'Maximum number of operators',
    308: 'Item does not exist',
    309: 'Error inserting into table',
    310: 'Setup invalid model operation for cell',
    313: 'Invalid key pressed',
    314: 'Components not loaded',
    317: 'Selecting count for raw materials from bill of materials',
    318: 'Possible duplicate serial',
    320: 'Part at wrong operation',
    321: 'Part is scrapped, do not use!!!',
    322: 'Piece is in use either packed or already used',
    326: 'Invalid model id - must begin with P',
    329: 'Not received',
    331: 'Invalid access ID',
    333: 'Wrong operation for component',
    334: 'Quality status not OK',
    335: 'No default cell for station',
    336: 'Error setup for cell negative count on raw',
    338: 'Not a valid user',
    350: 'Check if person is already logged on',
    405: 'Invalid scrap reason code',
    406: 'Part already scrapped',
    408: 'No one logged on to cell',
    410: 'Time not elapsed for part',
    505: 'Mask validation failed for item ID',
    750: 'Invalid PERSON_ID-CELL-ID CERT',
    999: 'Unknown',
    1111: 'Work order value must be 6 characters long',
    1117: 'Gasfill queue limit',
    1118: 'Serial can not be null',
    1119: 'Conversion from string to type double is not valid',
    1123: 'Login canceled at users request',
    1127: 'Item already has a parent, chec ITEM_XREF',
    1131: 'Container model does not match setup model',
    1133: 'Failed tolerance value',
    1138: 'Print shipping label conversion from type DBNULL to type string ins not valid',
    1139: 'PIECESPERBOXQTY MULTIPLIED BY BOXESPERSKIDQTY CAN NOT BE GREATER THAN QUANTITYTOPACK',
    1147: 'Item scanned is not th esame model as container loaded',
    1153: 'Container serial must be pending packed or inspection',
    1154: 'Print ODETTE label error select MASTER_LABEL_ID',
    1156: 'Item scanned does not exist in teh database',
    1168: 'Machine failed part',
}