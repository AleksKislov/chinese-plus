import { component$, Slot } from "@builder.io/qwik";
import Header from "../components/common/layout/header/header";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { Footer } from "~/components/common/layout/footer";

// @todo change type to MentionType or CommentType
export const getNewMentions = routeLoader$(async ({ cookie }): Promise<[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get("/api/comments/to_me/false", token, []);
});

export default component$(() => {
  return (
    <>
      <main class={"flex flex-col min-h-screen"}>
        <Header />
        <section class={"relative flex flex-col min-h-screen justify-between"}>
          <div class='relative container mx-auto px-4 lg:px-28'>
            <Slot />
          </div>
          <Footer />
        </section>
      </main>
    </>
  );
});
