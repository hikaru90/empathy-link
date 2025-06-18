import type { LayoutServerLoad } from './$types';
// import { getInitialLocale } from '$scripts/helpers';
// import { getCookie } from '$scripts/helpers';

export const load = (async ({ fetch, url, locals }) => {
	// const postHogApi = await fetch(`/api/posthog/decide`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ userId: locals.posthogId })
  // })
  
  // console.log('postHogApi',postHogApi);
  // const postHogRes = await postHogApi.json();

  // console.log('postHogRes',postHogRes);

  return {
    url: url.pathname,
		user: locals.user,
		locale: locals.locale,
    sessionToken: locals.sessionToken,
    userId: locals.userId,
    // posthogId: locals.posthogId,
    // featureFlags: postHogApi.featureFlags || {}
  };

}) satisfies LayoutServerLoad;
