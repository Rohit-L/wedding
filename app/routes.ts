import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("rsvp", "routes/rsvp.tsx"),
  route("enter", "routes/enter.tsx"),
] satisfies RouteConfig;
