import { motion } from 'motion/react';
import { Shield, Terminal, Activity, Lock, Cpu, Search, AlertTriangle, FileText, Award, Zap, Eye, Database, MessageSquare } from 'lucide-react';

import profile1 from './assets/profile1.png';
import logo from './assets/logo.png';

export const NAV_LINKS = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Experience', href: '#experience' },
  { name: 'Volunteering', href: '#volunteering' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export const CERTIFICATIONS = [
  {
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    year: '2023',
    category: 'Cybersecurity',
    icon: Shield,
    logo: 'https://www.vectorlogo.zone/logos/comptia/comptia-icon.svg',
    bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Certified SOC Analyst (CSA)',
    issuer: 'EC-Council',
    year: '2024',
    category: 'Cybersecurity',
    icon: Search,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/EC-Council_Logo.svg/1200px-EC-Council_Logo.svg.png',
    bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Microsoft Security Operations Analyst (SC-200)',
    issuer: 'Microsoft',
    year: '2024',
    category: 'Cybersecurity',
    icon: Lock,
    logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg',
    bgImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Google IT Support Professional Certificate',
    issuer: 'Google',
    year: '2022',
    category: 'IT Support',
    icon: Cpu,
    logo: 'https://www.vectorlogo.zone/logos/google/google-icon.svg',
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  },
];

export const STATS = [
  { label: 'Years Experience', value: '5+' },
  { label: 'Incidents Handled', value: '1.2k+' },
  { label: 'Tools Mastered', value: '25+' },
  { label: 'Uptime Maintained', value: '99.9%' },
];

export const SERVICES = [
  {
    title: 'Threat Monitoring & Detection',
    description: 'Real-time surveillance of network traffic and system logs to identify suspicious patterns and potential breaches.',
    icon: Eye,
    color: 'blue',
  },
  {
    title: 'Incident Response',
    description: 'Rapid containment and remediation of security incidents to minimize operational impact and data loss.',
    icon: Zap,
    color: 'purple',
  },
  {
    title: 'SIEM Engineering',
    description: 'Designing and optimizing SIEM architectures (Splunk, Sentinel) for maximum visibility and alert accuracy.',
    icon: Database,
    color: 'blue',
  },
  {
    title: 'Threat Intelligence',
    description: 'Analyzing global threat landscapes to proactively fortify defenses against emerging attack vectors.',
    icon: Search,
    color: 'purple',
  },
  {
    title: 'Security Automation',
    description: 'Building SOAR playbooks and custom scripts to automate repetitive triage and response tasks.',
    icon: Cpu,
    color: 'blue',
  },
];

export const EXPERIENCE = [
  {
    role: 'Senior SOC Analyst',
    company: 'Global Cyber Defense Corp',
    period: '2022 - Present',
    description: 'Leading incident response efforts for Fortune 500 clients. Orchestrating threat hunting missions across hybrid cloud environments.',
    impact: 'Reduced mean time to resolution (MTTR) by 40% through automated playbook implementation.',
    tags: ['Incident Response', 'Threat Hunting', 'SIEM'],
    technologies: ['Splunk', 'CrowdStrike', 'Python', 'AWS Security Hub'],
    challenges: 'Managing high-velocity alert streams while maintaining sub-second detection latency across distributed cloud architectures.',
  },
  {
    role: 'Security Operations Analyst',
    company: 'Sentinel Security Solutions',
    period: '2020 - 2022',
    description: 'Monitored and analyzed security events from various sources. Performed deep-packet analysis and malware triage.',
    impact: 'Identified and mitigated a sophisticated supply-chain attack before data exfiltration occurred.',
    tags: ['Malware Analysis', 'Network Security', 'EDR'],
    technologies: ['Wireshark', 'Microsoft Sentinel', 'Cortex XSOAR', 'ELK Stack'],
    challenges: 'Deconstructing obfuscated malware payloads and correlating disparate log sources to map out adversary lateral movement.',
  },
];

export const PROJECTS = [
  {
    title: 'SIEM Dashboard Optimization',
    category: 'Engineering',
    problem: 'Critical alerts were getting lost in a sea of false positives.',
    solution: 'Redesigned Splunk dashboards with advanced correlation logic and visual hierarchy.',
    result: '60% reduction in alert fatigue and 25% faster triage time.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    technologies: ['Splunk', 'RegEx', 'Dashboarding', 'Log Analysis'],
  },
  {
    title: 'Automated Phishing Triage',
    category: 'Automation',
    problem: 'Manual phishing analysis was consuming 4 hours of analyst time daily.',
    solution: 'Developed a Python-based SOAR playbook for automated URL and attachment scanning.',
    result: 'Triage time reduced to seconds per email, saving 20 hours weekly.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
    technologies: ['Python', 'SOAR', 'API Integration', 'Threat Intel'],
  },
];

export const TECH_STACK = [
  { name: 'Splunk', icon: Search, detail: 'SIEM & Log Management' },
  { name: 'Microsoft Sentinel', icon: Shield, detail: 'Cloud-Native SIEM/SOAR' },
  { name: 'Wireshark', icon: Activity, detail: 'Packet Analysis' },
  { name: 'Python', icon: Terminal, detail: 'Security Automation' },
  { name: 'ELK Stack', icon: Database, detail: 'Log Analytics' },
  { name: 'CrowdStrike', icon: Lock, detail: 'EDR & Threat Hunting' },
  { name: 'QRadar', icon: Shield, detail: 'Enterprise SIEM' },
  { name: 'Cortex XSOAR', icon: Cpu, detail: 'Security Orchestration' },
];

export const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'CISO, Fintech Global',
    content: 'Emmanuel’s ability to spot anomalies that others miss is uncanny. He’s a vital asset to our security posture.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'David Chen',
    role: 'Security Director, CloudScale',
    content: 'The automation workflows Emmanuel built have completely transformed our SOC efficiency. Highly recommended.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  },
];

