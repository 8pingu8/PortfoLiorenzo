import { type User } from '#app/types.ts'
import { getRequiredServerEnvVar } from './misc.tsx'

const DISCORD_CLIENT_ID = getRequiredServerEnvVar('DISCORD_CLIENT_ID')
const DISCORD_CLIENT_SECRET = getRequiredServerEnvVar('DISCORD_CLIENT_SECRET')
const DISCORD_GUILD_ID = getRequiredServerEnvVar('DISCORD_GUILD_ID')
const DISCORD_BOT_TOKEN = getRequiredServerEnvVar('DISCORD_BOT_TOKEN')

// Mock implementation - we're not actually using Discord functionality
export async function updateDiscordRoles(user: User) {
	return null
}

export async function getDiscordAuthorizeURL(domainUrl: string) {
	const url = new URL('https://discord.com/api/oauth2/authorize')
	url.searchParams.set('client_id', DISCORD_CLIENT_ID)
	url.searchParams.set('redirect_uri', `${domainUrl}/discord/callback`)
	url.searchParams.set('response_type', 'code')
	url.searchParams.set('scope', 'identify guilds.join')
	return url.toString()
}
