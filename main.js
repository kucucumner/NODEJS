const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html')

const app = http.createServer(function(request,response){
  let _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  
  
  // 만약에 접속이 /(루트)라면 아래 코드 실행
  if(pathname === '/'){
    if(queryData.id === undefined){

        fs.readdir('./data', function(err, filelist){

          let title = 'Welcome';
        var description = 'Hello NODE.js';
        const list = template.list(filelist);
        const html = template.html(title, list, 
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        
        response.writeHead(200);
        response.end(html);
        })
        
    } else{
      fs.readdir('./data', function(err, filelist){
      const filterdID = path.parse(queryData.id).base;
      fs.readFile(`data/${filterdID}`, 'utf-8', function(err, description){
        let title = queryData.id;
        const sanitizeTitle = sanitizeHtml(title);
        const sanitizeDescription = sanitizeHtml(description);
        const list = template.list(filelist);
        const html = template.html(title, list, 
          `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
          `<a href="/create">create</a> 
           <a href="/update?id=${sanitizeTitle}">update</a>
           <form action="delete_process" method="post" onsubmit="삭제하시겠습니까?">
              <input type="hidden" name="id" value="${sanitizeTitle}">
              <input type="submit" value="delete">
           </form>`
        );
        
        response.writeHead(200);
        response.end(html);
      });
    });
    }
  
    
   } else if(pathname === '/create'){
    fs.readdir('./data', function(err, filelist){

      let title = 'WEB - create';
    const list = template.list(filelist);
    const html = template.html(title, list,
       `<form action="/create_process"
       method="post">
       <input type="text" name="title" placeholder="title"></p>
       <p>
           <textarea name="description" placeholder="description"></textarea>
       </p>
       <p>
           <input type="submit">
       </p>
       </form>`,
      '');
    
    response.writeHead(200);
    response.end(html);
    })
   
  } else if(pathname === '/create_process'){
    let body = '';

    request.on('data', function(data){
      body = body + data;
      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end', function(){
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end('success');
      })
    });
    
  } else if(pathname === '/update'){
    fs.readdir('./data', function(err, filelist){
      const filterdID = path.parse(queryData.id).base;
      fs.readFile(`data/${filterdID}`, 'utf-8', function(err, description){
        let title = queryData.id;
        const list = template.list(filelist);
        const html = template.html(title, list, 
          `<form action="/update_process"
          method="post">
          <input type="hidden" name="id" value="${title}">
          <input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
              <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
              <input type="submit">
          </p>
          </form>`
          
          ,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        
        response.writeHead(200);
        response.end(html);
      });
    });
  }else if(pathname === '/update_process'){
    let body = '';

    request.on('data', function(data){
      body = body + data;
      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end', function(){
      const post = qs.parse(body);
      const id = post.id
      const title = post.title;
      const description = post.description;
      fs.rename(`data/${id}`,`data/${title}`, function(err){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      });
    });
  } 
  else if(pathname === '/delete_process'){
    let body = '';

    request.on('data', function(data){
      body = body + data;
      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end', function(){
      const post = qs.parse(body);
      const id = post.id
      const filterdID = path.parse(id).base;
      fs.unlink(`data/${filterdID}`, function(err){
        response.writeHead(302, {Location: `/`});
        response.end();
      })
    });
  } else{
    response.writeHead(404);
    response.end('Not found');
  }
  
});
app.listen(3000);
