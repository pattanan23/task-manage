const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000 // 🔹 เปลี่ยนจาก 8080 เป็น 3000 หรือพอร์ตที่ต้องการ
  }
})