export const VOLUNTEERING = [
  {
    organization: 'Cyber Defense Initiative',
    role: 'Lead Security Mentor',
    period: '2023 - Present',
    description: 'Mentoring aspiring cybersecurity professionals in threat detection and incident response fundamentals.',
    impact: 'Successfully guided 15+ mentees into entry-level SOC roles within 6 months.',
    icon: Shield,
    image: profile1,
    stats: [
      { label: 'Mentees', value: '15+' },
      { label: 'Success', value: '100%' },
      { label: 'Hours', value: '200+' },
    ]
  },
  {
    organization: 'Open Source Security Foundation (OpenSSF)',
    role: 'Vulnerability Researcher',
    period: '2022 - 2023',
    description: 'Contributed to identifying and documenting vulnerabilities in widely used open-source libraries.',
    impact: 'Reported 5 critical vulnerabilities, improving the security posture of thousands of downstream projects.',
    icon: Search,
    image: logo,
    stats: [
      { label: 'Vulns', value: '5' },
      { label: 'Projects', value: '1k+' },
      { label: 'Critical', value: '2' },
    ]
  },
  {
    organization: 'Local STEM Outreach',
    role: 'Workshop Coordinator',
    period: '2021 - 2022',
    description: 'Organized and led cybersecurity awareness workshops for high school students.',
    impact: 'Reached over 500 students, increasing interest in cybersecurity careers by 30% based on post-workshop surveys.',
    icon: Cpu,
    image: profile1,
    stats: [
      { label: 'Students', value: '500+' },
      { label: 'Events', value: '12' },
      { label: 'Growth', value: '30%' },
    ]
  },
  {
    organization: 'Tech Community Leaders',
    role: 'Chapter President',
    period: '2020 - 2021',
    description: 'Managed a local chapter of 100+ tech enthusiasts, organizing monthly meetups and technical talks.',
    impact: 'Grew membership by 50% and secured sponsorships from 3 local tech firms.',
    icon: Award,
    image: logo,
    stats: [
      { label: 'Members', value: '100+' },
      { label: 'Meetups', value: '24' },
      { label: 'Sponsors', value: '3' },
    ]
  },
];
