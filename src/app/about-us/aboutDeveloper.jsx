'use client';

import {
  Briefcase,
  CheckCircle,
  Code,
  Cpu,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  Star,
  Target,
  User,
  Users,
} from 'lucide-react';

const AboutDeveloper = () => {
  const developerStats = [
    { icon: Briefcase, label: 'Experience', value: 'Fresher', color: 'blue' },
    { icon: GraduationCap, label: 'Education', value: 'MCA', color: 'green' },
    { icon: Target, label: 'Focus', value: 'Full-Stack', color: 'purple' },
  ];

  // Using simple tech list without external icons for compatibility
  const techStack = [
    { name: 'Full-Stack Development', color: 'blue' },
    { name: 'Java Full-Stack Development', color: 'red' },
    { name: 'Engineering', color: 'green' },
  ];

  const programmingLanguages = [
    { name: 'Java', color: 'red' },
    { name: 'JavaScript', color: 'yellow' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      pink: 'bg-pink-100 text-pink-600 border-pink-200',
      cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      black: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="border-t border-gray-200 pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-2 sm:mx-4 lg:mx-8">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Meet the Developer</h2>
        <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
        {/* Developer Profile Card */}
        <div className="xl:col-span-2 bg-white/90 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <Code size={24} className="sm:hidden text-white" />
              <Code size={32} className="hidden sm:block text-white" />
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Rahul Thakare</h3>
              <p className="text-base sm:text-lg text-blue-600 font-semibold mb-2">Java Full-Stack Developer</p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Student at Zeal Institute of Business Administration Computer Application and Research, Pune.
                Specializing in Full-Stack Development, Java, and Engineering.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="sm:hidden text-blue-600" />
              <MapPin size={18} className="hidden sm:block text-blue-600" />
              <span className="text-sm sm:text-base text-gray-700">Shree Control Chowk, Audumbar Paradise, Narhe, Pune</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="sm:hidden text-green-600" />
              <Phone size={18} className="hidden sm:block text-green-600" />
              <span className="text-sm sm:text-base text-gray-700">9623354133</span>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
              <Mail size={16} className="sm:hidden text-purple-600" />
              <Mail size={18} className="hidden sm:block text-purple-600" />
              <span className="text-sm sm:text-base text-gray-700 break-all">rahulthakare0202@gmail.com</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/rahulthakare-2b6627377"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={16} className="sm:hidden" />
                <Linkedin size={18} className="hidden sm:block" />
                <span className="text-sm sm:text-base">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Programming Languages */}
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Cpu size={16} className="sm:hidden text-purple-600" />
              <Cpu size={18} className="hidden sm:block text-purple-600" />
              Programming Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {programmingLanguages.map((lang, idx) => (
                <div key={idx} className={`flex items-center gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border ${getColorClasses(lang.color)}`}>
                  <span>{lang.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies & Tools */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Code size={16} className="sm:hidden text-blue-600" />
              <Code size={18} className="hidden sm:block text-blue-600" />
              Technologies & Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border ${getColorClasses(tech.color)}`}
                >
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4 sm:gap-6 xl:space-y-0">
          {developerStats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="bg-white/90 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className={`inline-flex p-2 sm:p-3 rounded-xl ${getColorClasses(stat.color)} mb-3`}>
                  <StatIcon size={20} className="sm:hidden" />
                  <StatIcon size={24} className="hidden sm:block" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Education and Experience Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Education Card */}
        <div className="bg-white/90 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
              <GraduationCap size={18} className="sm:hidden text-purple-600" />
              <GraduationCap size={20} className="hidden sm:block text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Education</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-sm sm:text-base text-gray-800">Master of Computer Applications - MCA</p>
              <p className="text-xs sm:text-sm text-gray-600">Zeal Institute of Business Administration Computer Application and Research, Pune</p>
              <p className="text-xs sm:text-sm text-green-600">2024 - 2026</p>
            </div>
          </div>
        </div>

        {/* Experience Card */}
        <div className="bg-white/90 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
              <Briefcase size={18} className="sm:hidden text-blue-600" />
              <Briefcase size={20} className="hidden sm:block text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Current Status</h3>
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base text-gray-800">Student</p>
            <p className="text-blue-600 font-medium text-sm sm:text-base">Zeal Institute of Business Administration Computer Application and Research, Pune</p>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">2024 – 2026 | Pune Division, Maharashtra, India</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle size={12} className="sm:hidden text-green-500 mt-1 flex-shrink-0" />
                <CheckCircle size={14} className="hidden sm:block text-green-500 mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">Master of Computer Applications - MCA</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={12} className="sm:hidden text-green-500 mt-1 flex-shrink-0" />
                <CheckCircle size={14} className="hidden sm:block text-green-500 mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">Computer Programming, Specific Applications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDeveloper;