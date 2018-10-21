export default class CookieManager {
    constructor(cookies) {
        this.baseCookieName = 'STF';
        this.cookies = cookies;
    }

    setCookie(cookieId, ttl) {
        this.cookies.set(this.baseCookieName, cookieId, {
            path: '/',
            maxAge: ttl
        });
    }

    checkCookie() {
        return !!this.cookies.get(this.baseCookieName);
    }
}