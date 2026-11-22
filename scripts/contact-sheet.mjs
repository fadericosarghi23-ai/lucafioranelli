// Provini delle foto per scegliere hero e copertine (solo uso interno)
import { readFileSync } from 'node:fs'
import sharp from 'sharp'
const data = JSON.parse(readFileSync('scripts/data/houzz.json','utf8'))
const out = process.argv[2]
const items = data.projects.flatMap((p,pi)=>[...p.images,...(p.before??[])].map((id,k)=>({id,label:`${pi}.${k} ${p.name.slice(0,14)}`})))
const W=220,H=150,C=8
const pages=[items.slice(0,64),items.slice(64)]
for (const [n,page] of pages.entries()){
  const rows=Math.ceil(page.length/C)
  const comps=[]
  for (const [i,it] of page.entries()){
    const x=(i%C)*W, y=Math.floor(i/C)*(H+18)
    const img=await sharp(`public/img/p/${it.id}-480.webp`).resize(W-4,H-4,{fit:'cover'}).toBuffer()
    comps.push({input:img,left:x+2,top:y+2})
    comps.push({input:Buffer.from(`<svg width="${W}" height="18"><text x="3" y="13" font-size="12" font-family="Arial">${it.label.replace(/&/g,'e')}</text></svg>`),left:x,top:y+H})
  }
  await sharp({create:{width:W*C,height:rows*(H+18),channels:3,background:'#fff'}}).composite(comps).jpeg({quality:70}).toFile(`${out}/sheet${n}.jpg`)
}
console.log('ok')
