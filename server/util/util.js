
module.exports = {
    extend: function(target, source, flag) {
        for(var key in source) {
            if(source.hasOwnProperty(key))
                flag ?
                    (target[key] = source[key]) :
                    (target[key] === void 0 && (target[key] = source[key]));
        }
        return target;
    },
    mapLocations: function (locations) {
        locations = locations.map(item => {
            return {
              id: item.id,
              lat: +item.lat,
              lng: +item.lng,
              weight: +item.weight
            }
          })
        return locations;
    }
}
