import { context } from "@actions/github"
import * as core from "@actions/core"
import fetch from "node-fetch"
import { PushEvent } from "@octokit/webhooks-definitions/schema"
import { generateText, obfuscate } from "./utils"

const url = core.getInput("webhookUrl").replace("/github", "")
const data = context.payload as PushEvent

const [sender, repo, branch, senderUrl, repoUrl] = [
	data.sender.login,
	data.repository.name,
	context.ref.replace("refs/heads/", ""),
	data.sender.html_url,
	data.repository.html_url
]
const branchUrl = `${repoUrl}/tree/${branch}`

const originalFooter = `[${repo}](<${repoUrl}>)/[${branch}](<${branchUrl}>)`
// const privateFooter = `${obfuscate(repo)}/${obfuscate(branch)}`

let isPrivate = false
const footer = () => `- [${sender}](${senderUrl}) on ${originalFooter}`
// const footer = () =>
// 	`- [${sender}](<${senderUrl}>) on ${
// 		isPrivate ? privateFooter : originalFooter
// 	}`

let buffer = String()

async function send(): Promise<void> {
	const content = buffer + footer()
	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			username: sender,
			avatar_url: data.sender.avatar_url,
			content: content,
			allowed_mentions: { parse: [] }
		}),
		headers: { "Content-Type": "application/json" }
	})

	if (!res.ok) core.setFailed(await res.text())

	buffer = String()
}

async function run(): Promise<void> {
	if (context.eventName !== "push") return

	for (const commit of data.commits) {
		// const [text, _private] = generateText(commit)
		const text = generateText(commit)

		// if (_private) isPrivate = true

		const sendLength = text.length + buffer.length + footer().length

		if (sendLength >= 2000) {
			await send()
			// isPrivate = false
		}

		buffer += text
	}

	if (buffer.length > 0) await send()
}

run()
