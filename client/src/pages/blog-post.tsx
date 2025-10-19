import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { CalendarIcon, ClockIcon, ArrowLeftIcon, ShareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    queryFn: () => fetch(`/api/blog/${slug}`).then(res => {
      if (!res.ok) throw new Error('Post not found');
      return res.json();
    }),
    enabled: !!slug,
  });

  useEffect(() => {
    if (post) {
      // Set SEO metadata for the specific blog post
      document.title = `${post.title} | Chrona Blog`;
      
      // Update or create meta description
      const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      const description = post.metaDescription || post.excerpt;
      if (metaDescription) {
        metaDescription.content = description;
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }

      // Open Graph tags for social sharing
      const updateOGTag = (property: string, content: string) => {
        const existing = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (existing) {
          existing.content = content;
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', property);
          meta.content = content;
          document.head.appendChild(meta);
        }
      };

      updateOGTag('og:title', post.title);
      updateOGTag('og:description', description);
      updateOGTag('og:type', 'article');
      updateOGTag('og:url', window.location.href);
      if (post.featuredImage) {
        updateOGTag('og:image', post.featuredImage);
      }

      // Article-specific metadata
      updateOGTag('article:published_time', (post.publishedAt || post.createdAt).toString());
      if (post.tags) {
        post.tags.forEach(tag => {
          const existingTags = document.querySelectorAll('meta[property="article:tag"]');
          const hasTag = Array.from(existingTags).some(meta => (meta as HTMLMetaElement).content === tag);
          if (!hasTag) {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'article:tag');
            meta.content = tag;
            document.head.appendChild(meta);
          }
        });
      }

      // Add Article structured data (JSON-LD)
      const existingSchema = document.querySelector('script[type="application/ld+json"][data-type="article"]');
      if (existingSchema) {
        existingSchema.remove();
      }
      
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription || post.excerpt,
        "image": post.featuredImage || "https://chrona.in/logo.png",
        "datePublished": (post.publishedAt || post.createdAt).toString(),
        "dateModified": post.updatedAt?.toString() || (post.publishedAt || post.createdAt).toString(),
        "author": {
          "@type": "Organization",
          "name": "AI Chrona"
        },
        "publisher": {
          "@type": "Organization",
          "name": "AI Chrona",
          "logo": {
            "@type": "ImageObject",
            "url": "https://chrona.in/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": window.location.href
        }
      };
      
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-type', 'article');
      schemaScript.textContent = JSON.stringify(articleSchema);
      document.head.appendChild(schemaScript);
    } else if (error) {
      // Set error page metadata
      document.title = "Post Not Found | Chrona Blog";
      const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDescription) {
        metaDescription.content = "The blog post you're looking for doesn't exist or has been removed.";
      }
    }
  }, [post, error]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-error-title">
            Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8" data-testid="text-error-message">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-back-to-blog">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/blog">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700" data-testid="link-back-to-blog">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700" data-testid="link-contact">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          // Loading skeleton
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-64 w-full mb-8 rounded-lg" />
            <div className="mb-8">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <div className="flex space-x-4 mb-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ) : post ? (
          <article className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                  data-testid="img-featured"
                />
              </div>
            )}

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-article-title">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6" data-testid="text-article-excerpt">
                {post.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span data-testid="text-publish-date">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span data-testid="text-reading-time">{post.readingTime}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-gray-500 hover:text-blue-600"
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: post.title,
                          text: post.excerpt,
                          url: window.location.href,
                        });
                      } catch (error: any) {
                        // Ignore cancellation - user simply cancelled the share dialog
                        if (error?.message !== "Share canceled") {
                          console.error("Share failed:", error);
                        }
                      }
                    } else {
                      // Fallback to copying URL to clipboard
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                      } catch (error) {
                        console.error("Failed to copy to clipboard:", error);
                      }
                    }
                  }}
                  data-testid="button-share"
                >
                  <ShareIcon className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" data-testid={`badge-tag-${index}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-blue-600 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:border-blue-700 dark:prose-blockquote:bg-blue-900/20"
              data-testid="content-article-body"
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br />').replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>')
              }}
            />

            {/* Article Footer CTA */}
            <Card className="mt-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-footer-cta-title">
                  Ready to See Chrona in Action?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto" data-testid="text-footer-cta-subtitle">
                  Experience how Chrona can transform your school management with our AI-powered platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" data-testid="button-footer-cta-demo">
                      Schedule a Demo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Navigation to other posts */}
            <div className="mt-12 text-center">
              <Link to="/blog">
                <Button variant="outline" size="lg" data-testid="button-view-more-posts">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  View More Posts
                </Button>
              </Link>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}