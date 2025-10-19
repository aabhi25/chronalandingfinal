import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "wouter";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@shared/schema";

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  useEffect(() => {
    // Set SEO metadata
    document.title = "Blog - Chrona School Management System | Educational Technology Insights";
    
    // Update or create meta description
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription) {
      metaDescription.content = "Stay updated with the latest insights, trends, and best practices in school management and educational technology from Chrona.";
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = "Stay updated with the latest insights, trends, and best practices in school management and educational technology from Chrona.";
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

    updateOGTag('og:title', 'Chrona Blog - Educational Technology Insights');
    updateOGTag('og:description', 'Stay updated with the latest insights, trends, and best practices in school management and educational technology from Chrona.');
    updateOGTag('og:type', 'website');
    updateOGTag('og:url', window.location.href);

    return () => {
      // Cleanup is not necessary for SEO meta tags as they should persist
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700" data-testid="link-home">
                ← Back to Home
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

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-page-title">
            Chrona Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-testid="text-page-subtitle">
            Insights, updates, and best practices for modern school management. 
            Stay informed about the latest trends in educational technology.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : posts?.length ? (
            posts.map((post) => (
              <Card key={post.id} className="h-full hover:shadow-lg transition-shadow duration-300 group" data-testid={`card-blog-${post.id}`}>
                <CardHeader className="p-0">
                  {post.featuredImage && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        data-testid={`img-featured-${post.id}`}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors" data-testid={`text-title-${post.id}`}>
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3" data-testid={`text-excerpt-${post.id}`}>
                      {post.excerpt}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span data-testid={`text-date-${post.id}`}>
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span data-testid={`text-reading-time-${post.id}`}>{post.readingTime}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs" data-testid={`badge-tag-${post.id}-${index}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors" data-testid={`button-read-${post.id}`}>
                      Read Article
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-posts">No blog posts found</h3>
                <p data-testid="text-no-posts-subtitle">Check back soon for updates and insights!</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-cta-title">
            Ready to Transform Your School Management?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto" data-testid="text-cta-subtitle">
            Join hundreds of schools already using Chrona to streamline operations and improve student outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" data-testid="button-cta-demo">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}