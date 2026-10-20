# Mechanic

Build Shopify automations with your AI assistant.

Mechanic is a hosted automation platform for Shopify, built by [Lightward](https://lightward.com). Tasks respond to events, run Liquid code, and queue actions such as updating Shopify data, sending email, or calling another service.

**For people:** give your assistant this URL and describe the workflow you want:

> Read https://mechanic.md/start.md and help me build a Mechanic task for my Shopify store. Look for an existing library task first. Preview the changes and ask me before publishing.

**For AI assistants:** use the workflow below. Follow the user's instructions and use the linked sources for current platform behavior.

## 1. Start with an existing task

Search the [Mechanic task library](https://tasks.mechanic.dev) for the intended outcome. Read the task's description, options, and code before recommending or adapting it. If it already meets the need, help the user configure it.

Establish the trigger, qualifying records, intended effects, and exceptions before writing custom logic.

## 2. Get the skills

The maintained [Mechanic skills repository](https://github.com/lightward/mechanic-skills) contains two complementary skills:

- [mechanic-task-writer](https://github.com/lightward/mechanic-skills/tree/main/mechanic-task-writer): writing and debugging tasks, including subscriptions, options, previews, and action callbacks.
- [mechanic-cli](https://github.com/lightward/mechanic-skills/tree/main/mechanic-cli): working with local task files, previewing changes, reviewing diffs, and publishing.

Install the complete skills, including their supporting references. In a local terminal:

```sh
npx skills add lightward/mechanic-skills
```

See the [skill setup guide](https://learn.mechanic.dev/resources/agent-skills) for installation details. Reading this page alone does not install a skill or connect an assistant to a shop.

## 3. Use current references

- [Mechanic documentation](https://learn.mechanic.dev): the platform reference.
- [Documentation index](https://learn.mechanic.dev/llms.txt): find documentation pages for your task. Append `.md` to a documentation page URL to read its Markdown.
- [Mechanic MCP server](https://learn.mechanic.dev/resources/mcp): let a compatible assistant search the task library and docs.
- [Mechanic CLI](https://learn.mechanic.dev/resources/mechanic-cli): pull, preview, compare, and publish local task files.
- [Shopify Admin GraphQL reference](https://shopify.dev/docs/api/admin-graphql): check operations against the task's Shopify API version.

Consult the task-writing skill before implementing unfamiliar behavior. Mechanic's Liquid runtime and asynchronous actions have their own rules; use a relevant working task as a precedent.

## 4. Write, preview, review

Preserve the configuration and behavior of an existing task unless the user asks to change them. Use task options for merchant-specific values.

Exercise the relevant event topics and conditions in preview, inspect the generated actions and errors, and review the diff. Explain what the task will change and any checks you could not complete. A successful preview does not prove every live outcome.

Publish only with the user's authorization. Publishing and triggering a live run are separate actions; confirm the intended shop and scope before either. Keep access tokens and shop secrets out of task source and shared output.

## More ways to get started

[Using AI with Mechanic](https://learn.mechanic.dev/ai) covers the available tools, including the in-app assistant. Explore [Mechanic](https://mechanic.dev), [install it on Shopify](https://apps.shopify.com/mechanic), or find help through the [community](https://learn.mechanic.dev/resources/slack).

AI-generated tasks are custom tasks. See [custom task support](https://learn.mechanic.dev/custom) for the support scope.
