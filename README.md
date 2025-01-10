# 🚀 X Summary Chrome 扩展

> 📝 一键生成 X 推文和搜索结果的智能摘要助手，让信息获取更轻松高效！

## ✨ 主要特性

- 🎯 一键总结当前搜索页面内容
- ⚙️ 支持自定义 OpenAI 接口地址
- 🎨 简洁优雅的用户界面
- ⚡ 快速高效的内容处理

## 📦 安装指南

1. 🌐 打开 Chrome 浏览器
2. 🔧 进入扩展管理页面 (chrome://extensions/)
3. 👨‍💻 启用开发者模式
4. ➕ 点击"加载已解压的扩展程序"
5. 📁 选择本项目文件夹

## 🎮 使用方法

1. 🔍 点击浏览器工具栏中的扩展图标
2. 🔑 输入 OpenAI API Key（必填）
3. 🌍 输入自定义的 OpenAI 接口地址（可选）
4. 🖱️ 在 X 推文或搜索结果列表中点击"生成总结"按钮
5. ✨ 等待处理完成后查看摘要结果

## 🛠️ 项目目录

本扩展基于 Chrome Extension Manifest V3 开发，主要文件结构：

```
📦 x-summary
 ├── 📄 manifest.json   - 扩展配置文件
 ├── 📄 background.js   - 后台服务脚本
 ├── 📄 content.js      - 内容注入脚本
 ├── 📄 popup.html      - 弹出窗口界面
 ├── 📄 popup.js        - 弹出窗口脚本
 ├── 📄 options.html    - 设置页面界面
 ├── 📄 options.js      - 设置页面脚本
 ├── 📄 generate_icons.py - 图标生成脚本
 └── 📂 icons           - 扩展图标资源
     ├── 📄 icon.svg    - 原始 SVG 图标
     ├── 📄 icon16.png  - 16x16 图标
     ├── 📄 icon48.png  - 48x48 图标
     └── 📄 icon128.png - 128x128 图标
```

## 📝 开源协议

[MIT](LICENSE) 