import { Hono } from "./deps.js";
import { sql } from "./database.js";

const app = new Hono();

app.get("/books", async (c) => {
    return c.json(await sql`SELECT * FROM books`);
  });
  
  app.post("/books", async (c) => {
    const body = await c.req.json();
    await sql`INSERT INTO books (name, pages, isbn) VALUES (${body.name}, ${body.pages}, ${body.isbn})`;
    return c.json({ status: "ok" });
  });
  
  app.get("/books/:id", async (c) => {
    const id = c.req.param("id");
    const rows = await sql`SELECT * FROM books WHERE id = ${id}`;
    if (rows.length === 0) {
      return c.json({ status: "Not found" }, 404);
    }
  
    return c.json(rows[0]);
  });
  
  app.put("/books/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    await sql`UPDATE books SET name = ${body.name}, pages = ${body.pages}, isbn = ${body.isbn} WHERE id = ${id}`;
    // here we assume that such an address exists -- could also check whether one exists
    return c.json({ status: "ok" });
  });
  
  app.delete("/books/:id", async (c) => {
    const id = c.req.param("id");
    await sql`DELETE FROM books WHERE id = ${id}`;
    // here we assume that such an address exists -- could also check whether one exists
    return c.json({ status: "ok" });
  });

export default app;
