// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").notNull().default(sql`now()`)
});
var blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull().default("Admin"),
  featuredImage: text("featured_image"),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  metaDescription: text("meta_description"),
  readingTime: text("reading_time")
});
var insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  author: z.string().min(2, "Author name must be at least 2 characters"),
  featuredImage: z.string().url().optional(),
  published: z.boolean().optional(),
  publishedAt: z.date().optional(),
  tags: z.array(z.string()).optional(),
  metaDescription: z.string().max(160, "Meta description must be 160 characters or less").optional(),
  readingTime: z.string().optional()
});
var adminBlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  author: z.string().min(2, "Author name must be at least 2 characters")
});

// server/storage.ts
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, sql as sql2 } from "drizzle-orm";
var MemStorage = class {
  contactSubmissions;
  blogPosts;
  constructor() {
    this.contactSubmissions = /* @__PURE__ */ new Map();
    this.blogPosts = /* @__PURE__ */ new Map();
  }
  async createContactSubmission(insertContact) {
    const id = randomUUID();
    const contactSubmission = {
      ...insertContact,
      id,
      submittedAt: /* @__PURE__ */ new Date(),
      company: insertContact.company || null,
      phone: insertContact.phone || null
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }
  async getContactSubmissions() {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
    );
  }
  // Blog Posts Implementation
  async getBlogPosts(published) {
    const posts = Array.from(this.blogPosts.values());
    const filtered = published !== void 0 ? posts.filter((post) => post.published === published) : posts;
    return filtered.sort(
      (a, b) => (b.publishedAt || b.createdAt).getTime() - (a.publishedAt || a.createdAt).getTime()
    );
  }
  async getBlogPost(id) {
    return this.blogPosts.get(id);
  }
  async getBlogPostBySlug(slug) {
    return Array.from(this.blogPosts.values()).find((post) => post.slug === slug);
  }
  async createBlogPost(insertBlogPost) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const blogPost = {
      ...insertBlogPost,
      id,
      createdAt: now,
      updatedAt: now,
      publishedAt: insertBlogPost.published ? insertBlogPost.publishedAt || now : null,
      tags: insertBlogPost.tags || null,
      featuredImage: insertBlogPost.featuredImage || null,
      metaDescription: insertBlogPost.metaDescription || null,
      readingTime: insertBlogPost.readingTime || null,
      published: insertBlogPost.published || false
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  async updateBlogPost(id, updates) {
    const existing = this.blogPosts.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updates,
      id,
      // Ensure ID doesn't change
      updatedAt: /* @__PURE__ */ new Date(),
      publishedAt: updates.published ? updates.publishedAt || existing.publishedAt || /* @__PURE__ */ new Date() : existing.publishedAt
    };
    this.blogPosts.set(id, updated);
    return updated;
  }
  async deleteBlogPost(id) {
    return this.blogPosts.delete(id);
  }
};
var PgStorage = class {
  db;
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required for PgStorage");
    }
    const sql3 = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql3);
  }
  // Contact submission methods
  async createContactSubmission(insertContact) {
    const [submission] = await this.db.insert(contactSubmissions).values(insertContact).returning();
    return submission;
  }
  async getContactSubmissions() {
    return await this.db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.submittedAt));
  }
  // Blog post methods
  async getBlogPosts(published) {
    let query = this.db.select().from(blogPosts);
    if (published !== void 0) {
      query = query.where(eq(blogPosts.published, published));
    }
    return await query.orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
  }
  async getBlogPost(id) {
    const [post] = await this.db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  async getBlogPostBySlug(slug) {
    const [post] = await this.db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  async createBlogPost(insertBlogPost) {
    const existing = await this.getBlogPostBySlug(insertBlogPost.slug);
    if (existing) {
      throw new Error(`Blog post with slug "${insertBlogPost.slug}" already exists`);
    }
    const now = /* @__PURE__ */ new Date();
    const values = {
      ...insertBlogPost,
      publishedAt: insertBlogPost.published ? insertBlogPost.publishedAt || now : null
    };
    const [post] = await this.db.insert(blogPosts).values(values).returning();
    return post;
  }
  async updateBlogPost(id, updates) {
    if (updates.slug) {
      const existing = await this.getBlogPostBySlug(updates.slug);
      if (existing && existing.id !== id) {
        throw new Error(`Blog post with slug "${updates.slug}" already exists`);
      }
    }
    const values = {
      ...updates,
      updatedAt: /* @__PURE__ */ new Date(),
      publishedAt: updates.published ? updates.publishedAt || sql2`COALESCE(${blogPosts.publishedAt}, NOW())` : updates.published === false ? null : void 0
    };
    Object.keys(values).forEach((key) => {
      if (values[key] === void 0) {
        delete values[key];
      }
    });
    const [post] = await this.db.update(blogPosts).set(values).where(eq(blogPosts.id, id)).returning();
    return post;
  }
  async deleteBlogPost(id) {
    const result = await this.db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }
};
var storage = process.env.DATABASE_URL ? new PgStorage() : new MemStorage();

// server/routes.ts
import { z as z2 } from "zod";
import nodemailer from "nodemailer";
var contactRateLimit = /* @__PURE__ */ new Map();
var RATE_LIMIT_WINDOW = 15 * 60 * 1e3;
var RATE_LIMIT_MAX = 3;
function checkRateLimit(ip) {
  const now = Date.now();
  const userLimit = contactRateLimit.get(ip);
  if (!userLimit || now > userLimit.resetTime) {
    contactRateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  userLimit.count++;
  return true;
}
async function registerRoutes(app2) {
  const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== "Bearer Abhk#8shm3") {
      return res.status(401).json({ message: "Admin access required" });
    }
    next();
  };
  app2.post("/api/contact", async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress || "unknown";
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        message: "Too many contact form submissions. Please try again in 15 minutes."
      });
    }
    try {
      const contactData = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(contactData);
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          // Test SMTP server
          port: 587,
          secure: false,
          auth: {
            user: "test@example.com",
            // Mock credentials
            pass: "password123"
          }
        });
        const escapeHtml = (text2) => {
          return text2.replace(/[<>&"']/g, (match) => {
            switch (match) {
              case "<":
                return "&lt;";
              case ">":
                return "&gt;";
              case "&":
                return "&amp;";
              case '"':
                return "&quot;";
              case "'":
                return "&#39;";
              default:
                return match;
            }
          });
        };
        const escapedName = escapeHtml(contactData.name);
        const escapedEmail = escapeHtml(contactData.email);
        const escapedCompany = contactData.company ? escapeHtml(contactData.company) : "";
        const escapedPhone = contactData.phone ? escapeHtml(contactData.phone) : "";
        const escapedMessage = escapeHtml(contactData.message).replace(/\n/g, "<br>");
        await transporter.sendMail({
          from: '"Chrona Contact Form" <noreply@chrona.com>',
          to: "hello@chrona.com",
          // Where to send contact form submissions
          subject: `New Contact Form Submission from ${escapedName}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapedName}</p>
            <p><strong>Email:</strong> ${escapedEmail}</p>
            ${escapedCompany ? `<p><strong>Company:</strong> ${escapedCompany}</p>` : ""}
            ${escapedPhone ? `<p><strong>Phone:</strong> ${escapedPhone}</p>` : ""}
            <p><strong>Message:</strong></p>
            <p>${escapedMessage}</p>
          `
        });
      } catch (emailError) {
        console.log("Email sending failed (expected in development):", emailError);
      }
      res.status(201).json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        id: submission.id
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({
          success: false,
          message: "Please check your form data",
          errors: error.errors
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({
          success: false,
          message: "Something went wrong. Please try again later."
        });
      }
    }
  });
  app2.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published !== void 0 ? req.query.published === "true" : true;
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      if (!post.published) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.post("/api/blog", adminAuth, async (req, res) => {
    try {
      const blogData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(blogData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Error creating blog post:", error);
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });
  app2.put("/api/blog/:id", adminAuth, async (req, res) => {
    try {
      const updates = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, updates);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });
  app2.delete("/api/blog/:id", adminAuth, async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
  app2.get("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.post("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const postData = adminBlogPostSchema.parse(req.body);
      const slug = postData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      const fullPostData = {
        ...postData,
        slug,
        published: true,
        publishedAt: /* @__PURE__ */ new Date(),
        featuredImage: void 0,
        tags: [],
        metaDescription: void 0,
        readingTime: void 0
      };
      const post = await storage.createBlogPost(fullPostData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Error creating blog post:", error);
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });
  app2.put("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      const postData = adminBlogPostSchema.parse(req.body);
      const slug = postData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      const updates = {
        ...postData,
        slug,
        updatedAt: /* @__PURE__ */ new Date()
      };
      const post = await storage.updateBlogPost(req.params.id, updates);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });
  app2.get("/api/admin/contact", adminAuth, async (req, res) => {
    try {
      const messages = await storage.getContactSubmissions();
      const sortedMessages = messages.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      res.json(sortedMessages);
    } catch (error) {
      console.error("Error fetching admin contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5e3,
    hmr: {
      port: 5e3
    },
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
