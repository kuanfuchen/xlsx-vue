import { Subject } from "rxjs";
import { read, utils,writeFileXLSX,/* writeFile */} from 'xlsx';
import axios from 'axios';
// import readXlsxFile from 'read-excel-file';
// import readXlsxFile from 'read-excel-file/web-worker';
let xlsxData = [];
let sheetName;
const _transferTableInfo$ = new Subject([]);
const _exportFileProgram$ = new Subject({});
const handleBigContentFile = async(inputFile) =>{
  const bytePerPiece = 1024 * 1024 * 10;
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
// const workerHandleXlsx = (inputFile)=>{
//   return new Promise((resolve, reject)=>{
//     const xlsxWorker = new Worker(new URL('worker.js', import.meta.url),{type:'module'});
//     xlsxWorker.postMessage(inputFile);
//     xlsxWorker.onmessage  = (ev)=>{
//       console.log(ev.data,'data')
//       resolve(ev.data)
//     };
//     xlsxWorker.onerror = (err)=>{
//       console.log(err)
//       reject(err)
//     };
//   })
// };
const sheetjsWebWorker = (xlsxBuffer)=>{
  return new Promise((res, rej)=>{
    const xlsxWorker = new Worker(new URL('worker.js', import.meta.url),{type:'module'});
    xlsxWorker.postMessage(xlsxBuffer);
    xlsxWorker.onmessage = (ev)=>{
      res(ev);
    };
    xlsxWorker.onerror = (err)=>{
      rej(err);
      console.log(err)
    }
    // xlsxWorker.postMessage(xlsxBuffer);
    // xlsxWorker.onmessage  = (ev)=>{
    //   console.log(ev.data,'data')
    //   res(ev.data)
    // };
    // xlsxWorker.onerror = (err)=>{
    //   console.log(err)
    //   rej(err)
    // };
  })
}
const handledXlsxFormat = async(inputFile) => {
  console.log(inputFile);
  // const startTime = new Date();
  // const xlsx = await workerHandleXlsx(inputFile);
  // console.log(xlsx, 'xlsx');
  // const endTime = new Date();
  // const runTime = endTime.getTime() - startTime.getTime();
  // console.log(runTime, 'runTime')
  //
  //big data
  // const handleFile = await handleBigContentFile(inputFile);
  // const xlsxBufferArr = await Promise.all(handleFile).then((values)=> values);
  // console.log(xlsxBufferArr, xlsxBufferArr.length, 'xlsxBufferArr');
  // xlsxBufferArr.forEach(async(chunkXlsx, index) => {
  //   console.log(chunkXlsx)
  //   let isTrue = false;
  //   if(xlsxBufferArr.length === index + 1) isTrue = true;
  //   const xlsxBuffer = await chunkXlsx.arrayBuffer();
  //   // await readXlsx(xlsxBuffer, isTrue);
  //   const sheetjsXlsx = await sheetjsWebWorker(xlsxBuffer);
  //   xlsxData = xlsxData.concat(sheetjsXlsx);
  // })
  // console.log(xlsxData, 'xlsxData')

  //axios
  axios.post('http://localhost:8081/posts', {
    file:inputFile
  },{
    timeout: 100000,
    headers: {
      'Content-Type': 'multipart/form-data'
    }})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

  //sheetjswebwork
  // const xlsxBuffer = await inputFile.arrayBuffer();
  // const sheetjsXlsx = await sheetjsWebWorker(xlsxBuffer);
  // await _transferTableInfo$.next({ 
  //   name: sheetjsXlsx.data.sheetName, 
  //   data: sheetjsXlsx.data.xlsxData 
  // });
  // console.log(sheetjsXlsx, 'sheetjsXlsx');
  //small file
  // const xlsxBuffer = await inputFile.arrayBuffer();
  // const workBook = read(xlsxBuffer);
  // // type: "binary",
  // console.log(workBook,'')
  // if(workBook.SheetNames.length > 1){
  //   return
  // }else{
  //   sheetName = workBook.SheetNames[0];
  // }
  //   xlsxData = await utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/);
  //   // console.log(xlsxData, 'xlsxData')
  //   // xlsxData = new Promise((resolve,reject)=>{
  //   //   resolve(utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/));
  //   //   reject((err)=>console.log(err))
  //   // }) 
  //   await _transferTableInfo$.next({ name:sheetName, data:xlsxData });
  // 
  // const xlsxBuffer = await inputFile.arrayBuffer();
  // let len = xlsxBuffer.byteLength;
  // if(len < 1024) len += " bytes"; else { len /= 1024;
  //   if(len < 1024) len += " KB"; else { len /= 1024; len += " MB"; }
  // }
  // console.log(len,'len')
  
}
const readXlsx = async(xlsxBuffer, isTrue) => {
  const workBook = await read(xlsxBuffer);
  console.log(workBook)
    // console.log(workBook,'workBook');
    if(workBook.SheetNames.length > 1){
      return
    }else{
      sheetName = workBook.SheetNames[0];
    }
    // xlsxData = await utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/);
    const data = await utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/);
    xlsxData = xlsxData.concat(data);
    if(isTrue === true) {
      await _transferTableInfo$.next({ name:sheetName, data: xlsxData });
      console.log(xlsxData, 'xlsxData')
    }
}
const handleFilterXlsx = ()=> console.log('handleFilterXlsx');
const exportXlsx = ()=> {
  const wb = utils.book_new();
  const ws = utils.json_to_sheet(xlsxData);
  utils.book_append_sheet(wb, ws, "Data");
  writeFileXLSX(wb, 'new_' + sheetName);
  _exportFileProgram$.next({ download: true });
  // const wb = utils.aoa_to_sheet([[]],{cellDates:true});
  // writeFileXLSX(wb, 'new_xlsx.xlsx')
  // utils.book_append_sheet(workbook, wb, 'new_xlsx');
};

export const dataService = {
  handledXlsxFormat,
  exportXlsx,
  handleFilterXlsx,
  transferTableInfo$: _transferTableInfo$.asObservable(),
  exportFileProgram$: _exportFileProgram$.asObservable(),
}