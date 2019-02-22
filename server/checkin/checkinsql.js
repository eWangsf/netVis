var checkin = {
  checkinInsert: 'INSERT INTO `checkin` (`id`, `uid`, `time`, `lid`, `lat`, `lng`, `option`) VALUES (?, ?, ?, ?, ?, ?, ?)',
  checkinAll: 'select * from checkin'
}

module.exports = checkin;
