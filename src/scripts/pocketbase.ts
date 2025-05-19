import PocketBase from 'pocketbase'
import { PUBLIC_BACKEND_URL } from '$env/static/public'

export const pb = new PocketBase(`https://${PUBLIC_BACKEND_URL}`)