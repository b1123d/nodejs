function _sum(a,b){
  return a+b;
}
function _avg(a,b){
  return a/b;
}
module.exports.sum = function(a, b){
  return _sum(a,b);
}
module.exports.avg = function(a, b){
  return _avg(a,b);
}
