# 俄羅斯方塊遊戲 (Tetris Game)

> 📚 **作業說明**  
> 此專案為 **第五屆中學生黑客松 黑客挑戰日** 的 AI 賦能作品  
> 任務編號：第 005 號任務 A 賦能 101 中部場（小組）  
> 使用 AI 協作工具創建的現代化俄羅斯方塊遊戲

一個使用 HTML5 Canvas 和 JavaScript 開發的現代化俄羅斯方塊遊戲。

## 🌐 線上試玩

[點擊這裡開始遊戲](https://nat1anwastaken.github.io/tetris-cursor)

[![Deploy to GitHub Pages](https://github.com/nat1anwastaken/tetris-cursor/actions/workflows/deploy.yml/badge.svg)](https://github.com/nat1anwastaken/tetris-cursor/actions/workflows/deploy.yml)

## 🎮 遊戲特色

- **經典俄羅斯方塊玩法** - 包含所有 7 種經典方塊形狀
- **SRS 旋轉系統** - 採用標準旋轉系統，包含牆踢功能
- **幽靈方塊** - 顯示方塊落下的預測位置
- **下一個方塊預覽** - 提前查看下一個方塊
- **等級系統** - 隨著消除行數增加，遊戲速度逐漸加快
- **響應式設計** - 支援桌面和行動裝置
- **現代化 UI** - 賽博朋克風格的視覺設計

## 🕹️ 操作說明

| 按鍵   | 功能          |
| ------ | ------------- |
| ← →    | 左右移動方塊  |
| ↓      | 加速下降      |
| ↑      | 旋轉方塊      |
| 空白鍵 | 暫停/繼續遊戲 |

## 📊 計分系統

- **單行消除**: 40 × 等級
- **雙行消除**: 100 × 等級
- **三行消除**: 300 × 等級
- **四行消除**: 1200 × 等級

每消除 10 行升一級，遊戲速度也會相應提升。

## 🚀 如何開始

### 本地執行

1. 在瀏覽器中打開 `index.html` 文件
2. 遊戲會自動開始
3. 使用鍵盤控制方塊移動和旋轉
4. 盡可能多地消除行數以獲得高分！

### 部署到 GitHub Pages

1. Fork 這個專案到您的 GitHub 帳戶
2. 在您的倉庫設定中啟用 GitHub Pages
3. 選擇 "GitHub Actions" 作為來源
4. 推送程式碼到 main 分支，GitHub Actions 會自動部署
5. 訪問 `https://你的用戶名.github.io/倉庫名稱` 即可線上遊戲

## 🎨 設計特色

- **賽博朋克主題** - 霓虹色彩和未來感設計
- **流暢動畫** - 平滑的視覺效果
- **響應式布局** - 適配不同螢幕尺寸
- **無障礙設計** - 清晰的視覺層次和對比度

## 📱 相容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🛠️ 技術規格

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **圖形**: Canvas API
- **字體**: Google Fonts (Orbitron)
- **部署**: GitHub Pages + GitHub Actions
- **無外部依賴**: 純原生 JavaScript 實現

## 🚀 CI/CD

此專案使用 GitHub Actions 進行自動部署：

- 當程式碼推送到 `main` 分支時自動觸發
- 自動構建並部署到 GitHub Pages
- 支援手動觸發部署

## 🏆 黑客松作業資訊

### 活動詳情

- **活動名稱**: 第五屆中學生黑客松 黑客挑戰日
- **任務編號**: 第 005 號任務 A 賦能 101 中部場（小組）
- **作業要求**: 復刻 AI 賦能作品（一個以上，合一個）
- **截止日期**: 2025 年 6 月 2 日 23:59

### AI 協作說明

本專案使用 AI 協作工具（GitHub Copilot）進行開發：

- ✅ 遊戲邏輯設計與實現
- ✅ 現代化 UI/UX 設計
- ✅ 響應式網頁布局
- ✅ GitHub Actions 自動部署
- ✅ 完整的專案文檔

### 提交內容

- [x] 完整的俄羅斯方塊遊戲
- [x] 現代化賽博朋克風格界面
- [x] GitHub Pages 線上部署
- [x] 詳細的 README 說明文檔
- [x] 自動化 CI/CD 流程

## 📄 授權

此專案採用 MIT 授權條款。

---

享受遊戲，挑戰你的最高分數！ 🎯
