# steamer-plugin-mock

快速添加本地 mock 假数据命令。可以用于模拟后台接口进行测试。本项目的服务器是基于 [JSON-Server](https://github.com/typicode/json-server) 进行搭建。与服务器相关的路由、转发相关，可参考 [JSON-Server](https://github.com/typicode/json-server) 的文档。

## 安装
```javascript
npm i -g steamerjs

npm i -g steamer-plugin-mock
```

## 使用

```javascript
steamer mock
```

此插件会为您在项目中自动生成 `mock` 目录并在此目录生成一个默认的 `db.js` 文件。然后运行 [JSON-Server](https://github.com/typicode/json-server) 在 `6800` 端口上。
您之后可以修改`db.js`来完成您自己的mock需求。

效果如图：
![](https://github.com/steamerjs/steamer-plugin-mock/blob/master/example.jpg)


## 在 steamer 脚手架中使用
如果你想在 [steamer 系列脚手架](https://steamerjs.github.io/docs/Starterkit.html)中使用，`steamer-plugin-mock` 的功能，可以设置 `config/steamer.config.js` 中 `"api-port": 6800` 的端口。


## 路由说明
[JSON-Server](https://github.com/typicode/json-server) 服务器根据传入的`Object`或者`JSON`文件的key作为API资源路径，值则作为返回的结果。
[JSON-Server](https://github.com/typicode/json-server) 服务器完全支持`RESTful`的路由，如

* 获取第一个用户
```
GET /users/1
```

* 分页
```
GET /users?_pages=7
```

* 筛选
```
GET /users?id=2
```

* 排序
```
GET /users?_sort=id&_order=asc
```

## 参数说明
### `--config`
```javascript
steamer mock --config xxx.js/xxx.json
```
此插件会使用`--config`参数所指定的文件运行json-server。
* 注意：如果使用js文件，您必须`export`一个Object对象。

### `--port`
```
steamer mock --port 8888
```
使用指定端口运行json-server

### `--route`
```
steamer mock --route route.json
```
使用指定自定义配置来自定URL，比如当您遇到一下场景

1. 真正想访问的接口资源url是`api/xxx`，需要转发到[JSON-Server](https://github.com/typicode/json-server)
2. 想通过`/posts/:category`的方式访问博客文章的不同类别

您可以如下配置：
* 示例文件
```json
{
  "/api/*": "/$1",
  "/posts/:category": "/posts?category=:category"
}
```
效果如下
```
/api/posts # → /posts
/api/posts/1  # → /posts/1
/posts/javascript # → /posts?category=javascript
```


## 推荐使用的假数据生成库
* [Faker](https://github.com/marak/Faker.js/) 是用于快速生成假数据的库，包括常用的头像、邮箱、电话号码等信息，推荐使用。
* [Mock](http://mockjs.com/) 同样是生成随机数据的库，并且能生成常用的随机汉字。