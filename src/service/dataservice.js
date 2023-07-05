import { Subject } from "rxjs";
import { read, utils,writeFileXLSX,/* writeFile */} from 'xlsx';
import { getWorksheets, getXlsxStream } from 'xlstream';
// import  xlstream  from 'xlstream';
let xlsxData = [];
let sheetName;
const _transferTableInfo$ = new Subject([]);
const _exportFileProgram$ = new Subject({});
const handleBigContentFile = async(inputFile) =>{
  const bytePerPiece = 1024 * 1024 * 5;
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
      const promiseBlob = Promise.resolve(chunkFile).then((val)=> val.arrayBuffer());
      console.log(promiseBlob, 'promiseBlob')
      fileArr.push(promiseBlob);
      fileSizeIndex = fileSizeEnd
    }
  } 
  return await fileArr
}
const handledXlsxFormat = async(inputFile)=>{
  console.log(inputFile);
  // const reader = new FileReader();
  // reader.onload = ()=>{}
  // const url = reader.readAsDataURL(inputFile);
  // console.log(url)
  // const handleFile = await handleBigContentFile(inputFile);
  // const xlsxBufferArr = await Promise.all(handleFile).then((values)=> values);
  // xlsxBufferArr.forEach(async(xlsxBuffer) => {
  //   const workBook = await read(xlsxBuffer);
  //   console.log(workBook,'workBook')
  //   if(workBook.SheetNames.length > 1){
  //     return
  //   }{
  //     sheetName = workBook.SheetNames[0];
  //   }
  // })
  // console.log(xlsxData)
  // console.log(xlsxBufferArr, 'xlsxBufferArr')
  // const xlsxBufferArr = handleFile.map((item)=>return new Promise item.arrayBuffer());
  const xlsxBuffer = await inputFile.arrayBuffer();
    // const reader = new FileReader();
    // reader.readAsArrayBuffer(inputFile);
    // reader.onload = (e)=>{
    //   const result = e.target.result;
    //   console.log(result,'result')
    // }
  const workBook = read(xlsxBuffer);
  if(workBook.SheetNames.length > 1){
    return
  }{
    sheetName = workBook.SheetNames[0];
  }
    // await new Promise((res, rej)=>{
    //   res(utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/))
    // }).then((val)=>{
    //   console.log(val, 'val')
    // })
    // 
    xlsxData = await utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/);
    // console.log(xlsxData, 'xlsxData')
    // xlsxData = new Promise((resolve,reject)=>{
    //   resolve(utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/));
    //   reject((err)=>console.log(err))
    // }) 
    // console.log(xlsxData,'data');
    _transferTableInfo$.next({ name:sheetName, data:xlsxData });
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