// 引入Mock文件，由于 Vite 不支持require()方法所以改用import
import * as Mock from 'mockjs'
// 模拟返回的数据格式，可以自己随便定义
const result = {
    status: 200,
    reset: '0',
    message: 'success',
    data: {
        'list|6': [{
            'id|+1': 1,
            'name': '@cname',
            'age|20-40': 20,
        }]
    }
}
// 用mock拦截对应的请求地址，并发送返回数据对象（这里以正则来匹配带有api/的请求地址）
const responseData = Mock.mock(/api\//, 'get', result)
// 导出返回对象，可以导出多个对象
export default responseData