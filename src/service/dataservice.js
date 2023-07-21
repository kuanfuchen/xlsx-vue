import { Subject } from "rxjs";
import { /*read,*/ utils,writeFileXLSX,/* writeFile */} from 'xlsx';
// import axios from 'axios';
let sheetjsReaderXlsxFile = [];
let sheetName;
const _transferTableInfo$ = new Subject([]);
const _exportFileProgram$ = new Subject({});
const _lockedInterface$ = new Subject({});
// const handleBigContentFile = async(inputFile) =>{
//   const bytePerPiece = 1024 * 1024 * 5;
//   const fileNumber = Math.ceil(inputFile.size / bytePerPiece);
//   let fileSizeIndex = 0;
//   const fileArr = [];
//   if(fileNumber > 0){
//     for (let i = 0 ; fileNumber > i ; i++){
//       let fileSizeEnd = fileSizeIndex + bytePerPiece;
//       if(fileSizeEnd > inputFile.size) fileSizeEnd = inputFile.size;
//       const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
//       const chunkFile = inputFile.slice(fileSizeIndex, fileSizeEnd, type);
//       // const promiseBlob = Promise.resolve(chunkFile).then((val)=> val.arrayBuffer());
//       Promise.resolve(chunkFile).then((promiseBlob) => fileArr.push(promiseBlob));
      
//       fileSizeIndex = fileSizeEnd
//     }
//   } 
//   return await fileArr
// }
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
  return new Promise((resolve, reject)=>{
    const xlsxWorker = new Worker(new URL('worker.js', import.meta.url),{ type:'module' });
    xlsxWorker.postMessage(xlsxBuffer);
    xlsxWorker.onmessage = (ev)=>{
      resolve(ev);
    };
    xlsxWorker.onerror = (err)=>{
      reject(err);
      console.log(err)
    }
  })
}
// import * as Excel from "exceljs";
// const resolveXlsx = async(file)=>{
//   //small file
//   console.log(file)
//   const buf = file.arrayBuffer();
//   const workbook = new Excel.Workbook();
//   await workbook.xlsx.load(buf).then(async()=>{
//     const workSheet = await workbook.getWorksheet(1);
//     await workSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
//       console.log(`Row ${rowNumber}: ${row.values}`);
//       const info = `Row ${rowNumber}: ${row.values}`;  
//       return info
//     });
//   })
// }
const handledXlsxFormat = async(inputFile) => {
  // await resolveXlsx(inputFile)
  // const files = await handleBigContentFile(inputFile);
  // const xlsx = await workerHandleXlsx(inputFile);
  //
  //big data
  // const handleFile = await handleBigContentFile(inputFile);
  // const xlsxBufferArr = await Promise.all(handleFile).then((values)=> values);
  // console.log(xlsxBufferArr, xlsxBufferArr.length, 'xlsxBufferArr');
  // xlsxBufferArr.forEach(async(chunkXlsx, index) => {
  //   let isTrue = false;
  //   if(xlsxBufferArr.length === index + 1) isTrue = true;
  //   const xlsxBuffer = await chunkXlsx.arrayBuffer();
  //   const sheetjsXlsx = await sheetjsWebWorker(xlsxBuffer);
  //   xlsxData = xlsxData.concat(sheetjsXlsx);
  // })
  // axios  後端
  // axios.post('http://localhost:8081/posts', {
  //   file:inputFile
  //   // file:files
  // },{
  //   timeout: 500000,
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }})
  // .then(function (response) {
  //   console.log(response);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
  //read xlsx
  // const name = inputFile.name;
  // const workbook = new Excel.Workbook();
  // // console.log(workbook)
  // await workbook.xlsx.readFile(inputFile).then(async()=>{
  //   const workSheet = await workbook.getWorksheet(1);
  //   console.log(workSheet)
  // });
  //
  //sheetjswebwork
  await _lockedInterface$.next(true);
  const xlsxBuffer = await inputFile.arrayBuffer();
  sheetjsReaderXlsxFile = await sheetjsWebWorker(xlsxBuffer);

  await _transferTableInfo$.next(sheetjsReaderXlsxFile);
  await _lockedInterface$.next(false);
  // await _transferTableInfo$.next({ 
  //   name: sheetjsXlsx.data.sheetName, 
  //   data: sheetjsXlsx.data.xlsxData 
  // });
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
const handleFilterXlsx = ()=> console.log('handleFilterXlsx');
const exportXlsx = ()=> {
  const wb = utils.book_new();
  const ws = utils.json_to_sheet(sheetjsReaderXlsxFile);
  utils.book_append_sheet(wb, ws, "Data");
  writeFileXLSX(wb, 'new_' + sheetName);
  _exportFileProgram$.next({ download: true });
};

export const dataService = {
  handledXlsxFormat,
  exportXlsx,
  handleFilterXlsx,
  transferTableInfo$: _transferTableInfo$.asObservable(),
  exportFileProgram$: _exportFileProgram$.asObservable(),
  lockedInterface$: _lockedInterface$.asObservable(),
}