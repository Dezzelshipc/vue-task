const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        win: {
          appId: "vue-task",
          target: "NSIS",
          icon: "./public/folder.png",
        },
        nsis: {
          installerIcon: "./public/folder.ico",
          uninstallerIcon: "./public/folder.ico",
          uninstallDisplayName: "vue-task uninstaller",
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        },
        productName: "Rerolpxe",
      }
    }
  }
})
