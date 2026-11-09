var CACHE='oj-shell-v1';
var SHELL=['/','/index.html','/manifest.json','/icon-192.png','/icon-512.png'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL)}).catch(function(){}));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('message',function(e){
  if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});

function net(r){
  return new Promise(function(ok,no){
    var t=setTimeout(function(){no(new Error('slow'))},6000);
    fetch(r).then(function(x){clearTimeout(t);ok(x)},function(x){clearTimeout(t);no(x)});
  });
}

self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url);

  /* Firebase SDK files are versioned and static: cache first so the app can start offline */
  if(u.hostname==='www.gstatic.com'&&u.pathname.indexOf('/firebasejs/')===0){
    e.respondWith(caches.match(r).then(function(m){
      return m||fetch(r).then(function(res){
        var c=res.clone();caches.open(CACHE).then(function(ch){ch.put(r,c)});return res;
      });
    }));
    return;
  }

  /* Everything else outside this site (Firestore, Auth, Google) is never touched */
  if(u.origin!==location.origin)return;

  /* App files: network first, saved copy as fallback */
  e.respondWith(
    net(r).then(function(res){
      if(res&&res.ok&&res.type==='basic'){var c=res.clone();caches.open(CACHE).then(function(ch){ch.put(r,c)})}
      return res;
    }).catch(function(){
      return caches.match(r,{ignoreSearch:true})
        .then(function(m){return m||caches.match('/index.html')})
        .then(function(m){return m||caches.match('/')});
    })
  );
});

self.addEventListener('notificationclick',function(e){
  e.notification.close();
  var cid=(e.notification.data&&e.notification.data.cid)||'';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(l){
    if(l.length){var c=l[0];if(cid)c.postMessage({type:'open',cid:cid});return c.focus()}
    return clients.openWindow('/'+(cid?'?open='+encodeURIComponent(cid):''));
  }));
});
