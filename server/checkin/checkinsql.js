var checkin = {
  checkinInsert: 'INSERT INTO `checkin` (`id`, `uid`, `time`, `lid`, `lat`, `lng`, `option`) VALUES (?, ?, ?, ?, ?, ?, ?)',
  checkinAll: 'select * from checkin',
  checkinByBound: 'select * from checkin where lat > ? and lat < ? and lng > ? and lng < ?'
}

module.exports = checkin;
