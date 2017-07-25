# steamer-plugin-mock

steamer-plugin-mock 是用于快速给您的steamer项目添加本地mock假数据的功能，可以用于模拟后台接口进行测试。

使用的库有[json-server](https://www.npmjs.com/package/json-server#module)和[faker](https://github.com/marak/Faker.js/)

* 提示：请先确保您已安装steamerjs https://github.com/steamerjs/steamerjs

# 使用

### 用默认的文件快速搭建一个mock服务器
```javascript
steamer mock
```
此插件会为您自动生成`mock`目录并在此目录生成一个默认的`db.js`文件。然后运行json-server在`6800`端口上。
您之后可以修改`db.js`来完成您自己的mock需求。

### 使用指定文件搭建mock服务器
```javascript
steamer mock --config xxx.js/xxx.json
```
此插件会使用`--config`参数所指定的文件运行json-server。
* 注意：如果使用js文件，您必须`export`一个Object对象。

### 修改Webpack配置
请确定`steamer.config.js`中有`"api": "//localhost:6800/"`
* TODO: 这里还需要Steamer本身的支持，在`server.js`中添加对`api`路径的代理转发

# 说明
json-server根据传入的`Object`或者`JSON`文件的key作为API路径，值则作为返回的结果。

[faker](https://github.com/marak/Faker.js/)是用于快速生成假数据的库，包括常用的头像、邮箱、电话号码等信息，推荐使用。

想了解更多关于json-server的配置，请访问https://github.com/typicode/json-server