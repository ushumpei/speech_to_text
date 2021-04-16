addEventListener("fetch", (event) => {
  // TODO: Find better solution.
  (<any>event).respondWith(handleRequest((<any>event).request));
});

const handleRequest = (request: Request) => {
  const DEFAULT_TEXT = Deno.env.get("DEFAULT_TEXT");

  if (!DEFAULT_TEXT) {
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return new Response(JSON.stringify({ text: DEFAULT_TEXT }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
