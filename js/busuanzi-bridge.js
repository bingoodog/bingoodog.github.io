// 不蒜子新旧版本桥接
(function() {
  // 新版不蒜子 API 返回的 key → 旧版主题 HTML 中的元素 ID
  var mapping = {
    'busuanzi_site_pv':  { value: 'busuanzi_value_site_pv',  container: 'busuanzi_container_site_pv' },
    'busuanzi_site_uv':  { value: 'busuanzi_value_site_uv',  container: 'busuanzi_container_site_uv' },
    'busuanzi_page_pv':  { value: 'busuanzi_value_page_pv',  container: 'busuanzi_container_page_pv' }
  };

  // 创建隐藏元素接收新版不蒜子数据
  Object.keys(mapping).forEach(function(id) {
    var span = document.createElement('span');
    span.id = id;
    span.style.display = 'none';
    document.body.appendChild(span);
  });

  // 加载新版不蒜子
  var script = document.createElement('script');
  script.src = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js';
  script.defer = true;
  document.body.appendChild(script);

  // 轮询桥接：新版数据写入后，复制到旧版元素
  var attempts = 0;
  var timer = setInterval(function() {
    attempts++;
    var anyData = false;
    Object.keys(mapping).forEach(function(newId) {
      var newEl = document.getElementById(newId);
      if (!newEl || !newEl.innerText) return;
      anyData = true;

      var map = mapping[newId];
      var valueEl = document.getElementById(map.value);
      var containerEl = document.getElementById(map.container);

      if (valueEl) valueEl.innerText = newEl.innerText;
      if (containerEl) containerEl.style.display = 'inline';
    });
    if (anyData || attempts > 30) clearInterval(timer);
  }, 200);
})();