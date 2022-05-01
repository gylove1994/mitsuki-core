import 'reflect-metadata';

//获取元信息，如果元信息未定义则抛出异常
export function getMetaAndThrow<T = any>(
  metaKey: string,
  target: Object,
  info?: string,
): T;
export function getMetaAndThrow<T = any>(
  metaKey: Symbol,
  target: Object,
  info?: string,
): T;
export function getMetaAndThrow<T = any>(
  metaKey: string | Symbol,
  target: Object,
  info?: string,
): T {
  const meta = Reflect.getMetadata(metaKey, target);
  if (meta == undefined)
    throw new Error(
      '未获取到对应的的元信息\ninfo = ' +
        info +
        '\nmetaKey =' +
        metaKey +
        '\ntarget=' +
        target +
        '\n',
    );
  return meta as T;
}

//判断传入的函数是不是构造函数
export function isConstructor(f: Function) {
  try {
    Reflect.construct(String, [], f);
  } catch (e) {
    return false;
  }
  return true;
}

//判断传入的参数是不是函数
export function isFunction(f: any) {
  if (typeof f == 'function') return true;
  return false;
}

