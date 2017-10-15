# Koa Api
个人项目中使用到的restful api接口
## Api response status codes说明
| 状态码  | 含义                    | 说明                 |
| ---- | --------------------- | ------------------ |
| 200  | OK                    | 请求成功               |
| 201  | CREATED               | 创建成功               |
| 202  | ACCEPTED              | 更新成功               |
| 204  | NO CONTENT            | 删除成功               |
| 400  | BAD REQUEST           | 请求的地址不存在或者包含不支持的参数等等 |
| 401  | UNAUTHORIZED          | 未授权                |
| 403  | FORBIDDEN             | 被禁止访问              |
| 404  | NOT FOUND             | 请求的资源不存在           |
| 500  | INTERNAL SERVER ERROR | 服务器内部错误            |
## 发生错误时，HTTP Status Code为4xx时
响应格式为
```
{
  code: 1000,
  msg:"uri_not_found"
}
```
## 通用错误码
| 状态码 code  | 错误信息         | 含义     | status code |
| ---- | --------- | --------- | ------------ |
| 1000  | UNAUTHORIZED | 没有权限 | 401 |
| 1001  | jwt expired etc | 无效的token | 401 |
| 1002  | missing/invalid args | 参数缺失/无效 | 400 |
| 1003  | user not found | 用户不存在 | 400 |
| 1004  | wrong password | 密码错误 | 400 |
| 1005  | username already exists | 用户名已存在 | 400 |
| 1006  | uri/something not found | 资源不存在 | 404 |
| 1007  | update failed | 更新资源失败 | 400 |
| 1008  | create failed | 创建资源失败 | 400 |
| 1009  | email has been used | 邮箱已被注册使用 | 400 |
