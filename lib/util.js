// 静态方法存放

// 遍历筛选某个类型 数据属性 返回数组 传参属性如下：
// instance 类型
// prefix 指定前缀
// specifiedType 指定类型
// filter 过滤条件
// 返回数组
// const findMembers = function (instance ,{
//     prefix,
//     specifiedType,
//     filter
// }) {
//     // 递归
//     function _find(instance) {
//         if (instance._proto_ ===null){
//             return []
//         }
//         let names = Reflect.ownKeys(instance) // 参考es6 Reflect 此方法会返回一个数组，此数组中包含有参数对象自有属性名称。
//         names = names.filter((name)=>{ // filter过滤数组中不符合条件的属性并返回一个数组
//             // 过滤不满足条件的属性方法名
//             return shouldKeep(name) 
//         })

//         return[...name, ...find(instance._proto_)]
//     }
//     // 过滤条件
//     function shouldKeep(value){
//         if(filter) {
//             if(filter(value)){
//                 return true
//             }
//         }
//         if(prefix){ //String.StartsWith 方法指定字符串是否以目标前缀开始，返回布尔值
//             if(value.startsWith(value)){
//                 return true
//             }
//         }
//         if(specifiedType){
//             if(instance[value] instanceof specifiedType)
//             return true
//         }
//     }
    
//     return _find(instance)
// }
const findMembers = function (instance, {
    prefix,
    specifiedType,
    filter
  }) {
    // 递归函数
    function _find(instance) {
      //基线条件（跳出递归）
      if (instance.__proto__ === null)
        return []
  
      let names = Reflect.ownKeys(instance)
      names = names.filter((name) => {
        // 过滤掉不满足条件的属性或方法名
        return _shouldKeep(name)
      })
  
      return [...names, ..._find(instance.__proto__)]
    }
  
    function _shouldKeep(value) {
      if (filter) {
        if (filter(value)) {
          return true
        }
      }
      if (prefix)
        if (value.startsWith(prefix))
          return true
      if (specifiedType)
        if (instance[value] instanceof specifiedType)
          return true
    }
  
    return _find(instance)
  }
module.exports = {
    findMembers
}
