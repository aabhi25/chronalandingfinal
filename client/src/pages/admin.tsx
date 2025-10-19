import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Plus, Edit, Save, X, Mail, Calendar, User, Trash2, Upload, Tag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  featuredImage?: string;
  tags?: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  submittedAt: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    featuredImage: "",
    tags: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if already authenticated on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = "Abhk#8shm3";
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setAuthError("");
      setPassword("");
    } else {
      setAuthError("Access Denied");
      setPassword("");
    }
  };
  
  // Fetch blog posts
  const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/blog", undefined, {
        "Authorization": "Bearer Abhk#8shm3"
      });
      return response.json();
    },
    enabled: isAuthenticated,
  });
  
  // Fetch contact messages
  const { data: contactMessages = [], isLoading: contactLoading } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/contact", undefined, {
        "Authorization": "Bearer Abhk#8shm3"
      });
      return response.json();
    },
    enabled: isAuthenticated,
  });
  
  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: async (post: typeof newPost) => {
      const response = await apiRequest("POST", "/api/admin/blog", {
        ...post,
        tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : [],
      }, {
        "Authorization": "Bearer Abhk#8shm3"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setIsCreating(false);
      setNewPost({ title: "", excerpt: "", content: "", author: "", featuredImage: "", tags: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    },
  });
  
  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (post: BlogPost) => {
      const response = await apiRequest("PUT", `/api/admin/blog/${post.id}`, {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        featuredImage: post.featuredImage,
        tags: typeof post.tags === 'string' ? post.tags.split(',').map((tag: string) => tag.trim()) : post.tags,
      }, {
        "Authorization": "Bearer Abhk#8shm3"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setEditingPost(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/blog/${postId}`, undefined, {
        "Authorization": "Bearer Abhk#8shm3"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });
  
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin Access - Chrona</title>
          <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
          <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Enter password to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {authError && (
                  <p className="text-sm text-destructive font-medium">{authError}</p>
                )}
                <Button type="submit" className="w-full">
                  Access Admin Panel
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard - Chrona</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
      </Helmet>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem("admin_authenticated");
            }}
          >
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="blog" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="messages">Contact Messages</TabsTrigger>
          </TabsList>
          
          {/* Blog Posts Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Blog Posts</h2>
              <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
            
            {/* Create New Post */}
            {isCreating && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Blog Post</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => createPostMutation.mutate(newPost)}
                      disabled={createPostMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setNewPost({ title: "", excerpt: "", content: "", author: "", featuredImage: "", tags: "" });
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="new-title">Title</Label>
                    <Input
                      id="new-title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Blog post title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-excerpt">Excerpt</Label>
                    <Textarea
                      id="new-excerpt"
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                      placeholder="Brief description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-author">Author</Label>
                    <Input
                      id="new-author"
                      value={newPost.author}
                      onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-featured-image">Featured Image</Label>
                    <div className="space-y-2">
                      {newPost.featuredImage && (
                        <div className="relative">
                          <img 
                            src={newPost.featuredImage} 
                            alt="Featured image preview"
                            className="w-full h-32 object-cover rounded-md border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setNewPost({ ...newPost, featuredImage: "" })}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <ObjectUploader
                        maxFileSize={5 * 1024 * 1024} // 5MB max
                        onComplete={(result) => {
                          if (result.success && result.imageUrl) {
                            setNewPost({ ...newPost, featuredImage: result.imageUrl });
                          } else if (result.error) {
                            console.error("Upload failed:", result.error);
                          }
                        }}
                        buttonClassName="w-full"
                      >
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          <span>{newPost.featuredImage ? "Replace Image" : "Upload Featured Image"}</span>
                        </div>
                      </ObjectUploader>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-tags">Tags (comma-separated)</Label>
                    <Input
                      id="new-tags"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                      placeholder="AI, Education, Technology"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-content">Content</Label>
                    <Textarea
                      id="new-content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Blog post content (supports markdown)"
                      rows={10}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Blog Posts List */}
            {blogLoading ? (
              <div className="text-center py-8">Loading blog posts...</div>
            ) : (
              <div className="space-y-4">
                {blogPosts.map((post: BlogPost) => (
                  <Card key={post.id}>
                    {editingPost?.id === post.id ? (
                      // Edit Mode
                      <>
                        <CardHeader>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updatePostMutation.mutate(editingPost)}
                              disabled={updatePostMutation.isPending}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingPost(null)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={editingPost.title}
                              onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Excerpt</Label>
                            <Textarea
                              value={editingPost.excerpt}
                              onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>Author</Label>
                            <Input
                              value={editingPost.author}
                              onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Featured Image</Label>
                            <div className="space-y-2">
                              {editingPost.featuredImage && (
                                <div className="relative">
                                  <img 
                                    src={editingPost.featuredImage} 
                                    alt="Featured image preview"
                                    className="w-full h-32 object-cover rounded-md border"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setEditingPost({ ...editingPost, featuredImage: "" })}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                              <ObjectUploader
                                maxFileSize={5 * 1024 * 1024} // 5MB max
                                onComplete={(result) => {
                                  if (result.success && result.imageUrl) {
                                    setEditingPost({ ...editingPost, featuredImage: result.imageUrl });
                                  } else if (result.error) {
                                    console.error("Upload failed:", result.error);
                                  }
                                }}
                                buttonClassName="w-full"
                              >
                                <div className="flex items-center gap-2">
                                  <Upload className="w-4 h-4" />
                                  <span>{editingPost.featuredImage ? "Replace Image" : "Upload Featured Image"}</span>
                                </div>
                              </ObjectUploader>
                            </div>
                          </div>
                          <div>
                            <Label>Tags (comma-separated)</Label>
                            <Input
                              value={Array.isArray(editingPost.tags) ? editingPost.tags.join(', ') : (editingPost.tags as string) || ""}
                              onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value as any })}
                              placeholder="AI, Education, Technology"
                            />
                          </div>
                          <div>
                            <Label>Content</Label>
                            <Textarea
                              value={editingPost.content}
                              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                              rows={10}
                            />
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      // View Mode
                      <>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{post.title}</CardTitle>
                              <CardDescription>
                                By {post.author} • {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingPost({ ...post })}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={deletePostMutation.isPending}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deletePostMutation.mutate(post.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete Post
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {post.featuredImage && (
                            <div className="mb-4">
                              <img 
                                src={post.featuredImage} 
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            <p>Created: {new Date(post.createdAt).toLocaleString()}</p>
                            <p>Updated: {new Date(post.updatedAt).toLocaleString()}</p>
                          </div>
                        </CardContent>
                      </>
                    )}
                  </Card>
                ))}
                {blogPosts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No blog posts yet. Create your first post!
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Contact Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-semibold">Contact Messages</h2>
            
            {contactLoading ? (
              <div className="text-center py-8">Loading messages...</div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((message: ContactMessage) => (
                  <Card key={message.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {message.name}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {message.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(message.submittedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {message.company && (
                        <div>
                          <Label className="text-sm font-medium">Organization</Label>
                          <p className="text-sm text-muted-foreground">{message.company}</p>
                        </div>
                      )}
                      {message.phone && (
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <p className="text-sm text-muted-foreground">{message.phone}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium">Message</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md">
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {contactMessages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No contact messages received yet.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}