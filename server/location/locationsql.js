var location = {
  getLocationByPageSizeAndOffset: 'select * from location where weight > 0 limit ? offset ?',
  getLocationInBound: 'select * from location where lat > ? and lat < ? and lng > ? and lng < ? and weight > 0 limit 10',
  getHotspots: 'select * from location order by weight desc limit 10'
}

module.exports = location;
