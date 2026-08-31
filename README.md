# 景德镇周末交互路书

这是一份按新疆十一自驾工程风格重构的景德镇周末地图页。

## 结构

- `index.html`：主入口
- `assets/css/app.css`：样式
- `assets/data/itinerary.js`：日程、酒店、景点说明
- `assets/data/route-data.js`：路线段与点位
- `assets/js/app.js`：地图、marker、路线、交互
- `amap_route_server.py`：本地高德路线代理

## 高德数据

这版已经按高德返回的实际 POI 和路线结果更新了：

- 景德镇北站
- 景德镇假日酒店（昌江大道陶溪川文创孵化中心 A 座）
- 中国陶瓷博物馆
- 景德镇陶瓷研究院 / 新厂西路节点
- 御窑厂国家考古遗址公园
- 陶阳里咖啡点
- 陶溪川文创街区
- 三宝国际陶艺村

## 本地运行

如果要加载本地 `/amap-driving` 路线代理：

```bash
export AMAP_WEB_KEY="你的高德 Key"
python3 amap_route_server.py
```

然后打开：

```text
http://127.0.0.1:8765/10_个人/旅行规划/2026-景德镇周末放松/index.html
```

如果不启动代理，也可以直接打开静态页面查看已写入的路线备份。
