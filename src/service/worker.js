import { read, utils } from 'xlsx';
self.onmessage = async(event)=>{
  console.log(event,'event');
  // if(event.data && event.data.size > 20*1024*1024){
  const arr = await handleBigContentFile(event.data);
  console.log(arr)
  const xlsxArr = await Promise.all(arr).then((values)=> values);
  // }
  console.log(xlsxArr);
  // const reader = new FileReader();
  // reader.readAsArrayBuffer(event.data);
  // reader.onload = async(e)=>{
  //   const data = e.target.result;
  //   console.log(data,'data')
  //   const wb = read(data, { dense: true });
  //   const sheetName = wb.SheetNames[0];
  //   const ws = wb.Sheets[wb.SheetNames[0]];
  //   const xlsxData = await utils.sheet_to_json(ws);
  //   postMessage({ sheetName, xlsxData })
  // }
  
  // console.log(wb,' wb')
  // const sheetName = wb.SheetNames[0];
  // const ws = wb.Sheets[wb.SheetNames[0]];
  // const xlsxData = await utils.sheet_to_json(ws);
  // // const xlsxData = await stream.to_json(ws);
  // postMessage({ sheetName, xlsxData })
  let arrWs = [];
  let sheetName = '';
  for(let i = 0 ; xlsxArr.length > i ; i++){
    const xlsxBufferArr = await xlsxArr[i].arrayBuffer();
    const wb = read(xlsxBufferArr, { dense: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const xlsxData = await utils.sheet_to_json(ws);
    arrWs = arrWs.concat(xlsxData)
    // postMessage({ sheetName, xlsxData })
  }
  console.log(arrWs,'arrWs')
  postMessage({ sheetName, xlsxData:arrWs })
}

const handleBigContentFile = async(inputFile) =>{
  const bytePerPiece = 1024 * 1024 * 20;
  const fileNumber = Math.ceil(inputFile.size / bytePerPiece);
  let fileSizeIndex = 0;
  // const fileName = inputFile.name;
  // let fileIndex = 0;
  const fileArr = [];
  if(fileNumber > 0){
    for (let i = 0 ; fileNumber > i ; i++){
      let fileSizeEnd = fileSizeIndex + bytePerPiece;
      if(fileSizeEnd > inputFile.size) fileSizeEnd = inputFile.size;
      const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
      const chunkFile = inputFile.slice(fileSizeIndex, fileSizeEnd, type);
      // const promiseBlob = Promise.resolve(chunkFile).then((val)=> val.arrayBuffer());
      const promiseBlob = Promise.resolve(chunkFile).then((val)=> val);
      fileArr.push(promiseBlob);
      fileSizeIndex = fileSizeEnd
    }
  } 
  return await fileArr
}
