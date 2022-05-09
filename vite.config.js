import vue from '@vitejs/plugin-vue'

export default {
    base: './',
    plugins: [vue()],
    optimizeDeps: {
        include: ['schart.js']
    },
    // 反向代理
    proxy: {
        '/api': {
            target: 'http://localhost:7474/',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '')
        }
    }
}

