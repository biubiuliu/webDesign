
// 时间转化
export const convertTimeStamp = (timestamp) => {
    if (!timestamp) {
      timestamp = new Date().getTime();
    } else {
      timestamp = new Date(timestamp.replace(/-/g, '/').replace('T', ' ').replace('Z', '')).getTime();
    }
    let publishTime = timestamp / 1000,
      d_seconds,
      d_minutes,
      d_hours,
      d_days,
      timeNow = parseInt(new Date().getTime() / 1000),
      d,
      date = new Date(publishTime * 1000),
      Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    M = M < 10 ? '0' + M : M;
    D = D < 10 ? '0' + D : D;
    H = H < 10 ? '0' + H : H;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);
  
    return d_days > 0 && d_days < 3 ? `${d_days}天前` :
      d_days <= 0 && d_hours > 0 ? `${d_hours}小时前` :
        d_hours <= 0 && d_minutes > 0 ? `${d_minutes}分钟前` :
          d_seconds < 60 ? `刚刚` :
            d_days >= 3 && d_days < 30 ? `${M}-${D} ${H}:${m}` :
              d_days >= 30 ? `${Y}-${M}-${D} ${H}:${m}` : '' + timestamp;
  }

/**
 * @description:本地存储
 * @param key:存储的键值 
 * @param value:存储的内容
 */
export function setStorage(key,value){
    var curTime = new Date().getTime();
    localStorage.setItem(key,JSON.stringify({data:value,time:curTime}));
}

/**
 * @description:获取本地存储 没传时间默认1200分钟
 * @param key:存储的键值 
 * @param exp:过期时间  1秒 1000  1分1000*60  1小时 1000*60*60 以此类推
 */
export function getStorage(key,exp){
    var data = localStorage.getItem(key);
    var dataObj = JSON.parse(data);
    var outTime = exp?exp:1000*60*1200;
    if(!dataObj){
      return null
    }
    if (new Date().getTime() - dataObj.time>outTime) {
      return null
    }
    
    var dataObjDatatoJson = dataObj.data;
    return dataObjDatatoJson;
}

/**
 * @description:删除本地存储
 * @param key:存储的键值 
 */
export function delStorage(key){
    localStorage.removeItem(key);
}

// 手机号掩码
export function mobilePhoneMask(tel) {
  var output = tel;
  if (tel == null || tel == "")
      return output;
  output = tel;
  if (tel.length > 6) {
      output = tel.substr(0, 3) + "*****" + tel.substr(tel.length - 3);
  }
  else if (tel.length > 3) {
      output = tel.substr(0, 3) + "*****";
  }
  else if (tel.length > 0) {
      output = tel.substr(0, 1) + "*****";
  }
  return output;
}
