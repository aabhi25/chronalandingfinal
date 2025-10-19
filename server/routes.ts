import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBlogPostSchema, adminBlogPostSchema, type AdminBlogPost } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: 'upload_assets/', // Save files to upload_assets directory
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Simple rate limiting for contact form
const contactRateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 3; // 3 submissions per 15 minutes per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = contactRateLimit.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit window
    contactRateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple admin authentication middleware
  const adminAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== "Bearer Abhk#8shm3") {
      return res.status(401).json({ message: "Admin access required" });
    }
    next();
  };

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        success: false, 
        message: "Too many contact form submissions. Please try again in 15 minutes." 
      });
    }
    try {
      const contactData = insertContactSchema.parse(req.body);
      
      // Save to storage
      const submission = await storage.createContactSubmission(contactData);
      
      // Send email notification (mock for now - would need real SMTP config)
      try {
        // Create a test transporter (you'd configure this with real SMTP settings)
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email", // Test SMTP server
          port: 587,
          secure: false,
          auth: {
            user: "test@example.com", // Mock credentials
            pass: "password123"
          }
        });

        // Helper function to escape HTML
        const escapeHtml = (text: string) => {
          return text.replace(/[<>&"']/g, (match) => {
            switch (match) {
              case '<': return '&lt;';
              case '>': return '&gt;';
              case '&': return '&amp;';
              case '"': return '&quot;';
              case "'": return '&#39;';
              default: return match;
            }
          });
        };

        const escapedName = escapeHtml(contactData.name);
        const escapedEmail = escapeHtml(contactData.email);
        const escapedCompany = contactData.company ? escapeHtml(contactData.company) : '';
        const escapedPhone = contactData.phone ? escapeHtml(contactData.phone) : '';
        const escapedMessage = escapeHtml(contactData.message).replace(/\n/g, '<br>');

        await transporter.sendMail({
          from: '"Chrona Contact Form" <noreply@chrona.com>',
          to: "hello@chrona.com", // Where to send contact form submissions
          subject: `New Contact Form Submission from ${escapedName}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapedName}</p>
            <p><strong>Email:</strong> ${escapedEmail}</p>
            ${escapedCompany ? `<p><strong>Company:</strong> ${escapedCompany}</p>` : ''}
            ${escapedPhone ? `<p><strong>Phone:</strong> ${escapedPhone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${escapedMessage}</p>
          `
        });
      } catch (emailError) {
        console.log("Email sending failed (expected in development):", emailError);
        // Don't fail the request if email fails - just log it
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Thank you for your message! We'll get back to you soon.",
        id: submission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
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

  // Blog Posts API
  app.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published !== undefined ? req.query.published === 'true' : true;
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      // Only return published posts for public API
      if (!post.published) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", adminAuth, async (req, res) => {
    try {
      const blogData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(blogData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Error creating blog post:", error);
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/blog/:id", adminAuth, async (req, res) => {
    try {
      const updates = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, updates);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });

  app.delete("/api/blog/:id", adminAuth, async (req, res) => {
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


  // Admin endpoints - protected by authentication
  // Get all blog posts for admin
  app.get("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(); // Get all posts, not just published
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Create blog post (admin)
  app.post("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const postData = adminBlogPostSchema.parse(req.body);
      
      // Generate slug from title
      const slug = postData.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const fullPostData = {
        ...postData,
        slug,
        published: true,
        publishedAt: new Date(),
        featuredImage: postData.featuredImage || null,
        tags: postData.tags || [],
        metaDescription: undefined,
        readingTime: undefined,
      };
      
      const post = await storage.createBlogPost(fullPostData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Error creating blog post:", error);
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });

  // Update blog post (admin)
  app.put("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      const postData = adminBlogPostSchema.parse(req.body);
      
      // Generate new slug if title changed
      const slug = postData.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const updates = {
        ...postData,
        slug,
        updatedAt: new Date(),
      };
      
      const post = await storage.updateBlogPost(req.params.id, updates);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
      } else {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });

  // Delete blog post (admin)
  app.delete("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Local file upload endpoints
  // Handle file uploads
  app.post("/api/admin/upload", adminAuth, upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Generate a unique filename with proper extension
      const fileExtension = path.extname(req.file.originalname);
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
      const oldPath = req.file.path;
      const newPath = path.join('upload_assets', uniqueFilename);

      // Rename the file to have a proper extension
      fs.renameSync(oldPath, newPath);

      // Return the URL path to access the file
      const imageUrl = `/upload_assets/${uniqueFilename}`;
      
      res.json({ 
        success: true,
        imageUrl: imageUrl,
        filename: uniqueFilename
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Serve uploaded images
  app.get("/upload_assets/:filename", (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join('upload_assets', filename);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set appropriate headers for image files
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Send the file
    res.sendFile(path.resolve(filepath));
  });

  // Get all contact messages for admin (view-only)
  app.get("/api/admin/contact", adminAuth, async (req, res) => {
    try {
      const messages = await storage.getContactSubmissions();
      // Sort by newest first
      const sortedMessages = messages.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      res.json(sortedMessages);
    } catch (error) {
      console.error("Error fetching admin contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // Database backup download endpoint
  app.get("/api/admin/download-database", adminAuth, (req, res) => {
    const format = req.query.format as string;
    const backupPath = format === 'compressed' ? 'chrona_database_backup.sql.gz' : 'chrona_database_backup.sql';
    const filename = format === 'compressed' ? 'chrona_database_backup.sql.gz' : 'chrona_database_backup.sql';
    
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ error: "Database backup not found" });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', format === 'compressed' ? 'application/gzip' : 'text/plain');
    res.sendFile(path.resolve(backupPath));
  });

  const httpServer = createServer(app);

  return httpServer;
}
