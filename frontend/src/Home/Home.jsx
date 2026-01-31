import React from 'react';

const Home = () => {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Lightning Fast",
            description: "Experience blazing fast performance with our optimized infrastructure and cutting-edge technology."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: "Secure & Private",
            description: "Your data is protected with enterprise-grade encryption and advanced security measures."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: "Team Collaboration",
            description: "Work seamlessly with your team using real-time collaboration and communication tools."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "Analytics Dashboard",
            description: "Get insights with comprehensive analytics and detailed reports to track your progress."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            ),
            title: "Cloud Storage",
            description: "Store and access your files from anywhere with unlimited cloud storage capacity."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            title: "Mobile Responsive",
            description: "Access your workspace on any device with our fully responsive mobile application."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: "Customizable",
            description: "Personalize your experience with extensive customization options and integrations."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: "24/7 Support",
            description: "Get help whenever you need it with our round-the-clock customer support team."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                {/* Who We Are Section */}
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-4xl font-bold text-gray-900">Who We Are?</h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded"></div>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    We are a team of passionate innovators, developers, and designers dedicated to creating
                                    exceptional digital experiences. Founded with a vision to revolutionize the way people
                                    work and collaborate, we've grown into a trusted platform serving thousands of users worldwide.
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Our diverse team brings together expertise from various fields, united by a common goal:
                                    to build tools that empower individuals and teams to achieve more. We believe in the power
                                    of technology to transform lives and businesses.
                                </p>
                                <div className="flex gap-4 pt-4">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-cyan-600">10K+</div>
                                        <div className="text-gray-600 mt-2">Active Users</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-cyan-600">50+</div>
                                        <div className="text-gray-600 mt-2">Team Members</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-cyan-600">99.9%</div>
                                        <div className="text-gray-600 mt-2">Uptime</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative animate-fade-in-up">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-gray-200 shadow-lg p-8 flex items-center justify-center">
                                    <svg className="w-64 h-64 text-cyan-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Do Section */}
                <section className="py-16 px-6 bg-white/70">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="relative order-2 md:order-1 animate-fade-in">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-gray-200 shadow-lg p-8 flex items-center justify-center">
                                    <svg className="w-64 h-64 text-cyan-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-6 order-1 md:order-2 animate-fade-in-up">
                                <h2 className="text-4xl font-bold text-gray-900">What We Do?</h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded"></div>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    We provide a comprehensive platform that streamlines workflows and enhances productivity.
                                    Our application combines powerful features with an intuitive interface, making complex
                                    tasks simple and efficient.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Streamline Operations</h3>
                                            <p className="text-gray-600">Automate repetitive tasks and optimize your workflow for maximum efficiency.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Enable Collaboration</h3>
                                            <p className="text-gray-600">Connect teams and facilitate seamless communication across your organization.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drive Growth</h3>
                                            <p className="text-gray-600">Leverage data-driven insights to make informed decisions and scale your business.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 animate-fade-in">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Powerful Features
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Everything you need to succeed, packed into one powerful platform
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-white border border-gray-200 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-4 group-hover:bg-cyan-200 transition-colors duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-3xl p-12 shadow-xl animate-fade-in-up">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                                Join to track your children health datas
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300">
                                    Login to start trial
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;