import { redirect, type Url, type Cookies } from "@sveltejs/kit";
import { getAuthCode, getToken, isUserAllowed } from "$lib/discord-oauth2";

export function load({ cookies, url }: { Cookies, Url }) {
  let encryptedToken = cookies.get('token');
  const params = url.searchParams;
  if(!encryptedToken) {
    if(!params.get('code') || !params.get('state')) {
      getAuthCode(cookies);
    } else {
      encryptedToken = getToken(params.code, params.state);
      cookies.set('token', encryptedToken);
    }
  }
  if(!isUserAllowed(encryptedToken)) {
    cookies.set('token', '');
    throw(307, "/overlay-scenes");
  }
};
