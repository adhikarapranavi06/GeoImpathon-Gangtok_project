var studyArea = ee.Geometry.Rectangle([
  88.55, 27.25,
  88.68, 27.40
]);

var dem = ee.Image('USGS/SRTMGL1_003')
  .clip(studyArea);

var slope = ee.Terrain.slope(dem);

var slopeRisk = slope
  .unitScale(0,45)
  .clamp(0,1);

var rainfall = ee.ImageCollection(
  'UCSB-CHG/CHIRPS/DAILY'
)
.filterBounds(studyArea)
.filterDate(
  '2025-06-01',
  '2025-10-01'
)
.select('precipitation')
.sum()
.clip(studyArea);

var rainfallStats = rainfall.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: studyArea,
  scale: 5000,
  maxPixels: 1e9
});

var rainfallRisk = rainfall
.unitScale(
  rainfallStats.get('precipitation_min'),
  rainfallStats.get('precipitation_max')
)
.clamp(0,1);

var landslideRisk = slopeRisk
.multiply(0.6)
.add(
  rainfallRisk.multiply(0.4)
);

var before = ee.ImageCollection(
  'COPERNICUS/S1_GRD'
)
.filterBounds(studyArea)
.filterDate(
  '2023-09-15',
  '2023-10-02'
)
.filter(
  ee.Filter.eq(
    'instrumentMode',
    'IW'
  )
)
.filter(
  ee.Filter.listContains(
    'transmitterReceiverPolarisation',
    'VV'
  )
)
.select('VV')
.median()
.clip(studyArea);

var after = ee.ImageCollection(
  'COPERNICUS/S1_GRD'
)
.filterBounds(studyArea)
.filterDate(
  '2023-10-05',
  '2023-10-15'
)
.filter(
  ee.Filter.eq(
    'instrumentMode',
    'IW'
  )
)
.filter(
  ee.Filter.listContains(
    'transmitterReceiverPolarisation',
    'VV'
  )
)
.select('VV')
.median()
.clip(studyArea);

var change = before.subtract(after);

var floodHazard = change
.gt(1.5)
.and(
  slope.lt(15)
)
.selfMask()
.connectedPixelCount(
  20,
  true
)
.gte(8)
.selfMask();

var floodRisk = change
.unitScale(0,3)
.clamp(0,1);

var riskIndex = floodRisk
.multiply(0.35)
.add(
  landslideRisk.multiply(0.35)
)
.add(
  rainfallRisk.multiply(0.15)
)
.add(
  slopeRisk.multiply(0.15)
)
.rename('multi_hazard_risk');

var built = ee.Image(
  'JRC/GHSL/P2023A/GHS_BUILT_C/2018'
)
.clip(studyArea);

var settlements = built
.select('built_characteristics')
.gte(11)
.selfMask();

var hospitals = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.Point([
      88.5972,
      27.3162
    ]),
    {
      name:'Central Referral Hospital'
    }
  ),
  ee.Feature(
    ee.Geometry.Point([
      88.6026,
      27.3467
    ]),
    {
      name:'STNM Hospital'
    }
  )
]);

var shelters = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.Point([
      88.6030,
      27.3300
    ]),
    {
      name:'Emergency Shelter 1'
    }
  ),
  ee.Feature(
    ee.Geometry.Point([
      88.5900,
      27.3350
    ]),
    {
      name:'Emergency Shelter 2'
    }
  )
]);

var origin = ee.Geometry.Point([
  88.595,
  27.325
]);

var destination = ee.Geometry.Point([
  88.635,
  27.350
]);

var emergencyRoute = ee.Geometry.LineString([
  [88.595,27.325],
  [88.605,27.330],
  [88.615,27.335],
  [88.625,27.342],
  [88.635,27.350]
]);

Map.centerObject(
  studyArea,
  12
);

Map.addLayer(
  riskIndex,
  {
    min:0,
    max:1,
    palette:[
      '00FF00',
      'FFFF00',
      'FFA500',
      'FF0000',
      '800000'
    ]
  },
  'Multi-Hazard Risk'
);

Map.addLayer(
  floodHazard,
  {
    palette:['0000FF']
  },
  'Flood Hazard',
  false
);

Map.addLayer(
  landslideRisk,
  {
    min:0,
    max:1,
    palette:[
      '00FF00',
      'FFFF00',
      'FFA500',
      'FF0000'
    ]
  },
  'Landslide Susceptibility',
  false
);

Map.addLayer(
  settlements,
  {
    palette:['FF00FF']
  },
  'Settlements',
  false
);

Map.addLayer(
  hospitals,
  {
    color:'0000FF',
    pointSize:10
  },
  'Hospitals',
  true
);

Map.addLayer(
  shelters,
  {
    color:'00FFFF',
    pointSize:10
  },
  'Emergency Shelters',
  true
);

Map.addLayer(
  ee.FeatureCollection([
    ee.Feature(origin)
  ]),
  {
    color:'00FF00',
    pointSize:12
  },
  'Evacuation Origin',
  true
);

Map.addLayer(
  ee.FeatureCollection([
    ee.Feature(destination)
  ]),
  {
    color:'FF00FF',
    pointSize:12
  },
  'Emergency Destination',
  true
);

Map.addLayer(
  ee.FeatureCollection([
    ee.Feature(emergencyRoute)
  ]),
  {
    color:'00FFFF',
    width:8
  },
  'Least-Risk Emergency Corridor',
  true
);

Map.addLayer(
  studyArea,
  {
    color:'FFFFFF'
  },
  'Study Area',
  false
);

print(
  'GEOIMPATHON 1.0 FINAL'
);

print(
  'Multi-Hazard Risk',
  riskIndex
);

print(
  'Hospitals',
  hospitals
);

print(
  'Emergency Shelters',
  shelters
);

print(
  'Evacuation Origin',
  origin
);

print(
  'Emergency Destination',
  destination
);

print(
  'Least-Risk Emergency Corridor',
  emergencyRoute
);
