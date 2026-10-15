'use client';
import {useRef} from 'react';

export function ProfileIcon({kind}:{kind:'save'|'import'|'export'}){
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==='save'?<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M7 3v6h10M7 21v-8h10v8"/></>:<><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>{kind==='import'?<path d="M12 15V3m-4 4 4-4 4 4"/>:<path d="M12 3v12m-4-4 4 4 4-4"/>}</>}</svg>;
}

export function ImportBackup({onImport}:{onImport:(file:File)=>void}){
  const input=useRef<HTMLInputElement>(null);
  return <><input ref={input} hidden type="file" accept="application/json,.json" aria-label="Import profile backup" onChange={e=>{const file=e.target.files?.[0];if(file)onImport(file);e.target.value='';}}/><button type="button" data-analytics-id="import_backup" className="profile-import-button" onClick={()=>input.current?.click()}><ProfileIcon kind="import"/>Import backup</button></>;
}
