import { read, utils } from 'xlsx'
self.onmessage = async(event)=>{
  console.log(event,'event');
  const wb = read(event.data, { type: "binary",dense: true });
  console.log(wb,' wb')
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[wb.SheetNames[0]];
  const xlsxData = await utils.sheet_to_json(ws);
  postMessage({ sheetName, xlsxData })
}
