# Giffgaff 保号助手

一个完全静态、无第三方依赖的 Giffgaff SIM 保号辅助页面。它通过同源下载一个固定的 120 KiB 二进制载荷，帮助用户主动产生一次移动数据连接。

> 这不是 Giffgaff 官方工具。网页只能确认文件下载与大小校验完成，不能确认运营商已经登记活动；使用后仍应检查 Giffgaff 账户或余额记录。

## 相比参考方案的改进

- 使用精确的 `122,880 bytes` 二进制载荷，避免文本被 HTTP 压缩后实际传输量与页面显示量不一致。
- 使用随机查询参数和 `cache: no-store`，每次由用户主动触发新的请求。
- 不再把“下载成功”表述成“保号成功”，避免把浏览器结果冒充运营商确认。
- 下载前必须手动确认网络，完成或失败后都需要重新勾选，降低误触与重复计费风险。
- 只在载荷大小校验通过后写入历史；本地存储异常不会影响页面主体功能。
- 历史使用 DOM 文本节点渲染，不把本地数据拼接进 `innerHTML`。
- 加入 45 秒超时但不自动重试，避免网络不稳时悄悄产生第二次流量。
- 明确提示页面加载、协议开销和漫游资费不包含在 120 KiB 内。

## 使用

1. 先在 Wi-Fi 下打开页面并加入书签。
2. 保持页面打开，关闭 Wi-Fi，确认移动数据或数据漫游走 Giffgaff SIM。
3. 暂停系统更新、云同步和其他应用的移动数据。
4. 勾选网络确认，点击“下载 120 KiB 载荷”。
5. 页面显示“数据请求完成”后关闭移动数据，并检查 Giffgaff 账户活动或余额。

Giffgaff 当前说明是：SIM 在 6 个月内至少要有一次符合条件的活动；连接一次移动数据属于其中一种。为了留余量，本页按 5 个月提示下一次日期。规则与资费可能调整，请以 [Giffgaff 停用规则](https://help.giffgaff.com/en/articles/242797-understanding-why-your-number-has-been-deactivated) 和 [漫游资费](https://www.giffgaff.com/roaming-charges) 为准。

## 部署到 GitHub Pages

1. 将本仓库推送到 GitHub，确保 `index.html` 与 `payload.bin` 位于默认分支根目录。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. 选择默认分支和 `/ (root)`，保存并等待 Pages 地址生成。

## 本地校验

需要 Node.js 18 或更高版本：

```bash
node scripts/generate-payload.mjs
node scripts/check.mjs
```

生成脚本是确定性的；重复运行会得到相同的 `payload.bin`。
