# Turnmatch 分析接入

## 2026-10-15 当前状态

用户已确认正式域名 `https://sensitivityconverter.me`。正式登记语句已生成至 `docs/analytics/register-production.sql`，配置记录在 `production-registration.json`，状态为 `prepared_not_executed`。本轮未执行正式登记：服务请求连接重置，浏览器SQL编辑器超时，未获得可验证的执行结果。生产Origin识别和真实入库仍待完成，不自动加入www域名。

以下2026-10-14记录保留为开发环境接入历史；其中“尚无确认的真实域名”已被上述确认取代。

## 2026-10-14 历史记录

## 已完成

复用现有 `website-analytics` / `szqxprjpaccnskjqdrkq`，未建库、未执行迁移、未修改旧 `website-feedback` / `zrwlljomdjqanttofqap`。

| 配置 | 当前值 |
|---|---|
| website_id | `turnmatch` |
| 名称 | Turnmatch Sensitivity Converter |
| 开发 site_id | `turnmatch_development` |
| 完整 Origin | `http://localhost:3000`、`http://127.0.0.1:3000` |
| production / staging | 尚无确认的真实域名，未虚构登记 |

在分析项目目录运行了 `scripts/register-site.mjs`，生成 `registrations/turnmatch_development.json`。随后在指定新项目 SQL Editor **实际执行** `analytics_register_site`，MCP list_sites 和两个 Origin 的 /config 返回均已确认登记。项目内保留 SQL：`docs/analytics/register-development.sql`。本轮无待执行的开发登记 SQL。

正式域名配置后应另生成 `turnmatch_production`；真实测试站另用 `turnmatch_staging`。只登记确认使用的完整 Origin，裸域与www分别明确列出，不使用通配符。`NODE_ENV=production` 的本地构建仍归开发 Origin，不因此进入正式流量。

## 自动启用与全局加载（最新要求）

用户于2026-10-14明确要求进入网站即采集，无需同意弹窗。此要求替代下方历史测试中的默认关闭策略。

- 根布局通过 `src/components/analytics-tracker.tsx` 加载统一脚本，设置 `data-consent="granted"`。
- 移除同意面板、页脚开关及旧同意存储读取；由实际Origin识别站点。
- 保留tracker的GPC处理和数据排除规则；按用户后续明确要求，公开Privacy/Terms等不添加分析说明。下文相关公开文案描述仅为历史记录，以此最新要求为准。

## 埋点

自动页面访问、活跃停留、滚动深度和SPA URL变化沿用既有tracker，没有额外手动 page()。

重要按钮使用稳定 data-analytics-id：游戏选择、输入模式、交换、重置、结果/指标/比较复制、分享、打印、导出、配置保存/恢复/导入/清空、反馈入口和快捷组合。

业务事件在实际结果产生后触发，与点击分开：

| feature_id | 成功/失败条件 |
|---|---|
| conversion | 用户修改后500ms防抖；有效结果为success，无效为invalid_input；初次默认渲染不计业务成功 |
| copy_result / share_settings | 剪贴板实际完成；拒绝为clipboard_unavailable；被后续修改取消的旧复制不计成功 |
| profile_save | 本地持久化成功；空名、容量限制、存储失败分别报固定错误码 |
| profile_import | JSON验证并恢复成功，带result_count；坏备份、容量、文件大小/读取失败报固定码 |
| reverse_conversion | 反算通过验证并应用；非法值/溢出报固定码 |

导出按钮只计点击，**没有将点击当成文件下载成功**。反馈仅标记入口点击，未修改旧反馈脚本或采集反馈内容。

显式属性白名单只有 feature_id、固定error_code和result_count；不发送输入值、DPI、配置名称、文件名、搜索原文、反馈原文或分享URL。没有账户/邮箱/手机号埋点。当前路由均为静态信息页；tracker自动剔除查询和hash。未来增加敏感路由时使用模板。

## 前轮验证（同意策略已被上述最新要求替代）

