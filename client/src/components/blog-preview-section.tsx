import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@shared/schema";

export default function BlogPreviewSection() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  // Show only the latest 1 post for compact design
  const latestPosts = posts?.slice(0, 1) || [];

  return (
    <section className="py-8 sm:py-10 bg-white dark:bg-gray-900" id="blog">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 px-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-blog-section-title">
            Latest from Our Blog
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="text-blog-section-subtitle">
            Stay updated with the latest insights, trends, and best practices in school management and educational technology.
          </p>
        </div>

        {/* Blog Posts - Single Row */}
        <div className="max-w-sm mx-auto mb-6">
          {isLoading ? (
            // Loading skeleton
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="p-0">
                <Skeleton className="h-32 w-full rounded-t-lg mb-3" />
                <div className="px-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-3" />
                </div>
              </CardHeader>
            </Card>
          ) : latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300 group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" data-testid={`card-blog-preview-${post.id}`}>
                <CardHeader className="p-0">
                  {post.featuredImage && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        data-testid={`img-blog-preview-${post.id}`}
                      />
                    </div>
                  )}
                  <div className="p-4 pb-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2" data-testid={`text-blog-preview-title-${post.id}`}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2" data-testid={`text-blog-preview-excerpt-${post.id}`}>
                      {post.excerpt}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span data-testid={`text-blog-preview-date-${post.id}`}>
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span data-testid={`text-blog-preview-reading-time-${post.id}`}>{post.readingTime}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags?.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5" data-testid={`badge-blog-preview-tag-${post.id}-${index}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors text-sm" data-testid={`button-blog-preview-read-${post.id}`}>
                      Read Article
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-6">
              <div className="text-gray-500 dark:text-gray-400">
                <h3 className="text-base font-semibold mb-1" data-testid="text-no-blog-posts">No blog posts available</h3>
                <p className="text-sm" data-testid="text-no-blog-posts-subtitle">Check back soon for updates!</p>
              </div>
            </div>
          )}
        </div>

        {/* View All Blog Posts CTA */}
        <div className="text-center">
          <Link to="/blog">
            <Button size="default" variant="outline" className="group" data-testid="button-view-all-blog">
              View All Posts
              <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
