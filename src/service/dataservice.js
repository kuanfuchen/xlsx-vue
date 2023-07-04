import { Subject } from "rxjs";
import { read, utils,writeFileXLSX,/* writeFile */} from 'xlsx';
let xlsxData = [];
let sheetName;
const _transferTableInfo$ = new Subject([]);
const _exportFileProgram$ = new Subject({});
const handledXlsxFormat = async(inputFile)=>{
  const xlsxBuffer = await inputFile.arrayBuffer();
  // console.log(xlsxBuffer,'xlsxBuffer');

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
    // console.log(workBook,'workBook')
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