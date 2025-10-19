import { Bot, Calendar, UserCog, Users, GraduationCap, ClipboardCheck, CreditCard, MessageCircle, Truck, BookOpen, BarChart3, Shield } from "lucide-react";

export default function FeaturesSection() {
  const aiFeatures = [
    {
      icon: Bot,
      title: "AI Timetabling & Substitutions",
      description: "Instantly assign teachers and plan schedules.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: UserCog,
      title: "AI Teacher Planner",
      description: "Simulate and balance staffing effortlessly.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageCircle,
      title: "Chat with AI Chrona",
      description: "Manage everything with natural conversation.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const allFeatures = [
    { 
      icon: Users, 
      title: "Attendance", 
      gradient: "from-sky-200 to-blue-100",
      iconGradient: "from-sky-500 to-blue-500",
      textColor: "text-blue-700"
    },
    { 
      icon: ClipboardCheck, 
      title: "Exams", 
      gradient: "from-purple-200 to-pink-100",
      iconGradient: "from-purple-500 to-pink-500",
      textColor: "text-purple-700"
    },
    { 
      icon: CreditCard, 
      title: "Fees", 
      gradient: "from-orange-200 to-amber-100",
      iconGradient: "from-orange-500 to-amber-500",
      textColor: "text-orange-700"
    },
    { 
      icon: GraduationCap, 
      title: "Payroll", 
      gradient: "from-emerald-200 to-teal-100",
      iconGradient: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-700"
    },
    { 
      icon: UserCog, 
      title: "HR", 
      gradient: "from-indigo-200 to-violet-100",
      iconGradient: "from-indigo-500 to-violet-500",
      textColor: "text-indigo-700"
    },
    { 
      icon: Truck, 
      title: "Transport", 
      gradient: "from-cyan-200 to-sky-100",
      iconGradient: "from-cyan-500 to-sky-500",
      textColor: "text-cyan-700"
    },
    { 
      icon: BarChart3, 
      title: "Analytics", 
      gradient: "from-rose-200 to-pink-100",
      iconGradient: "from-rose-500 to-pink-500",
      textColor: "text-rose-700"
    },
    { 
      icon: Shield, 
      title: "Role-based Access", 
      gradient: "from-red-200 to-orange-100",
      iconGradient: "from-red-500 to-orange-500",
      textColor: "text-red-700"
    },
    { 
      icon: BookOpen, 
      title: "Multi-school Support", 
      gradient: "from-violet-200 to-purple-100",
      iconGradient: "from-violet-500 to-purple-500",
      textColor: "text-violet-700"
    },
    { 
      icon: Calendar, 
      title: "Timetables", 
      gradient: "from-teal-200 to-emerald-100",
      iconGradient: "from-teal-500 to-emerald-500",
      textColor: "text-teal-700"
    },
    { 
      icon: MessageCircle, 
      title: "Communication", 
      gradient: "from-fuchsia-200 to-pink-100",
      iconGradient: "from-fuchsia-500 to-pink-500",
      textColor: "text-fuchsia-700"
    },
    { 
      icon: GraduationCap, 
      title: "LMS", 
      gradient: "from-yellow-200 to-amber-100",
      iconGradient: "from-yellow-500 to-amber-500",
      textColor: "text-amber-700"
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 relative bg-white overflow-hidden">
      {/* Faded purple-pink gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-pink-50/30 to-blue-100/40"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Smarter Schools.{" "}
            <span className="bg-gradient-to-r from-[#FF4D4D] to-[#9333EA] bg-clip-text text-transparent">
              Simplified.
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Run your school smarter - powered by intelligent automation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-24">
          {aiFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-6 sm:p-8 border border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                data-testid={`ai-feature-card-${index}`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-6`}>
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="relative">
          {/* Decorative background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-3xl -z-10"></div>
          
          <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3">
                <span className="text-[#0C1445]">All-in-One School</span>{" "}
                <span className="bg-gradient-to-r from-[#FF4D4D] to-[#9333EA] bg-clip-text text-transparent">
                  Management Suite
                </span>
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Everything you need to run your educational institution efficiently.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {allFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={index}
                    className={`group relative bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 overflow-hidden border border-gray-100 min-h-[120px] sm:min-h-[140px]`}
                  >
                    {/* Subtle shine effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.iconGradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <p className={`text-xs sm:text-sm font-semibold ${feature.textColor} leading-tight`}>
                        {feature.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
