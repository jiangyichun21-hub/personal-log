# 经验教训

历史上使用本 Skill 过程中遇到的问题总结与解法。在执行每个 Phase 前，先查阅对应章节，避免重复踩坑。

---

## Phase 1: 需求收集

暂无

---

## Phase 2: 方案设计

暂无

---

## Phase 3: 代码生成

暂无

---

## Phase 4: 持续迭代

暂无

---

## 数据源对接

### Cloud DB

- **问题**: Supabase Storage 上传文件报 `400 No content provided`
  - **场景**: 使用 `supabase.storage.upload()` 直接传递 `File` 或 `Blob` 对象
  - **原因**: WebContainer 环境中不支持直接传递 File/Blob 对象，会导致请求体为空
  - **解法**: 上传前先将文件转为 ArrayBuffer，再传给 `.upload()`
    ```typescript
    const arrayBuffer = await file.arrayBuffer();
    supabase.storage.upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });
    ```
  - **影响范围**: 所有涉及 Supabase Storage 文件上传的 service 和组件

### ODPS

暂无

### HSF

暂无

### HTTP

暂无

---

## 工程规范相关

- **约束**: 编写 webpack config 时，不要使用热更新相关配置（如 HMR / websocket）
  - **原因**: 热更新相关能力容易引发不稳定问题，在 `onedayAssets` 里采用非热更新方式更稳

- **Webpack + Babel + TypeScript 项目 JSX 配置规范**
  - **强制**: `@babel/preset-react` 必须显式声明 `runtime: 'automatic'`
  - **不允许**: 依赖 `tsconfig.json` 的 `"jsx": "react-jsx"` 来省略 `import React`，它在 Webpack 项目中对运行时无效
  - **不允许**: `@babel/preset-react` 使用默认配置（即不写 `runtime` 字段）
  - **正确示例配置 (`webpack.config.js`)**:
    ```javascript
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
      mode: 'development',
      entry: './src/index.tsx',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-react', { runtime: 'automatic' }],
                  '@babel/preset-env',
                  '@babel/preset-typescript',
                ],
              },
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
      devServer: {
        port: 3133,
        allowedHosts: ['all', '.alibaba-inc.com'],
        historyApiFallback: {
          index: '/index.html',
          rewrites: [{ from: /^\/_p\/\d+\//, to: '/index.html' }],
        },
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './index.html',
          inject: 'body',
        }),
      ],
    };
    ```

- **约束**: 不要在 `index.html` 里加入任何外部字体引用（例如 `<link rel="preconnect" href="https://fonts.googleapis.com" />`、Google Fonts 或其它字体 CDN 的 `<link>`）
  - **原因**: 外部字体会依赖额外域名与网络请求，在受限环境或资产打包场景下易失败或表现不一致
