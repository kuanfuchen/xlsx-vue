// import readXlsxFile from 'read-excel-file/web-worker';
// self.onmessage = (event)=>{
//   readXlsxFile(event.data).then(async(rows)=>{
//     await postMessage(rows)
//   })
// }
import { read, utils, stream } from 'xlsx';
self.onmessage = async(event)=>{
  // console.log(event, 'ev')
  const wb = read(event.data, { dense: true,cellStyles:true });
  console.log(wb,' wb')
  const ws = wb.Sheets[wb.SheetNames[0]];
  const xlsxData = await utils.sheet_to_json(ws);
  // const xlsxData = await stream.to_json(ws);
  postMessage(xlsxData)

}