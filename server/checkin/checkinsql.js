var checkin = {
  checkinInsert: 'INSERT INTO `checkin` (`id`, `uid`, `time`, `lid`, `lat`, `lng`, `option`) VALUES (?, ?, ?, ?, ?, ?, ?)',
  checkinAll: 'select * from checkin',
  checkinByBound: 'select * from checkin where lat > ? and lat < ? and lng > ? and lng < ? limit 5000',
  checkinByLocationId: 'select * from checkin where lid=?',
  checkinTotalByuid: 'select count(id) as count from checkin where uid=?',
  checkinByUid: 'select * from checkin where uid=?',
  checkinByLid: 'select * from checkin where lid=?'
}

module.exports = checkin;
