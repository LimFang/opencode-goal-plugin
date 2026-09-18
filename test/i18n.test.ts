import { expect, test } from "bun:test"
import { messagesFor, resolveLocale } from "../src/i18n"

test("explicit locale overrides environment and OS locale", () => {
  expect(resolveLocale("zh-CN", { LANG: "en_US.UTF-8" }, "en-US")).toBe("zh-CN")
  expect(resolveLocale("en", { LC_ALL: "zh_CN.UTF-8" }, "zh-CN")).toBe("en")
})

test("default locale remains English regardless of environment", () => {
  expect(resolveLocale(undefined, { LC_ALL: "zh_CN.UTF-8", LANG: "zh_CN.UTF-8" }, "zh-CN")).toBe("en")
})

test("auto locale detection prefers LC_ALL, then LANG, then OS locale", () => {
  expect(resolveLocale("auto", { LC_ALL: "zh_CN.UTF-8", LANG: "en_US.UTF-8" }, "en-US")).toBe("zh-CN")
  expect(resolveLocale("auto", { LANG: "zh_CN.UTF-8" }, "en-US")).toBe("zh-CN")
  expect(resolveLocale("auto", {}, "zh-CN")).toBe("zh-CN")
})

test("unsupported explicit locales fall back to English", () => {
  expect(resolveLocale("fr-FR", { LANG: "zh_CN.UTF-8" }, "zh-CN")).toBe("en")
  expect(resolveLocale("auto", { LANG: "C.UTF-8" }, "en-US")).toBe("en")
})

test("zh-CN messages localize user-facing goal strings without changing tool identifiers", () => {
  const messages = messagesFor("zh-CN")
  expect(messages.commands.goalDescription).toContain("目标")
  expect(messages.tools.createGoal).toContain("创建目标")
  expect(messages.tui.refresh).toBe("刷新")
  expect(messages.tui.refreshPrompt).toContain("get_goal")
})
