# 伴游 App - UI 设计规范

## 色彩系统

### 主色（渐变）
- **Primary Gradient**: `linear-gradient(135deg, #FF6B9D 0%, #c44569 100%)`
- **Secondary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Success Gradient**: `linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)`
- **Warning Gradient**: `linear-gradient(135deg, #FFD700 0%, #FFA500 100%)`

### 纯色
- **Primary**: #FF6B9D（粉紫）
- **Secondary**: #667eea（蓝紫）
- **Background**: #16213e（深蓝黑）
- **Card BG**: rgba(255,255,255,0.06)
- **Text Primary**: #fff
- **Text Secondary**: rgba(255,255,255,0.6)
- **Text Muted**: rgba(255,255,255,0.4)

## 按钮规范

### 主按钮
```css
background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
border-radius: 25px;
box-shadow: 0 4px 15px rgba(255,107,157,0.4);
padding: 14px 32px;
font-size: 15px;
font-weight: bold;
color: #fff;
border: none;
cursor: pointer;
```

### 次按钮
```css
background: rgba(255,255,255,0.1);
border: 1px solid rgba(255,255,255,0.2);
border-radius: 25px;
padding: 14px 32px;
font-size: 14px;
color: rgba(255,255,255,0.8);
cursor: pointer;
```

### 圆角
- 大卡片: 16px
- 中卡片: 12px
- 按钮: 25px（大）/ 16px（中）/ 8px（小）
- 输入框: 20px

### 阴影
```css
/* 按钮阴影 */
box-shadow: 0 4px 15px rgba(255,107,157,0.4);

/* 卡片阴影 */
box-shadow: 0 2px 12px rgba(0,0,0,0.3);

/* 浮层阴影 */
box-shadow: 0 8px 32px rgba(0,0,0,0.5);
```

## 字体规范
- 标题: 22-24px, bold
- 副标题: 17-18px, bold
- 正文: 14-15px
- 辅助文字: 12-13px
- 最小: 11px

## 间距规范
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px

## 动画规范
- 按钮点击: scale(0.98), 100ms
- 页面切换: opacity + translateY, 300ms ease
- Tab 切换: border-color, 200ms
- 列表项滑入: translateX, 200ms ease-out

## 渐变按钮清单（需更新）

### CoverPage
- [x] 立即登录按钮 → 渐变
- [ ] 先逛逛按钮 → 渐变（待更新）

### LoginPage  
- [x] 提交按钮 → 渐变

### PlayerListPage
- [x] 立即预约按钮 → 渐变

### PlayerDetailPage
- [x] 立即预约按钮 → 渐变

### OrdersPage
- [x] 确认完成按钮 → 渐变
- [x] 联系陪玩按钮 → 渐变

### PaymentPage
- [x] 确认支付按钮 → 渐变

### ProfilePage
- [x] 退出登录按钮 → 待更新为渐变边框

### ChatPage
- [x] 发送按钮 → 渐变
