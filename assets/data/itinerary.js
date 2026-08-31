window.JDZ_ITINERARY_DATA = (() => {
  const days = [
    {
      d: 1,
      date: '周五',
      title: '上海到景德镇，晚到入住',
      km: '火车约 4h',
      drive: '高铁 + 打车',
      hotel: '景德镇假日酒店',
      booked: false,
      risk: '',
      coord: [29.316306, 117.240781],
      spotLevel: 'D',
      driveLevel: 'D',
      energyStart: 100,
      energyEnd: 88,
      energyNext: 95,
      energyStatus: 'safe',
      energyLabel: '轻松到达',
      spotLabel: '到达入住',
      driveLabel: '高铁到站后短驳酒店',
      driveBreakdown: [
        { label: '上海 → 景德镇北站', km: '约 4h', time: '19:00 出发，23:00+ 抵达' },
        { label: '北站 → 酒店', km: '约 5km', time: '约 15-25 分钟' }
      ],
      note: '周五只做到达、入住和简单晚饭，不再安排景点。'
    },
    {
      d: 2,
      date: '周六',
      title: '陶瓷博物馆、研究院、老城、陶溪川',
      km: '市内短转场',
      drive: '打车 + 步行',
      hotel: '景德镇假日酒店',
      booked: false,
      risk: '',
      coord: [29.29324, 117.17553],
      spotLevel: 'A',
      driveLevel: 'B',
      energyStart: 95,
      energyEnd: 68,
      energyNext: 88,
      energyStatus: 'watch',
      energyLabel: '主游览日，慢逛即可',
      spotLabel: '博物馆 + 研究院 + 老城',
      driveLabel: '以市内短转场为主',
      driveBreakdown: [
        { label: '酒店 → 中国陶瓷博物馆', km: '约 9km', time: '约 20-30 分钟' },
        { label: '博物馆 → 陶瓷研究院/新厂西路节点', km: '约 7-9km', time: '约 15-25 分钟' },
        { label: '老城 → 陶溪川', km: '约 2-4km', time: '约 10-15 分钟' }
      ],
      note: '周六主线建议：上午中国陶瓷博物馆，中段接陶瓷研究院/陶瓷大学新厂校区一带，再到御窑厂 / 陶阳里，最后陶溪川晚饭散步。'
    },
    {
      d: 3,
      date: '周日',
      title: '三宝村轻量补充，下午返沪',
      km: '市内 + 火车',
      drive: '打车 + 高铁',
      hotel: '无住宿',
      booked: false,
      risk: '',
      coord: [29.247141, 117.26534],
      spotLevel: 'B',
      driveLevel: 'B',
      energyStart: 88,
      energyEnd: 76,
      energyNext: 0,
      energyStatus: 'safe',
      energyLabel: '轻量收尾',
      spotLabel: '三宝村 + 返程缓冲',
      driveLabel: '上午轻量，下午返程',
      driveBreakdown: [
        { label: '酒店 → 三宝村', km: '约 8-10km', time: '约 20-30 分钟' },
        { label: '三宝村 → 北站', km: '约 12km', time: '约 25-35 分钟' }
      ],
      note: '周日只留半天，三宝村适合轻量慢逛，不要拖到下午。'
    }
  ];

  const spotDetails = {
    1: {
      name: '景德镇北站',
      summary: '高德命中站点名为“景德镇北站”，位置在高铁大道一侧。',
      time: '周五 23:00+ 抵达',
      tip: '出站后直接打车去酒店，不再绕路。'
    },
    2: {
      name: '景德镇假日酒店',
      summary: '高德命中酒店地址为昌江大道陶溪川文创孵化中心 A 座，坐标在陶溪川片区。',
      time: '周五晚入住 / 周六晚回酒店',
      tip: '酒店不在北站附近，应该按陶溪川片区来排晚饭与散步。'
    },
    3: {
      name: '中国陶瓷博物馆',
      summary: '高德命中地址为紫晶北路 1 号，是周六上午的主文化锚点。',
      time: '周六上午',
      tip: '优先保留完整停留时间，不要压缩成路过。'
    },
    4: {
      name: '景德镇陶瓷研究院 / 新厂西路节点',
      summary: '高德更稳定的命中是景德镇陶瓷研究院(新厂西路) / 中国轻工业陶瓷研究所一带，不建议继续写成模糊的“704所”。',
      time: '周六中段',
      tip: '把它作为博物馆之后、老城之前的过渡点更顺。'
    },
    5: {
      name: '御窑厂国家考古遗址公园',
      summary: '高德命中地址为珠山大道 1548 号，适合接午饭后的慢走。',
      time: '周六下午',
      tip: '老城段不要贪多，二选一或连着走即可。'
    },
    6: {
      name: '陶阳里咖啡点',
      summary: '高德命中更像是陶阳里附近的车轮咖啡 / 瑞幸 / 周边店，不建议继续把酒店当作咖啡点。',
      time: '周六下午 15:30-16:30',
      tip: '如果想喝咖啡，就把它插在老城到陶溪川之间。'
    },
    7: {
      name: '陶溪川文创街区',
      summary: '高德命中地址为里村街道新厂西路 351 号，是晚饭和散步最自然的收尾。',
      time: '周六晚上',
      tip: '这里适合吃饭、散步、看店铺和做轻量陶瓷选购。'
    },
    8: {
      name: '三宝国际陶艺村',
      summary: '高德命中为景德镇陶源谷·三宝旅游度假区·三宝国际陶艺村，适合周日上午轻量补充。',
      time: '周日上午',
      tip: '别把它拖到周日下午，否则返程会被挤压。'
    },
    9: {
      name: '陶溪川餐饮锚点',
      summary: '高德命中的餐饮点在陶溪川附近，说明晚饭可以直接在陶溪川片区解决。',
      time: '周六晚饭',
      tip: '晚饭后直接散步，不再跨区转场。'
    }
  };

  const routes = [
    {
      id: 'recommended',
      title: '推荐：博物馆 + 研究院 + 老城 + 陶溪川',
      score: 96,
      rest: 86,
      culture: 96,
      shopping: 84,
      text: '高德校正后，酒店在陶溪川片区，周六主线更适合“博物馆 → 新厂西路研究节点 → 御窑厂 / 陶阳里 → 陶溪川”这条顺向线。',
    },
    {
      id: 'relaxed',
      title: '轻松：博物馆 + 陶溪川',
      score: 82,
      rest: 94,
      culture: 84,
      shopping: 78,
      text: '更松但会牺牲老城完整度，适合临时想降强度时切换。',
    },
    {
      id: 'photo',
      title: '拍照：老城 + 三宝村',
      score: 70,
      rest: 78,
      culture: 68,
      shopping: 88,
      text: '拍照和买陶瓷更自由，但会弱化博物馆主线，不建议作为默认方案。',
    }
  ];

  const hotelCards = [
    { title: 'D1 周五｜景德镇假日酒店', body: '高德命中在昌江大道陶溪川文创孵化中心 A 座，适合作为陶溪川片区的夜间落点。', booked: false },
    { title: 'D2 周六｜景德镇假日酒店', body: '主游览日后回酒店最顺，晚上从陶溪川直接回住处。', booked: false },
    { title: 'D3 周日｜无住宿', body: '上午三宝村，午后取行李并返程。', booked: false }
  ];

  return { days, spotDetails, routes, hotelCards };
})();
