// import "https://deno.land/x/fetch_event_adapter/listen.ts";

addEventListener("fetch", async (event) => {
  // TODO: Find better solution.
  const response = await handleRequest((<any>event).request);
  (<any>event).respondWith(response);
});

const handleRequest = async (request: Request): Promise<Response> => {
  const DEFAULT_TEXT = Deno.env.get("DEFAULT_TEXT");

  if (!DEFAULT_TEXT) {
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  if (!request.headers.has("content-type")) {
    return new Response(
      JSON.stringify({ error: "please provide 'content-type' header" }),
      {
        status: 400,
        statusText: "Bad Request",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }

  const contentType = request.headers.get("content-type") as string;
  const responseInit = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  if (contentType.includes("multipart/form-data")) {
    const formData: FormData = await request.formData();
    const formDataJSON: { [k: string]: FormDataEntryValue } = {};
    for (const [key, value] of formData.entries()) {
      formDataJSON[key] = value;
    }
    return new Response(
      JSON.stringify({ form: formDataJSON }, null, 2),
      responseInit
    );
  }

  return new Response(null, {
    status: 415,
    statusText: "Unsupported Media Type",
  });
};
