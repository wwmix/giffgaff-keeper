# Giffgaff 保号助手

一个完全静态、无第三方依赖的 Giffgaff SIM 保号辅助页面。它通过同源下载一个固定的 120 KiB 二进制载荷，帮助用户主动产生一次移动数据连接。

**在线使用：[打开 Giffgaff 保号助手](https://wwmix.github.io/giffgaff-keeper/)**

> 这不是 Giffgaff 官方工具。网页只能确认文件下载与大小校验完成，不能确认运营商已经登记活动；使用后仍应检查 Giffgaff 账户或余额记录。

## 致谢与来源

本项目的核心思路与初始方案借鉴自 [dennischancs/gg-keeper](https://github.com/dennischancs/gg-keeper)。感谢原作者 [@dennischancs](https://github.com/dennischancs) 公开分享 Giffgaff 流量保号方案，为本项目提供了清晰的实现思路。

本仓库在原方案基础上重新实现页面，并针对载荷可压缩性、结果表述、误触保护、本地记录安全、漫游费用提示与无障碍体验进行了调整。原项目的贡献与启发应当被明确保留和尊重。

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
5. 页面显示“数据请求完成”后，可点击“添加事项提醒”，为 157 天后准备下一次保号提醒。
6. 关闭移动数据，并检查 Giffgaff 账户活动或余额。

Giffgaff 当前说明是：SIM 在 6 个月内至少要有一次符合条件的活动；连接一次移动数据属于其中一种。为了留余量，本页按 5 个月提示下一次日期。规则与资费可能调整，请以 [Giffgaff 停用规则](https://help.giffgaff.com/en/articles/242797-understanding-why-your-number-has-been-deactivated) 和 [漫游资费](https://www.giffgaff.com/roaming-charges) 为准。

## 157 天提醒

载荷下载并校验通过后，页面会显示“添加事项提醒”按钮，并自动计算 157 天后的准确日期。

- iPhone/iPad：点击后打开系统分享面板，请选择“提醒事项”，再确认标题中的日期和保存操作。网页没有直接写入“提醒事项”数据库的权限，因此不能绕过系统确认。
- 其他或不支持系统分享的浏览器：自动生成包含准确日期、09:00 提醒和保号页面链接的 `.ics` 日历文件。

相关能力说明：[Apple：从其他 App 添加提醒事项](https://support.apple.com/en-us/102484)、[Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)。

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
