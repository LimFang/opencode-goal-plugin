import { expect, test } from "bun:test"
import { messagesFor, resolveLocale } from "../src/i18n"

test("explicit locale overrides environment and OS locale", () => {
  expect(resolveLocale("zh-CN", { LANG: "en_US.UTF-8" }, "en-US")).toBe("zh-CN")
  expect(resolveLocale("en", { LC_ALL: "zh_CN.UTF-8" }, "zh-CN")).toBe("en")
})

test("locale auto-detection prefers LC_ALL, then LANG, then OS locale", () => {
  expect(resolveLocale(undefined, { LC_ALL: "zh_CN.UTF-8", LANG: "en_US.UTF-8" }, "en-US")).toBe("zh-CN")
  expect(resolveLocale(undefined, { LANG: "zh_CN.UTF-8" }, "en-US")).toBe("zh-CN")
  expect(resolveLocale(undefined, {}, "zh-CN")).toBe("zh-CN")
})

test("unsupported explicit locales fall back to English", () => {
  expect(resolveLocale("fr-FR", { LANG: "zh_CN.UTF-8" }, "zh-CN")).toBe("en")
  expect(resolveLocale(undefined, { LANG: "C.UTF-8" }, "en-US")).toBe("en")
})

test("zh-CN messages localize user-facing goal strings without changing tool identifiers", () => {
  const messages = messagesFor("zh-CN")
  expect(messages.commands.goalDescription).toContain("目标")
  expect(messages.tools.createGoal).toContain("创建目标")
  expect(messages.tui.refresh).toBe("刷新")
  expect(messages.tui.refreshPrompt).toContain("get_goal")
})
