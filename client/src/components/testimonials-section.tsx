import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      rating: 5,
      quote: "Chrona has revolutionized our school administration. Chroney AI saves us 15 hours weekly by automating routine tasks and providing instant insights.",
      author: "Dr. Maria Johnson",
      title: "Principal, Riverside Academy",
      initials: "MJ",
      bgColor: "bg-primary/20",
      textColor: "text-primary"
    },
    {
      rating: 5,
      quote: "The mobile app keeps parents engaged and informed. Our parent satisfaction scores increased by 40% after implementing Chrona.",
      author: "Robert Peterson",
      title: "IT Director, Greenwood High",
      initials: "RP",
      bgColor: "bg-accent/20",
      textColor: "text-accent"
    },
    {
      rating: 5,
      quote: "Fee collection became effortless with automated reminders and online payments. We achieved 95% collection rate this semester.",
      author: "Sarah Chen",
      title: "Administrator, Metro Prep School",
      initials: "SC",
      bgColor: "bg-primary/20",
      textColor: "text-primary"
    }
  ];

  const stats = [
    { value: "50+", label: "Schools Served", color: "text-primary" },
    { value: "20k+", label: "Students Managed", color: "text-accent" },
    { value: "95%", label: "User Satisfaction", color: "text-primary" },
    { value: "24/7", label: "AI Support", color: "text-accent" }
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trusted by Educational Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how schools worldwide are transforming their operations with Chrona's intelligent management system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 border border-border"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-muted-foreground mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <div className={`w-10 h-10 ${testimonial.bgColor} rounded-full flex items-center justify-center mr-3`}>
                  <span className={`${testimonial.textColor} font-semibold`}>{testimonial.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.author}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
