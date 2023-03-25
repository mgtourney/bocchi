import { redirect, type Request, type Cookies } from "@sveltejs/kit";
import { getAuthCode, getToken, isUserAllowed } from "$lib/discord-oauth2";

export function load({ cookies, request }: { Cookies, Request}) {
  const encryptedToken = cookies.get('token');
  const params = request.query;
  if(!encryptedToken) {
    if(!params.code || !params.state) {
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
