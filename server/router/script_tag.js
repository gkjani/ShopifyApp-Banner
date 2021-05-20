import shopifyAuth from "@shopify/koa-shopify-auth";
import Router from "koa-router";
import {
  createScriptTag,
  getAllScriptAllTags,
  deleteScriptTagById
} from "../controllers/script_tag_controller";

const router = new Router({ prefix: "/script_tag" });

router.get("/", async (ctx) => {
  ctx.body = "Get script tag";
});

router.get("/all", async (ctx) => { 
 const result =   await getAllScriptAllTags(ctx.myClient,"https://google.com/");
   ctx.body = {
     isInstalled : result.length > 0,
     details : result
   };
});

router.post("/", async (ctx) => {
 const result =  await createScriptTag(ctx.myClient);
 ctx.body = "Script tag created";
});

router.delete("/", async (ctx) => {
   const id = ctx.query.id;
  const result = await deleteScriptTagById(ctx.myClient, id);
   ctx.body = result;
});

export default router;
