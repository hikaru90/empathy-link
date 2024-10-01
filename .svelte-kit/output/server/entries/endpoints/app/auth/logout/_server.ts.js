import { r as redirect } from "../../../../../chunks/index.js";
import "../../../../../chunks/auth.js";
const POST = ({ locals }) => {
  locals.pb.authStore.clear();
  locals.user = void 0;
  throw redirect(303, "/");
};
export {
  POST
};
