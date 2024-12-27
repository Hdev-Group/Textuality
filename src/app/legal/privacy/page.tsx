'use client'
import { useState, useEffect } from 'react'
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function TermsPage() {
    return(
        <>
        <head>
        <title>Privacy Policy | Textuality</title>
        <meta
            name="description"
            content="Privacy Policy for Textuality"
        />
        </head>
        <div className="w-full relative justify-center flex-col items-center flex ">
            <Header />
            <main className="flex-grow relative z-40 overflow-x-hidden bg-background w-full rounded-sm lg:mx-10 ">
                <div className="flex flex-col z-10 w-full items-center justify-start h-full">
                    <div className="container overflow-y-hidden h-full px-4 md:px-4 flex flex-row">
                        <div className="flex flex-row md:pr-4">
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col">
                                    <h1 className="text-4xl font-bold text-start mt-10">Privacy Policy</h1>
                                    <div className="flex flex-col gap-2 w-full ">
                                        <p className="text-sm ml-1 mt-1 text-white/50">Last updated: 21-12-2024</p>
                                        <div className="flex flex-row gap-2 items-center">
                                        <div className="rounded-full bg-muted font-semibold flex items-center justify-center  text-sm p-1 w-9 h-9"><img src='/supporticons/manager.png'></img></div>
                                        <p className="text-sm text-muted-foreground">By: <span className="text-sm font-semibold">Legal & Privacy</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 mt-4">
                                Textuality, a product of the Hdev Group ("Company"), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform ("Service"). By accessing or using the Service, you consent to the practices described in this Privacy Policy. If you do not agree, please discontinue use of the Service immediately.
                                <section id="information">
                                    <h1 className="text-2xl font-bold mt-4">1. Information We Collect</h1>
                                    <p className="mt-2">We collect both personal and non-personal information to provide and improve the Service. This includes:</p> 
                                    <p className='font-semibold mt-2'>1.1 Personal Information:</p>
                                    <ul className='list-disc ml-4 '>
                                        <li><b>Account Information: </b>When you register, we collect your name, email address, and any other information you provide.</li>
                                        <li><b>Payment Information:</b> If you make purchases, payment processing is handled by third-party payment processors. We do not store your payment details.</li>
                                        <li><b>Your Content:</b>Content you create, upload, or share on the Service.</li>
                                    </ul>
                                    <p className='font-semibold mt-2'>1.2 Non-Personal Information:</p>
                                    <ul className='list-disc ml-4 '>
                                        <li><b>Device Data:</b> Information about your device, including IP address, browser type, and operating system.</li>
                                        <li><b>Cookies:</b> Cookies are small text files stored on your device that help us improve the Service.</li>
                                    </ul>
                                </section>
                                <section id="useofinformation">
                                    <h1 className="text-2xl font-bold mt-4">2. How We Use Your Information</h1>
                                    <p className="mt-2">We use your information for the following purposes:</p>
                                    <ul className='list-disc ml-4 '>
                                        <li><b>Provide the Service:</b> To create and maintain your account, process payments, and deliver content.</li>
                                        <li><b>Improve the Service:</b> To analyze usage data, troubleshoot issues, and develop new features.</li>
                                        <li><b>Communicate with You:</b> To send notifications, updates, and other messages related to the Service.</li>
                                        <li><b>Personalize Your Experience:</b> To tailor content and features to your preferences.</li>
                                        <li><b>TOS & Legal</b>To ensure compliance with our Terms of Service and legal obligations.</li>
                                    </ul>
                                </section>
                                <section id="sharing">
                                    <h1 className="text-2xl font-bold mt-4">3. Sharing of Information</h1>
                                    <p className="mt-2">We may share your information in the following circumstances:</p>
                                    <ul className='list-disc ml-4 '>
                                        <li><b>Service Providers:</b> We may share information with third-party service providers to help us deliver the Service example: payments (email).</li>
                                        <li><b>Legal Compliance:</b> We may disclose information if required by law or to protect our rights.</li>
                                    </ul>
                                </section>
                                <section id="retention">
                                    <h1 className="text-2xl font-bold mt-4">4. Data Retention</h1>
                                    <p className="mt-2">We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. You may request deletion of your account and data at any time.</p>
                                </section>
                                <section id="rights">
                                    <h1 className="text-2xl font-bold mt-4">5. Your Rights</h1>
                                        <p className='mt-2'>Depending on your location, you may have the following rights regarding your information:</p>
                                        <ul className='list-disc ml-4 '>
                                            <li><b>Access:</b> You may request a copy of your information.</li>
                                            <li><b>Correction:</b> You may update or correct your information.</li>
                                            <li><b>Deletion:</b> You may request deletion of your account and data.</li>
                                            <li><b>Objection:</b> You may object to the processing of your information.</li>
                                            <li><b>Restriction:</b> You may request restrictions on how your information is used.</li>
                                            <li><b>Portability:</b> You may request a copy of your data in a machine-readable format.</li>
                                        </ul>
                                        <p className='mt-2'>To exercise these rights, please contact us on <a href='/support' className='text-blue-400 font-semibold'>our support page.</a></p>
                                </section>
                                <section id="security">
                                    <h1 className="text-2xl font-bold mt-4">6. Security</h1>
                                        <p className='mt-2'>We implement industry standard advanced security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure. Use the Service at your own risk.</p>
                                </section>
                                <section id="cookies">
                                    <h1 className="text-2xl font-bold mt-4">7. Cookies and Tracking Technologies</h1>
                                    <p>We use cookies and similar technologies to improve the functionality of the Service and analyze usage patterns. You can control cookies through your browser settings, but disabling cookies may affect the functionality of the Service.</p>
                                </section>
                                <section id="thirdparty">
                                    <h1 className="text-2xl font-bold mt-4">8. Third-Party Links</h1>
                                    <p className='mt-2'>The Service may include links to third-party websites or services. This Privacy Policy does not apply to those external platforms. We encourage you to review the privacy policies of those third parties.</p>
                                </section>
                                <section id="updates">
                                    <h1 className="text-2xl font-bold mt-4">9. Updates to This Policy</h1>
                                    <p className='mt-2'>We reserve the right to modify this Privacy Policy at any time. Changes will be effective upon posting to the Service, and the "Effective Date" will be updated. Your continued use of the Service constitutes acceptance of the revised Privacy Policy.</p>
                                </section>
                                <section id="contact">
                                    <h1 className="text-2xl font-bold mt-4">10. Contact</h1>
                                    <p className='mt-2'>If you have any questions about these Terms, please contact us on  <a href='/support' className='text-blue-400 font-semibold'> our support page.</a>
                                    </p>
                                </section>
                                </div>
                            </div>
                            <TableOfContents />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
        </>
    )
}



