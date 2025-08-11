import { Commit } from "@octokit/webhooks-definitions/schema"

let blocks = ["▂", "▄", "▆", "█"]

export function obfuscate(input: string): string {
	let output = String()

	for (let char of input) {
		if (char === " ") {
			output += " "
			continue
		}

		output += blocks[Math.floor(Math.random() * blocks.length)]
	}

	return output
}

export function generateText(commit: Commit): string {
	let id = commit.id.substring(0, 8)
	let repo = commit.url.split("/commit")[0]

	let text = `[\`${id}\`](<${repo}/commit/${id}>) `
	let message = commit.message

	if (message.startsWith("!") || message.startsWith("$")) {
        text += `${obfuscate(message.substring(1).trim())}`
    } else {
        text += `${message}`
    }

	text += "\n"
	return text
}
