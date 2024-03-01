import { Commit } from "@octokit/webhooks-definitions/schema"

const blocks = ["▂", "▄", "▆", "█"]

export function obfuscate(input: string): string {
	let output = String()

	for (const char of input) {
		if (char === " ") {
			output += " "
			continue
		}

		output += blocks[Math.floor(Math.random() * blocks.length)]
	}

	return output
}

export function generateText(commit: Commit): string {
	const id = commit.id.substring(0, 8)
	const repo = commit.url.split("/commit")[0]

	let text = `[\`${id}\`](<${repo}/commit/${id}>) `
	let message = commit.message
	// let isPrivate = false

	if (message.startsWith("!") || message.startsWith("$")) {
        // isPrivate = true
        text += `${obfuscate(message.substring(1).trim())}`
    } else {
        text += `${message}`
    }

	text += "\n"
	// return [text, isPrivate]
	return text
}
