/**
 * Mock 系统入口
 *
 * 使用方式：
 * 1. 在 .env 中设置 VITE_USE_MOCK=true 开启 mock（默认开启）
 * 2. 或设置 VITE_USE_MOCK=false 关闭 mock，使用真实 API
 *
 * 后续接入真实后端时，只需设置 VITE_USE_MOCK=false 即可切换。
 */
export { setupMockInterceptor } from './interceptor'
