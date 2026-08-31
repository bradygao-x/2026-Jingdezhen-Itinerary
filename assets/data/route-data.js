window.JDZ_ROUTE_DATA = (() => {
  const routeSegments = [
    {
      from: 'D1',
      to: 'D2',
      a: [29.339669, 117.242517],
      b: [29.316306, 117.240781],
      km: '约 4.8km',
      fallbackPath: [[29.339669, 117.242517], [29.316306, 117.240781]]
    },
    {
      from: 'D2A',
      to: 'D2B',
      a: [29.316306, 117.240781],
      b: [29.29324, 117.17553],
      km: '约 8.9km',
      fallbackPath: [[29.316306, 117.240781], [29.29324, 117.17553]]
    },
    {
      from: 'D2B',
      to: 'D2C',
      a: [29.29324, 117.17553],
      b: [29.295184, 117.206979],
      km: '约 3.0km',
      fallbackPath: [[29.29324, 117.17553], [29.295184, 117.206979]]
    },
    {
      from: 'D2C',
      to: 'D2D',
      a: [29.295184, 117.206979],
      b: [29.296921, 117.236957],
      km: '约 2.3km',
      fallbackPath: [[29.295184, 117.206979], [29.296921, 117.236957]]
    },
    {
      from: 'D3A',
      to: 'D3B',
      a: [29.316306, 117.240781],
      b: [29.247141, 117.26534],
      km: '约 7.7km',
      fallbackPath: [[29.316306, 117.240781], [29.247141, 117.26534]]
    },
    {
      from: 'D3B',
      to: 'D3C',
      a: [29.247141, 117.26534],
      b: [29.339669, 117.242517],
      km: '约 12.1km',
      fallbackPath: [[29.247141, 117.26534], [29.339669, 117.242517]]
    }
  ];

  const getSegmentPath = segment => (
    Array.isArray(segment.path) && segment.path.length >= 2
      ? segment.path
      : segment.fallbackPath
  );
  const roadRoute = routeSegments.flatMap((segment, index) => {
    const path = getSegmentPath(segment);
    return index === 0 ? path : path.slice(1);
  });

  return { routeSegments, roadRoute };
})();
