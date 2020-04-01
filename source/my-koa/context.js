const proto = {};

function delegrateGet(type, prop) {
  proto.__defineGetter__(prop, function() {
    return this[type][prop]
  })
}

function delegrateSet(type, prop) {
  proto.__defineSetter__(prop, function(data) {
    this[type][prop] = data;
  })
}

const requestGetArray = ['query'];
const requestSetArray = [];
const responseGetArray = ['body', 'status'];
const responseSetArray = ['body', 'status'];

requestGetArray.forEach(prop => {
  delegrateGet('request', prop);
})

requestSetArray.forEach(prop => {
  delegrateSet('request', prop);
})

responseGetArray.forEach(prop => {
  delegrateGet('response', prop);
})

responseSetArray.forEach(prop => {
  delegrateSet('response', prop);
})

module.exports = proto;