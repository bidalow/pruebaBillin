const fs = require('fs').promises

//Interfaces
interface billInterface {
  code: string;
  issuedDate: string;
  ownerName: string;
  contactName: string;
  subtotal: number;
  taxes: number;
  total: number;
  status: string;
};

interface errorInterface{
  property: string;
  message: string;
}

interface completeLineError{
  line: number;
  errors: object[]
}

interface dataRequirementInterface{
  propertyName: string,
  type: string,
  required: boolean,
  constrains: string[]
}


export class Importer {

  

  async import(filePath: string, splitCharacter: string = ';'): Promise<any> {
    const dataRequirement:dataRequirementInterface[] = [
      {propertyName:'code',type:'string', required:true, constrains: []}, 
      {propertyName:'issuedDate', type: 'string', required:true, constrains: []},
      {propertyName:'ownerName', type: 'string', required:true, constrains: []},
      {propertyName:'contactName', type: 'string', required:true, constrains: []},
      {propertyName:'subtotal', type: 'number', required:true, constrains: []},
      {propertyName:'taxes', type: 'number', required:true, constrains: []},
      {propertyName:'total', type: 'number', required:true, constrains: []},
      {propertyName:'status', type: 'string', required:true, constrains: ["draft", "issued"]}
    ]
    let bill: billInterface;
    let errors: object[];
    let lineError: errorInterface;
    let badLine: completeLineError;
    let goodLines: object[] = [];
    let badLines: object[] = [];
    let cells: any[];
    let data:any;

    //We use the async method to read our file
    const csvFile = await fs.readFile('./files/'+filePath, "utf8");
      
    //Separate each row of the document
    const rows = csvFile.split("\r\n")

    for(let i=1;i<rows.length;i++){
      //If the line is empty we ignore it
      if(rows[i] == "\n" || rows[i].trim().length == 0) { continue; }

      //We reset the errors
      errors = [];
      
      //We extract from the current row all the data
      cells = rows[i].split(splitCharacter).map((x: string, index:number) =>{

        //We remove whitespace from the beginning and end our value
        data = x.trim()

        //If the data is blank and is required then we return an error
        if(data == "" && dataRequirement[index]["required"]){
          lineError = {
            property: dataRequirement[index]["propertyName"],
            message: "required"
          }
  
          errors.push(lineError);
        }

        //If the data type is number we convert it
        if(dataRequirement[index]["type"] == "number"){
          data = parseFloat(data);

          //If the converted data is not a number, we return an invalid error
          if(isNaN(data) && dataRequirement[index]["required"]){
            lineError = {
              property: dataRequirement[index]["propertyName"],
              message: "invalid"
            }
    
            errors.push(lineError);
          }
        }

        //If the data has a limit number of possible values we check if it is inside the possibilities
        if(dataRequirement[index].constrains.length !== 0){
            if(!dataRequirement[index].constrains.includes(data)){
              lineError = {
                property: dataRequirement[index]["propertyName"],
                message: "invalid"
              }
      
              errors.push(lineError);
            }
          }

        
        return data;
      });

      //If we had some errors on the line then we log the error and don't return the line
      if(errors.length !== 0){
        badLine = {
          line: i,
          errors: errors
        }
  
        badLines.push(badLine);
      }else{
        bill = {
          code: cells[0],
          issuedDate: cells[1],
          ownerName: cells[2],
          contactName: cells[3],
          subtotal: cells[4],
          taxes: cells[5],
          total: cells[6],
          status: cells[7]
        }
  
        goodLines.push(bill)
      }
  
      
      
    }

    return {
      ok: goodLines,
      ko: badLines,
    };
  };
    
    

    
    

    
    
  
}



