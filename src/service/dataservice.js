import { Subject } from "rxjs";
import { /*read,*/ utils,writeFileXLSX,/* writeFile */} from 'xlsx';
// import axios from 'axios';
let sheetjsReaderXlsxFile = [];
let filterCondition = [];
let sheetsList = [];
let sheetHeader = [];
let sheetName;
let sheetIndex = 0;
const _transferTableInfo$ = new Subject([]);
const _exportFileProgram$ = new Subject({});
const _lockedInterface$ = new Subject({});
const _transfetSheetsList$ = new Subject([]);
const _handleXlsxMessage$ = new Subject([]);
const _transferHeaderInfo$ = new Subject([]);
const _toggleHeaderSetting$ = new Subject({});
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
//   const buf = file.arrayBuffer();
//   const workbook = new Excel.Workbook();
//   await workbook.xlsx.load(buf).then(async()=>{
//     const workSheet = await workbook.getWorksheet(1);
//     await workSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
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
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
  //read xlsx
  // const name = inputFile.name;
  // const workbook = new Excel.Workbook();
  // await workbook.xlsx.readFile(inputFile).then(async()=>{
  //   const workSheet = await workbook.getWorksheet(1);
  // });
  //
  //sheetjswebwork
  await _lockedInterface$.next(true);
  const xlsxBuffer = await inputFile.arrayBuffer();
  sheetjsReaderXlsxFile = await sheetjsWebWorker(xlsxBuffer);
  // const transferSheetsList = [];
  const transferSheetData = sheetjsReaderXlsxFile.data[0];
  for(let i = 0 ; sheetjsReaderXlsxFile.data.length > i ;i++){
    if(i === 0) {
      sheetHeader.length = 0;
      sheetHeader = Object.keys(sheetjsReaderXlsxFile.data[0].sheetData[0]);
    }
    sheetsList.push(sheetjsReaderXlsxFile.data[i].sheetName)
  }
  await _transferTableInfo$.next( transferSheetData );
  await _transfetSheetsList$.next( sheetsList );
  await _lockedInterface$.next( false );
  await _transferHeaderInfo$.next(sheetHeader);
  //small file
  // const xlsxBuffer = await inputFile.arrayBuffer();
  // const workBook = read(xlsxBuffer);
  // // type: "binary",
  // if(workBook.SheetNames.length > 1){
  //   return
  // }else{
  //   sheetName = workBook.SheetNames[0];
  // }
  //   xlsxData = await utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/);
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
};
const transferSheetsList = ()=> sheetsList;
const changedSheetData = async(sheetName, exportFile = false)=>{
  sheetIndex = await sheetjsReaderXlsxFile.data.findIndex((sheet) => sheet.sheetName === sheetName);
  if(sheetIndex === -1) {
    sheetIndex = 0;
    return
  }
  handleFilterXlsx(filterCondition, exportFile);
  // _transferTableInfo$.next( sheetjsReaderXlsxFile.data[sheetIndex] );
};
const searchAllXlsxData = (searchText)=>{
  if(!sheetjsReaderXlsxFile.data[sheetIndex] || !sheetjsReaderXlsxFile.data[sheetIndex].sheetData) return;
  sheetjsReaderXlsxFile.data[sheetIndex].sheetData.forEach((row)=>{
    const rowVal = Object.values(row);
    // const index  = rowVal.filter((item) => item.indexOf())
  })
}
const readXlsxContent = (conditions) => {
  return new Promise((resolve, reject)=>{
    try{
      const filterData = [];
      filterCondition = conditions;
      if(!sheetjsReaderXlsxFile.data[sheetIndex] || !sheetjsReaderXlsxFile.data[sheetIndex].sheetData) return;
      sheetName = sheetjsReaderXlsxFile.data[sheetIndex].sheetName;
      sheetjsReaderXlsxFile.data[sheetIndex].sheetData.forEach((row) => {
        let changedRowStr = '';
        let changedConditionLower = '';
        let equalCondition;
        for(let i = 0 ; conditions.length > i ; i++){
          if(!row[conditions[i].selectedItem]) continue;
          changedRowStr = row[conditions[i].selectedItem].toString().toLowerCase();
          changedConditionLower = conditions[i].textContent.toLowerCase();
          if(i === 0){
            equalCondition = changedRowStr.indexOf(changedConditionLower) > -1? true : false;
          }else{
            if(conditions[i].uesdlinkedMethod === 'and') equalCondition = equalCondition && changedRowStr.indexOf(changedConditionLower) > -1?true : false;
            if(conditions[i].uesdlinkedMethod === 'or') equalCondition = equalCondition || changedRowStr.indexOf(changedConditionLower) > -1?true : false;
          }
        }
        if(equalCondition) filterData.push(row);
        resolve(filterData)
      });
    }catch(err){
      console.log(err)
      reject(err)
    }
    
  })
}
const handleFilterXlsx = (conditions, exportFile = false) => {
  if(conditions.length === 0){
    filterCondition = [];
    _transferTableInfo$.next( sheetjsReaderXlsxFile.data[sheetIndex] );
    return
  }
  readXlsxContent(conditions).then((filterData)=>{
    if(filterData.length === 0){
    _handleXlsxMessage$.next({'message': "No information, change your search information", displayedIcon: false })
      return
    }
    if(exportFile){
      return filterData;
    }
    _transferTableInfo$.next({sheetName, 'sheetData':filterData});
    _handleXlsxMessage$.next({'message': "Search finish", displayedIcon: false })
  })
  // const filterData = [];
  // filterCondition = conditions;
  // if(!sheetjsReaderXlsxFile.data[sheetIndex] || !sheetjsReaderXlsxFile.data[sheetIndex].sheetData) return;
  // sheetName = sheetjsReaderXlsxFile.data[sheetIndex].sheetName;
  // sheetjsReaderXlsxFile.data[sheetIndex].sheetData.forEach((row)=>{
  //   let changedRowStr = '';
  //   let changedConditionLower = '';
  //   let equalCondition;
  //   for(let i = 0 ; conditions.length > i ; i++){
  //     if(!row[conditions[i].selectedItem])continue;
  //     changedRowStr = row[conditions[i].selectedItem].toString().toLowerCase();
  //     changedConditionLower = conditions[i].textContent.toLowerCase();
  //     if(i === 0){
  //       equalCondition = changedRowStr === changedConditionLower;
  //     }else{
  //       if(conditions[i].uesdlinkedMethod === 'and') equalCondition = equalCondition && changedRowStr === changedConditionLower;
  //       if(conditions[i].uesdlinkedMethod === 'or') equalCondition = equalCondition || changedRowStr === changedConditionLower;
  //     }
  //   }
  //   if(equalCondition) filterData.push(row);
  // });
  // if(filterData.length === 0){
  //   _handleXlsxMessage$.next({'message': "No information, change your search information", displayedIcon: false })
  //   return
  // }
  // if(exportFile){
  //   return filterData;
  // } 

  // _transferTableInfo$.next({sheetName, 'sheetData':filterData});
  // _handleXlsxMessage$.next({'message':"Search finish", displayedIcon: false })
}
const exportXlsx = async(sheetList)=> {
  const selectedSheetsName = [];
  const wb = utils.book_new();
  sheetList.forEach((sheet)=> {if(sheet.selected)selectedSheetsName.push(sheet.name)});
  for(let i = 0 ; selectedSheetsName.length > i ; i++){
    const sheetData = await changedSheetData(selectedSheetsName[i], true);
    if(sheetData.length > 0){
      const ws = utils.json_to_sheet(sheetjsReaderXlsxFile.data[sheetIndex].sheetData);
      utils.book_append_sheet(wb, ws, sheetjsReaderXlsxFile.data[sheetIndex].sheetName);
    }
  }
  writeFileXLSX(wb, 'new_Excel' + '.xlsx');
  _handleXlsxMessage$.next({'message': "Export files finish", displayedIcon: false })
  _exportFileProgram$.next({ download: true });
  // for(let i = 0 ; selectedSheetsName.length > i ; i++){
  //   const sheetIndex = sheetjsReaderXlsxFile.data.findIndex((data)=>data.sheetName === selectedSheetsName[i]);
  //   if(sheetIndex !== -1){
  //     const ws = utils.json_to_sheet(sheetjsReaderXlsxFile.data[sheetIndex].sheetData);
  //     utils.book_append_sheet(wb, ws, sheetjsReaderXlsxFile.data[sheetIndex].sheetName);
  //   }
  // }
  // writeFileXLSX(wb, 'new_Excel' + '.xlsx');
  // _exportFileProgram$.next({ download: true });
};
const toggleHeaderSetting = (header) => _toggleHeaderSetting$.next(header);
export const dataService = {
  handledXlsxFormat,
  exportXlsx,
  handleFilterXlsx,
  changedSheetData,
  transferSheetsList,
  toggleHeaderSetting,
  toggleHeaderSetting$:_toggleHeaderSetting$.asObservable(),
  transferHeaderInfo$: _transferHeaderInfo$.asObservable(),
  transferTableInfo$: _transferTableInfo$.asObservable(),
  exportFileProgram$: _exportFileProgram$.asObservable(),
  lockedInterface$: _lockedInterface$.asObservable(),
  transfetSheetsList$: _transfetSheetsList$.asObservable(),
  handleXlsxMessage$:_handleXlsxMessage$.asObservable()
}