- 浏览器未同意/拒绝后：enabled=false、configured=false、queue=0、无wa_访客标识；刷新仍不采集。
- 同意后：configured=true、site_id=turnmatch_development、configuration.environment=development；flush后queued=0、dropped=0。见 `qa/analytics-browser-status.json`。
- **真实发送并入库**：只读MCP查询确认17条开发测试事件，包括page_view、engagement、click、conversion success/error、copy success，以及 `/about` 的SPA访问。见 `qa/analytics-mcp-final.json`。这些是QA开发流量，不是正式用户流量。
- 两个登记Origin解析200；localhost:3001和未登记域名403；把本地Origin指向旧自检site_id或未登记production site_id均403。见 `qa/analytics-origin-isolation.json`。初次MCP跨站查询未发现本轮事件重叠，见 `qa/analytics-mcp-verification.json`。
- 保存/导入/反算的业务钩子另在**拒绝采集状态**下用临时观察器检查属性：能区分成功/失败，没有配置名或表单原文，队列仍0。见 `qa/analytics-business-hooks.json`；刷新已移除观察器。
- 同意撤回后队列、访客标识清空，测试同意键最后恢复未选择，供真实用户自行决定。未保留自动授权或测试模拟。
- 27项自动测试通过；lint/typecheck/build通过；5页面、72内部链接、12本地资源、11FAQ schema和三种导出复检通过。
- 从分析项目服务端读取MCP凭证，仅用于授权只读验证。扫描网站src、public和构建静态资源50个文件，未匹配MCP凭证；没有复制secrets目录、写前端环境变量或把凭证提交仓库。
- 320px无横向溢出，同意面板底部646px、固定结果栏顶部675px，未重叠。截图 `qa/analytics-consent-desktop.png`、`qa/analytics-consent-mobile-320.png`。

## 当前边界

正式域名/测试域名未确认，因此只完成开发环境登记。网站尚未推送或部署，不宣称正式站已开始采集。现有Grok只读服务已查询成功，本轮没有替用户配置Grok客户端或定时routine。

未真机测试所有浏览器的GPC/存储策略。广告拦截、浏览器隐私保护、断网或退出可能导致漏报，不保证记录每次操作。随机访客标识不等于可识别真实人数。

最终首页默认含授权面板：3332词、117次完整短语、3.511405%、单H1，保持SOP约束；统计见qa/analytics-content-count.json。


## 2026-10-14：自动分析采集（替代本网站此前同意弹窗策略）

用户明确要求访客进入网站即采集。根布局统一脚本设置 data-consent="granted"；移除同意弹窗、页脚开关及旧同意值读取，Privacy同步更新。继续保留既有GPC处理，不采集表单原文或配置名称，未修改旧反馈项目。

浏览器无需点击同意即 enabled=true、configured=true、site_id=turnmatch_development、environment=development；flush后queued=0、dropped=0。只读MCP确认本轮5条真实事件入库，包括page_view、conversion成功和engagement。证据：docs/qa/analytics-automatic-mcp.json、analytics-automatic-desktop.png。27测试、lint、typecheck、build和全站链接资源检查通过。

目前仅开发Origin已登记，正式域名仍需提供真实地址后独立登记；尚未发布上线。


## 2026-10-14：面向访客的文档文案调整

按用户要求，移除Privacy页面的数据分析段落和介绍，并移除README接入介绍。Terms等其他信息页面无相关文案。分析采集代码维持原设置；内部接入、排障和测试记录保留。构建通过。此调整替代之前关于Privacy同步介绍分析采集的记录。

## 2026-10-14：补充练习场关键埋点
原有开始、模式、重置、全屏、报告重练/更新按钮标签及完成/捕获失败业务事件保留。补充关闭、返回转换器、跳转保存、应用试调的稳定data-analytics-id，继续按钮独立resume_aim_test。
增加aim_started/resumed/paused/abandoned/closed/reset/trial_applied生命周期事件，feature_id仅aim_固定场景枚举。成功获得鼠标捕获才记开始/继续；重复pointerlockchange不重复暂停；完成仍只由回合结束feature_success触发。应用试调成功才记trial_applied。无逐帧、逐移动或逐枪远端事件，不上传鼠标轨迹或输入原文。关闭/中途退出指站内关闭操作，不宣称已覆盖直接关浏览器。未改分析服务/数据库/旧反馈项目；服务端validation.mjs只读确认接受这些事件名和feature_id。
51测试、lint、typecheck、build通过。独立浏览器以临时本地事件接收器和模拟捕获验证started→paused→resumed→paused→abandoned→closed，重复锁变化不产生额外暂停；证据docs/qa/aim-lifecycle-events-qa.json。本轮验证前端触发，未把本地接收器结果当作新事件入库证明。刷新清除模拟脚本；截图aim-analytics-controls.png。3000服务已重启，用户已开页需刷新加载新代码，未部署。
