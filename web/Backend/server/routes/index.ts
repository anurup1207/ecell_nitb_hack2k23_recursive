import authRouter from "./authRouter";
import userRouter from "./userRouter";
import categoryRouter from "./categoryRouter";
import blogRouter from "./blogRouter";
import commentRouter from "./commentRouter";
import followRouter from "./followRouter";
import notificationRouter from "./notificationRouter";
import draftrouter from "./draftRouter";
import datarouter from "./dataRouter";
const routes = [
  authRouter,
  userRouter,
  categoryRouter,
  blogRouter,
  commentRouter,
  followRouter,
  notificationRouter,
  draftrouter,
  datarouter,
];

export default routes;