const TableOfContents = () => {
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { rootMargin: '-50% 0px -50% 0px' }
        )

        const sections = document.querySelectorAll('section')
        sections.forEach((section) => observer.observe(section))

        return () => sections.forEach((section) => observer.unobserve(section))
    }, [])

    const links = [
        { text: '1. Information We Collect', href: '#information' },
        { text: '2. How We Use Your Information', href: '#useofinformation' },
        { text: '3. Sharing of Information', href: '#sharing' },
        { text: '4. Data Retention', href: '#retention' },
        { text: '5. Your Rights', href: '#rights' },
        { text: '6. Security', href: '#security' },
        { text: '7. Cookies and Tracking Technologies', href: '#cookies' },
        { text: '8. Third-Party Links', href: '#thirdparty' },
        { text: '9. Updates to This Policy', href: '#updates' },
        { text: '10. Contact', href: '#contact' },
    ]

    return (
        <div className='hidden lg:block top-20 h-fit w-64 pt-6 pl-6 mr-6'>
            <nav className="fixed border border-border bg-muted/30 w-64 p-6 rounded-lg">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className={`block text-sm py-1 px-2 rounded transition-colors ${
                                    activeSection === link.href.slice(1)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted-foreground/10'
                                }`}
                            >
                                {link.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}


