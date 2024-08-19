import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
  
  const {refreshtoken, accessToken} = await request.json();

  cookies.set('refreshtoken', refreshtoken, { path: '/' })
  cookies.set('accessToken', accessToken, { path: '/' })

  return json({
    message: "Success"
  })
};