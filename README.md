# Koa Api
个人项目中使用到的restful api接口
## Api返回状态说明
|状态码|含义|说明|
|-----|---|---|
|200|OK|请求成功|
|201|CREATED|创建成功|
|202|ACCEPTED|更新成功|
|400|BAD REQUEST|请求的地址不存在或者包含不支持的参数|
|401|UNAUTHORIZED|未授权|
|403|FORBIDDEN|被禁止访问|
|404|NOT FOUND|请求的资源不存在|
|500|INTERNAL SERVER ERROR|内部错误|
### 发生错误时，HTTP Status Code为4xx
错误格式
```
{
 "msg":"uri_not_found",
 "code":1001
}
```
