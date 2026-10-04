import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateContent, assertContent, httpsUrl, youtubeId, FORM_ENDPOINT, GITHUB_CONTENT_URL } from '../src/lib/content-policy.js';
import { mediaEmbedUrl, allowedEmbed } from '../src/lib/media.js';
import { trustedEditorLocation, saveContent } from '../src/lib/github-save.js';
const original = JSON.parse(readFileSync(new URL('../src/data/content.json', import.meta.url)));
const copy = () => structuredClone(original);

test('existing content remains valid and supports 100 works', () => {
  assert.equal(validateContent(original), '');
  const data=copy(); data.works=Array.from({length:100},(_,i)=>({...data.works[0],id:`work-${i}`}));
  assert.equal(validateContent(data), '');
});
for (const value of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', '//evil.example', 'http://example.com', 'https://user:password@example.com', 'https://example.com:444/', ' https://example.com', 'https://example.com/\nfoo', 'https:\\example.com']) {
  test(`reject unsafe URL ${JSON.stringify(value)}`, () => {
    assert.equal(httpsUrl(value),null);
    for (const field of ['coverUrl','mediaUrl','soundcloudUrl']) {const data=copy(); data.works[0][field]=value; assert.notEqual(validateContent(data),'');}
    const data=copy();data.updates[0].url=value;assert.throws(()=>assertContent(data));
  });
}
test('reject provider lookalikes and arbitrary Formspree destinations', () => {
  for (const value of ['https://evilyoutube.com/watch?v=CxoTzLIx8Cs','https://youtube.com.evil.example/watch?v=CxoTzLIx8Cs','https://youtu.be/invalid']) assert.equal(youtubeId(value),'');
  assert.equal(mediaEmbedUrl('soundcloud','https://example.com'),'');
  for (const value of ['https://evil.example','https://formspree.io/f/other',FORM_ENDPOINT+'?redirect=https://evil.example']) {const data=copy();data.site.formEndpoint=value;assert.notEqual(validateContent(data),'');}
});
test('allow legitimate players only', () => {
  for(const work of original.works) assert.equal(allowedEmbed(mediaEmbedUrl(work.mediaType,work.mediaUrl)),true);
  assert.equal(allowedEmbed(mediaEmbedUrl('soundcloud',original.site.soundcloudUrl)),true);
  assert.equal(allowedEmbed('https://w.soundcloud.com/player/?url=https://evil.example'),false);
  assert.equal(allowedEmbed('https://www.youtube-nocookie.com.evil.example/embed/CxoTzLIx8Cs'),false);
});
test('reject invalid shapes and duplicate IDs before HTML generation', () => {
  for(const data of [null,{}, {...original,works:[]},{...original,site:[]},{...original,works:[original.works[0],original.works[0]]}]) assert.throws(()=>assertContent(data));
});
test('editor rejects framing, unofficial origins, and unrelated paths', () => {
  for(const href of ['https://ru13ii.github.io/portfolio/edit/','http://127.0.0.1:4321/edit/','http://localhost:4321/portfolio/edit/']) {
    assert.equal(trustedEditorLocation(href,true),true); assert.equal(trustedEditorLocation(href,false),false);
  }
  for(const href of ['https://ru13ii.github.io.evil.example/portfolio/edit/','http://ru13ii.github.io/portfolio/edit/','https://ru13ii.github.io/other/edit/','https://evil.example/edit/','file:///edit/']) assert.equal(trustedEditorLocation(href,true),false);
});
const current = (data=original) => ({ok:true,json:async()=>({sha:'known-sha',encoding:'base64',content:Buffer.from(JSON.stringify(data)).toString('base64')})});
test('GitHub save fixes destination and branch, rejects redirects, and uses expected sha',async()=>{
  const calls=[];const data=copy();data.site.name='テスト';
  await saveContent('test-only-token',data,original,async(url,options)=>{calls.push({url,options});return calls.length===1?current():{ok:true};});
  assert.equal(calls.length,2);assert.equal(calls[0].url,GITHUB_CONTENT_URL+'?ref=main');assert.equal(calls[1].url,GITHUB_CONTENT_URL);
  for(const {options} of calls){assert.equal(options.redirect,'error');assert.equal(options.credentials,'omit');assert.equal(options.cache,'no-store');assert.equal(options.referrerPolicy,'no-referrer');}
  const body=JSON.parse(calls[1].options.body);assert.equal(body.branch,'main');assert.equal(body.sha,'known-sha');assert.deepEqual(JSON.parse(Buffer.from(body.content,'base64').toString()),data);
});
for(const [name, response] of [['unauthorized',{ok:false,status:401}],['remote changed',current({...original,updates:[]})],['unverifiable remote',{ok:true,json:async()=>({sha:'sha'})}]]) {
 test(`never PUT when ${name}`,async()=>{let calls=0;await assert.rejects(saveContent('test-only-token',original,original,async()=>{calls++;return response;}));assert.equal(calls,1);});
}
test('invalid content never reaches network; write failures propagate',async()=>{
 let calls=0;await assert.rejects(saveContent('test-only-token',{},original,async()=>{calls++;}));assert.equal(calls,0);
 await assert.rejects(saveContent('test-only-token',original,original,async()=>++calls===1?current():{ok:false,status:409}),/409/);
});
