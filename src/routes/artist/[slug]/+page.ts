import { error } from '@sveltejs/kit'
import { songs } from "$lib/songsQuery.js"

export async function load({ params }) {
	let artist = params.slug
	try {
		const artist_songs = songs.filter(s => (s.artistSlug === params.slug))
		if (artist_songs) {
			artist = artist_songs[0].artist
		}
		return { artist: artist, songs: artist_songs }
	} catch (e) {
		error(404, `Could not find ${artist}`)
	}
}