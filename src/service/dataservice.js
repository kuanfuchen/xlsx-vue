import { Subject } from "rxjs";
import { read, utils,writeFileXLSX,/* writeFile */} from 'xlsx';
// import readXlsxFile from 'read-excel-file';
import readXlsxFile from 'read-excel-file/web-worker';
// import XLSXTransformStream from 'xlsx-write-stream';
// import  xlstream  from 'xlstream';
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
      if(fileSizeEnd > inputFile.size)fileSizeEnd = inputFile.size;
      const chunkFile = inputFile.slice(fileSizeIndex, fileSizeEnd);
      // const promiseBlob = Promise.resolve(chunkFile).then((val)=> val.arrayBuffer());
      const promiseBlob = Promise.resolve(chunkFile).then((val)=> val);
      fileArr.push(promiseBlob);
      fileSizeIndex = fileSizeEnd
    }
  } 
  return await fileArr
}
const handledXlsxFormat = async(inputFile) => {
  console.log(inputFile);
  // readXlsxFile(inputFile).then((rows)=>{
  //   console.log(rows)
  // })
  onmessage = ()=>{
    readXlsxFile(inputFile).then((rows) => {
      // `rows` is an array of rows
      // each row being an array of cells.
      postMessage(rows)
    })
  }
  return
  const handleFile = await handleBigContentFile(inputFile);
  const xlsxBufferArr = await Promise.all(handleFile).then((values)=> values);
  console.log(xlsxBufferArr, 'xlsxBufferArr')
  xlsxBufferArr.forEach(async(xlsxBuffer, index) => {
    let isTrue = false;
    if(xlsxBufferArr.length === index + 1) isTrue = true;
    await readXlsx(xlsxBuffer, isTrue)
    // const workBook = await read(xlsxBuffer);
    // console.log(workBook,'workBook');
    // if(workBook.SheetNames.length > 1){
    //   return
    // }{
    //   sheetName = workBook.SheetNames[0];
    // }
    // xlsxData = await utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/);
    // _transferTableInfo$.next({ name:sheetName, data:xlsxData });
  })
  
  // const xlsxBuffer = await inputFile.arrayBuffer();
  // const workBook = read(xlsxBuffer);
  // if(workBook.SheetNames.length > 1){
  //   return
  // }{
  //   sheetName = workBook.SheetNames[0];
  // }
    // xlsxData = await utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/);
    // console.log(xlsxData, 'xlsxData')
    // xlsxData = new Promise((resolve,reject)=>{
    //   resolve(utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/));
    //   reject((err)=>console.log(err))
    // }) 
    // console.log(xlsxData,'data');
    // await _transferTableInfo$.next({ name:sheetName, data:xlsxData });
}
const xlsxFile = (xlsxBuffer, isTrue)=>{

}
const readXlsx = async(xlsxBuffer, isTrue)=>{
  const workBook = await read(xlsxBuffer);
    // console.log(workBook,'workBook');
    if(workBook.SheetNames.length > 1){
      return
    }{
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
// const handledXlsxFormat = ()=>{}
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