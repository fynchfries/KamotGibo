import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  RouterProvider,
  type AnyRoute,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { redirectLegacyArtisanView } from "@/lib/artisan-workspace";
import { Route as Root } from "@/routes/__root";
import { Route as Home } from "@/routes/index";
import { Route as Discover } from "@/routes/discover";
import { Route as Workshop } from "@/routes/workshops.$id";
import { Route as Book } from "@/routes/book.$id";
import { Route as Learning } from "@/routes/learning";
import { Route as Learn } from "@/routes/learn";
import { Route as UpskillingLayout } from "@/routes/learner.upskilling";
import { Route as Upskilling } from "@/routes/learner.upskilling.index";
import { Route as Pathway } from "@/routes/learner.upskilling.$id";
import { Route as Badge } from "@/routes/badges.$code";
import { Route as TeachLayout } from "@/routes/teach";
import { Route as Teach } from "@/routes/teach.index";
import { Route as TeachWorkshops } from "@/routes/teach.workshops";
import { Route as TeachBookings } from "@/routes/teach.bookings";
import { Route as TeachApplication } from "@/routes/teach.application";
import { Route as Admin } from "@/routes/admin";
import { Route as Session } from "@/routes/teach.session";

// Mirror real route ownership without CSS head resources that jsdom cannot load.
export async function renderDemo(initialEntry: string, withChrome = false) {
  const root = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    ...(withChrome ? { component: Root.options.component! } : {}),
  });
  const teach = createRoute({
    getParentRoute: () => root,
    path: "/teach",
    component: TeachLayout.options.component!,
  });
  const teaching = teach.addChildren([
    createRoute({
      getParentRoute: () => teach,
      path: "/",
      component: Teach.options.component!,
      validateSearch: Teach.options.validateSearch,
      beforeLoad: ({ search }) => redirectLegacyArtisanView(search),
    }),
    createRoute({
      getParentRoute: () => teach,
      path: "workshops",
      component: TeachWorkshops.options.component!,
    }),
    createRoute({
      getParentRoute: () => teach,
      path: "bookings",
      component: TeachBookings.options.component!,
      validateSearch: TeachBookings.options.validateSearch,
    }),
    createRoute({
      getParentRoute: () => teach,
      path: "application",
      component: TeachApplication.options.component!,
    }),
    createRoute({
      getParentRoute: () => teach,
      path: "session",
      component: Session.options.component!,
      validateSearch: Session.options.validateSearch,
    }),
  ]);
  const upskilling: AnyRoute = createRoute({
    getParentRoute: () => root,
    path: "/learner/upskilling",
    component: UpskillingLayout.options.component!,
  });
  const pathways = upskilling.addChildren([
    createRoute({
      getParentRoute: () => upskilling,
      path: "/",
      component: Upskilling.options.component!,
    }),
    createRoute({
      getParentRoute: () => upskilling,
      path: "$id",
      component: Pathway.options.component!,
      loader: Pathway.options.loader!,
      notFoundComponent: Pathway.options.notFoundComponent!,
    }),
  ]);
  const routes = [
    createRoute({ getParentRoute: () => root, path: "/", component: Home.options.component! }),
    createRoute({
      getParentRoute: () => root,
      path: "/learn",
      component: Learn.options.component!,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/badges/$code",
      component: Badge.options.component!,
      loader: Badge.options.loader!,
      notFoundComponent: Badge.options.notFoundComponent!,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/discover",
      component: Discover.options.component!,
      validateSearch: Discover.options.validateSearch!,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/workshops/$id",
      component: Workshop.options.component!,
      loader: Workshop.options.loader!,
      notFoundComponent: Workshop.options.notFoundComponent!,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/book/$id",
      component: Book.options.component!,
      loader: Book.options.loader!,
      notFoundComponent: Book.options.notFoundComponent!,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/learning",
      component: Learning.options.component!,
    }),
    createRoute({
      getParentRoute: () => root,
      path: "/admin",
      component: Admin.options.component!,
    }),
    teaching,
    pathways,
  ];
  const router = createRouter({
    routeTree: root.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
    defaultPendingMinMs: 0,
    context: { queryClient: new QueryClient() },
  });
  await router.load();
  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { level: 1 });
  return router;
}
