import { read, utils } from 'xlsx'
self.onmessage = async(event)=>{
  console.log(event,'event');
  const wb = read(event.data, { type: "binary",dense: true });
  if(wb.SheetNames.length === 0 )return 
  const wbData = [];
  for(let i = 0 ; wb.SheetNames.length > i;i++){
    const sheetName = wb.SheetNames[i];
    const ws = wb.Sheets[sheetName];
    const sheetData = await utils.sheet_to_json(ws);
    wbData.push({
      sheetName,
      sheetData
    })
  }
  postMessage(wbData);
  // const sheetName = wb.SheetNames[0];
  // const ws = wb.Sheets[wb.SheetNames[0]];
  // const xlsxData = await utils.sheet_to_json(ws);
  // postMessage({ sheetName, xlsxData })
}
