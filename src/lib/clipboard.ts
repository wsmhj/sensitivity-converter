export class ClipboardQueue {
  private pending:Promise<unknown>=Promise.resolve();
  write(text:string,writer:(text:string)=>Promise<void>,current:()=>boolean):Promise<boolean>{
    const task=this.pending.catch(()=>undefined).then(async()=>{if(!current())return false;await writer(text);return current();});
    this.pending=task;return task;
  }
}
