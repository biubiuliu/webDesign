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
          d_seconds < 60 ? `${d_seconds < 0 ? 0 : d_seconds}秒前` :
            d_days >= 3 && d_days < 30 ? `${M}-${D} ${H}:${m}` :
              d_days >= 30 ? `${Y}-${M}-${D} ${H}:${m}` : '' + timestamp;
  }