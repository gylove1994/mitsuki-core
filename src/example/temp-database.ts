import { Injectable } from '../core/decorators';
@Injectable()
export class TempDatabase{
  private database:string[] = [];
  public show(){
    console.log(this.database);
  }
  public put(msg:string){
    this.database.push(msg);
  }
}
