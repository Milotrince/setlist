import { error } from '@sveltejs/kit'
import { songs } from "$lib/songsQuery.js"

export async function load({ params }) {
	try {
		const tagged_songs = songs.filter(s => s.tags.includes(params.slug))
		return { tag: params.slug, songs: tagged_songs }
	} catch (e) {
		error(404, `Could not find ${params.slug}`)
	}
}