export { auth as proxy } from "@/auth"

export const config = {
    matcher: [
        '/session'
    ],
    pages: {
        SignIn: '/api/auth/signin'
    }
}