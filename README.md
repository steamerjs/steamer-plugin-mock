# steamer-plugin-mock

steamer-plugin-mock 是用于快速给您的steamer项目添加本地mock假数据的功能，可以用于模拟后台接口进行测试。

使用的库有[json-server](https://www.npmjs.com/package/json-server#module)和[faker](https://github.com/marak/Faker.js/)

* 提示：请先确保您已安装steamerjs https://github.com/steamerjs/steamerjs

# 使用

```javascript
steamer mock
```
此插件会为您自动生成`mock`目录并在此目录生成一个默认的`db.js`文件。然后运行json-server在`6800`端口上。
您之后可以修改`db.js`来完成您自己的mock需求。

效果如图：
![](https://github.com/steamerjs/steamer-plugin-mock/blob/master/example.jpg)

<details>
# 路由说明
json-server根据传入的`Object`或者`JSON`文件的key作为API资源路径，值则作为返回的结果。
json-server完全支持`RESTful`的路由，如

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

# 参数说明
## `--config`
```javascript
steamer mock --config xxx.js/xxx.json
```
此插件会使用`--config`参数所指定的文件运行json-server。
* 注意：如果使用js文件，您必须`export`一个Object对象。

## `--port`
```
steamer mock --port 8888
```
使用指定端口运行json-server

## `--route`
```
steamer mock --route route.json
```
使用指定自定义配置来自定URL，比如当您遇到一下场景

1. 真正想访问的接口资源url是`api/xxx`，需要转发到json-server
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

# 代理转发
可以设置`steamer.config.js`中`"api": "//localhost:<port>/"`
将后台接口转发到json-server

</details>
[faker](https://github.com/marak/Faker.js/)是用于快速生成假数据的库，包括常用的头像、邮箱、电话号码等信息，推荐使用。
[Mock](http://mockjs.com/)同样是生成随机数据的库，并且能生成常用的随机汉字。

想了解更多关于json-server的配置，请访问https://github.com/typicode/json-server