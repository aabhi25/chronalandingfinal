import { 
  type ContactSubmission, 
  type InsertContact,
  type BlogPost,
  type InsertBlogPost,
  contactSubmissions,
  blogPosts
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Blog Posts
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private contactSubmissions: Map<string, ContactSubmission>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.contactSubmissions = new Map();
    this.blogPosts = new Map();
  }

  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const id = randomUUID();
    const contactSubmission: ContactSubmission = {
      ...insertContact,
      id,
      submittedAt: new Date(),
      company: insertContact.company || null,
      phone: insertContact.phone || null,
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
    );
  }

  // Blog Posts Implementation
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values());
    const filtered = published !== undefined 
      ? posts.filter(post => post.published === published)
      : posts;
    
    return filtered.sort((a, b) => 
      (b.publishedAt || b.createdAt).getTime() - (a.publishedAt || a.createdAt).getTime()
    );
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const blogPost: BlogPost = {
      ...insertBlogPost,
      id,
      createdAt: now,
      updatedAt: now,
      publishedAt: insertBlogPost.published ? (insertBlogPost.publishedAt || now) : null,
      tags: insertBlogPost.tags || null,
      featuredImage: insertBlogPost.featuredImage || null,
      metaDescription: insertBlogPost.metaDescription || null,
      readingTime: insertBlogPost.readingTime || null,
      published: insertBlogPost.published || false,
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;

    const updated: BlogPost = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
      publishedAt: updates.published 
        ? (updates.publishedAt || existing.publishedAt || new Date())
        : existing.publishedAt,
    };
    
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

}

// Database-backed storage using PostgreSQL and Drizzle ORM
export class PgStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required for PgStorage");
    }
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
  }

  // Contact submission methods
  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const [submission] = await this.db.insert(contactSubmissions).values(insertContact).returning();
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.submittedAt));
  }

  // Blog post methods
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    let query = this.db.select().from(blogPosts);
    
    if (published !== undefined) {
      query = query.where(eq(blogPosts.published, published));
    }
    
    return await query.orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await this.db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await this.db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    // Check for slug uniqueness
    const existing = await this.getBlogPostBySlug(insertBlogPost.slug);
    if (existing) {
      throw new Error(`Blog post with slug "${insertBlogPost.slug}" already exists`);
    }

    const now = new Date();
    const values = {
      ...insertBlogPost,
      publishedAt: insertBlogPost.published ? (insertBlogPost.publishedAt || now) : null,
    };

    const [post] = await this.db.insert(blogPosts).values(values).returning();
    return post;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    // Check for slug uniqueness if slug is being updated
    if (updates.slug) {
      const existing = await this.getBlogPostBySlug(updates.slug);
      if (existing && existing.id !== id) {
        throw new Error(`Blog post with slug "${updates.slug}" already exists`);
      }
    }

    const values = {
      ...updates,
      updatedAt: new Date(),
      publishedAt: updates.published 
        ? (updates.publishedAt || sql`COALESCE(${blogPosts.publishedAt}, NOW())`)
        : updates.published === false ? null : undefined,
    };

    // Remove undefined values
    Object.keys(values).forEach(key => {
      if (values[key as keyof typeof values] === undefined) {
        delete values[key as keyof typeof values];
      }
    });

    const [post] = await this.db.update(blogPosts).set(values).where(eq(blogPosts.id, id)).returning();
    return post;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await this.db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

}

// Use PostgreSQL storage if DATABASE_URL is available, fallback to MemStorage for development
export const storage = process.env.DATABASE_URL ? new PgStorage() : new MemStorage();
