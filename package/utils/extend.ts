export function extend(origin: any, deep: boolean) {
  // deep true  启动深拷贝
  // false  浅拷贝
  let obj: any = {};
  // 数组对象
  if (origin instanceof Array) {
    // true 数组  obj 就得是数组
    obj = [];
  }
  for (const key in origin) {
    const value = origin[key];
    // 确定value是不是引用型，前提是deep 是true
    obj[key] = !!deep && typeof value === 'object' && value !== null ? extend(value, deep) : value;
  }
  return obj;
}
