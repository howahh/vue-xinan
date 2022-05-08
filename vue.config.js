module.exports = {
  devServer: {
    proxy: {
      "/api2": {
        // 匹配所有以 '/api1'开头的请求路径
        target: "http://localhost:7474", // 代理目标的基础路径
        changeOrigin: true,
        pathRewrite: { "^/api2": "" }, //将api1替换为空，如果不写，则服务器收到的请求是/api1/student,但服务器想要收到的请求是/student
      },
    },
  },
};
