import { Subject } from "rxjs";
import { read, utils,/* writeFile */} from 'xlsx';
const _transferTableInfo$ = new Subject([]);



const handledXlsxFormat = async(inputFile)=>{
  const xlsxBuffer = await inputFile.arrayBuffer();
    console.log(xlsxBuffer)
    const workBook = read(xlsxBuffer);
    let sheetName;
    if(workBook.SheetNames.length > 1){
      return
    }{
      sheetName = workBook.SheetNames[0];
    }
    console.log(sheetName)
    const xlsxData = utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]/*,{raw:false, header:1}*/);
    // console.log(xlsxData,'data');
    _transferTableInfo$.next({ name:sheetName, data:xlsxData });
}
// const handledXlsxFormat = ()=>{}
export const dataService = {
  handledXlsxFormat,
  transferTableInfo$: _transferTableInfo$.asObservable(),
}