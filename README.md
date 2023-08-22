## 开发

```bash
# 克隆项目
git clone http://192.168.10.37:1080/whale-front/whale-admin-web.git

# 进入项目目录
cd whale-admin-web

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 访问

``` url
# 测试
http://172.20.0.20:8870

# 生产
https://admin.parfectworld.com
```
