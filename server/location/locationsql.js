var location = {
  locationInsert: 'INSERT INTO `location` (`id`, lat`, `lng`) VALUES (?, ?, ?)',
  locationById: 'select * from checkin where lid=? limit 1;'
}

module.exports = location;
