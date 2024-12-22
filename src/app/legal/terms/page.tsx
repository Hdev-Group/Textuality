'use client'
import { useState, useEffect } from 'react'
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function TermsPage() {
    return(
        <>
        <head>
        <title>Terms of Service | Textuality</title>
        <meta
            name="description"
            content="Terms of Service for Textuality"
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
                                    <h1 className="text-4xl font-bold text-start mt-10">Terms of Service</h1>
                                    <div className="flex flex-col gap-2 w-full ">
                                        <p className="text-sm ml-1 mt-1 text-white/50">Last updated: 21-12-2024</p>
                                        <div className="flex flex-row gap-2 items-center">
                                        <div className="rounded-full bg-muted font-semibold flex items-center justify-center  text-sm p-1 w-9 h-9"></div>
                                        <p className="text-sm text-muted-foreground">By: <span className="text-sm font-semibold">Trust and Safety</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 mt-4">
                                Welcome to Textuality, a product of the Hdev Group (the "Company"). By accessing or using Textuality (the "Service"), you agree to comply with and be bound by these Terms of Service ("Terms"). Please read them carefully. The Company reserves the right to update or modify these Terms at any time without prior notice. Continued use of the Service constitutes acceptance of the revised Terms. If you do not agree to these Terms, you must discontinue use of the Service immediately.                        <section id="acceptance">
                                    <h1 className="text-2xl font-bold mt-4">1. Acceptance of Terms</h1>
                                    <p className="mt-2">By registering for, accessing, or using Textuality, you agree to be bound by these Terms. If you do not agree, you may not use the Service.</p> 
                                </section>
                                <section id="modifications">
                                    <h1 className="text-2xl font-bold mt-4">2. Modifications to Terms</h1>
                                    <p className="mt-2">The Company reserves the right to update or modify these Terms at its sole discretion without prior notice. Any changes to the Terms will be effective upon posting to the Service. It is your responsibility to review the Terms periodically. Your continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.</p>
                                </section>
                                <section id="eligibility">
                                    <h1 className="text-2xl font-bold mt-4">3. Eligibility</h1>
                                    <p className="mt-2">You must be at least 13 years old to use Textuality. By using the Service, you represent and warrant that you meet this eligibility requirement and have the legal capacity to enter into these Terms.</p>
                                </section>
                                <section id="account">
                                    <h1 className="text-2xl font-bold mt-4">4. Account</h1>
                                        <ul className='list-disc ml-4 mt-2'>
                                            <li>You are responsible for maintaining the confidentiality of your account credentials and restricting access to your account.</li>
                                            <li>You agree to notify the Company / support immediately of any unauthorized access to or use of your account.</li>
                                            <li>You are solely responsible for all activities conducted through your account, whether authorized by you or not.</li>
                                        </ul>
                                </section>
                                <section id="useofservice">
                                    <h1 className="text-2xl font-bold mt-4">5. Use of Service</h1>
                                        <p className='mt-2'>You agree to use the Service in compliance with all applicable laws and regulations. Prohibited activities include, but are not limited to:</p>
                                        <ul className='list-disc ml-4 '>
                                            <li>Violating any or attempting to violate applicable laws or regulations.</li>
                                            <li>Attempting to disrupt, compromise, or tamper with the security or functionality of the Service.</li>
                                            <li>Using the Service to distribute or promote harmful, illegal, or offensive content.</li>
                                            <li>Engaging in abusive use of the Service or API, including but not limited to excessive requests, unauthorized automation, or activities that degrade performance or availability.</li>
                                        </ul>
                                </section>
                                <section id="intellectualproperty">
                                    <h1 className="text-2xl font-bold mt-4">6. Intellectual Property</h1>
                                        <p className='mt-2'>All intellectual property associated with Textuality, including but not limited to software, trademarks, and content, is owned by the Hdev Group. You are granted a limited, revocable, non-exclusive, non-transferable license to access and use the Service in accordance with these Terms.</p>
                                </section>
                                <section id="usergeneratedcontent">
                                    <h1 className="text-2xl font-bold mt-4">7. User-Generated Content</h1>
                                    <p>When post to the service the following applies to your content:</p>
                                    <ul className='list-disc ml-4 mt-2'>
                                        <li>You retain ownership of your content.</li>
                                        <li>By submitting content, you grant the Company a worldwide, royalty-free license to host, display, and distribute your content as necessary to provide the Service.</li>
                                        <li>You represent and warrant that you have all necessary rights to grant the license described above.</li>
                                        <li>You are solely responsible for the content you create and its compliance with applicable laws and regulations.</li>
                                    </ul>
                                </section>
                                <section id="privacy">
                                    <h1 className="text-2xl font-bold mt-4">8. Privacy</h1>
                                    <p className='mt-2'>Your use of the Service is subject to the Company's Privacy Policy. By using the Service, you consent to the collection, use, and sharing of information as described in the Privacy Policy.</p>
                                </section>
                                <section id="payments">
                                    <h1 className="text-2xl font-bold mt-4">9. Payments</h1>
                                    <p className='mt-2'>If you purchase a paid subscription to the Service, you agree to pay all fees associated with your subscription. Payments are non-refundable except as required by law or in special conditions.</p>
                                    <ul className='list-disc ml-4 mt-2'>
                                        <li>Payment processing is handled by third-party payment processors. The Company does not store payment information.</li>
                                        <li>Fees for paid features or subscriptions will be clearly communicated during the purchase process.</li>
                                        <li>Failure to make timely payments may result in suspension or termination of your access to paid features or the Service.</li>
                                        <li>The Company reserves the right to change the pricing of paid features or subscriptions at any time. A notification will be sent if there are any changes.</li>
                                    </ul>
                                </section>
                                <section id="serviceavailability">
                                    <h1 className="text-2xl font-bold mt-4">10. Service Availability</h1>
                                    <p className='mt-2'>The Company aims to provide uninterrupted access to the Service but does not guarantee availability. The Company shall not be liable for any downtime, interruptions, or data loss.</p>
                                </section>
                                <section id="termination">
                                    <h1 className="text-2xl font-bold mt-4">11. Termination</h1>
                                    <p className='mt-2'>The Company reserves the right to suspend or terminate your account or access to the Service at its discretion for violations of these Terms or other reasons. Termination may occur with or without prior notice.</p>
                                </section>
                                <section id="disclaimer">
                                    <h1 className="text-2xl font-bold mt-4">12. Disclaimer</h1>
                                    <ul className='list-disc ml-4 mt-2'>
                                        <li>The Service is provided "as is" and "as available" without warranties of any kind, express or implied.</li>
                                        <li>The Company does not warrant that the Service will be error-free, secure, or uninterrupted.</li>
                                        <li>To the fullest extent permitted by law, the Company disclaims liability for any indirect, incidental, or consequential damages arising from your use of the Service.</li>
                                    </ul>
                                </section>
                                <section id="indemnification">
                                    <h1 className="text-2xl font-bold mt-4">13. Indemnification</h1>
                                    <p className='mt-2'>You agree to indemnify and hold harmless the Company, its affiliates, and their respective officers, directors, employees, and agents from any claims, losses, damages, liabilities, costs, and expenses arising from your use of the Service or violation of these Terms.</p>
                                </section>
                                <section id="governinglaw">
                                    <h1 className="text-2xl font-bold mt-4">14. Governing Law</h1>
                                    <p className='mt-2'>These Terms are governed by the laws of the United Kingdom. Any disputes arising from these Terms will be resolved in the courts of the United Kingdom.</p>
                                </section>
                                <section id="contact">
                                    <h1 className="text-2xl font-bold mt-4">15. Contact</h1>
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
        { href: '#acceptance', text: '1. Acceptance of Terms' },
        { href: '#modifications', text: '2. Modifications to Terms' },
        { href: '#eligibility', text: '3. Eligibility' },
        { href: '#account', text: '4. Account' },
        { href: '#useofservice', text: '5. Use of Service' },
        { href: '#intellectualproperty', text: '6. Intellectual Property' },
        { href: '#usergeneratedcontent', text: '7. User-Generated Content' },
        { href: '#privacy', text: '8. Privacy' },
        { href: '#payments', text: '9. Payments' },
        { href: '#serviceavailability', text: '10. Service Availability' },
        { href: '#termination', text: '11. Termination' },
        { href: '#disclaimer', text: '12. Disclaimer' },
        { href: '#indemnification', text: '13. Indemnification' },
        { href: '#governinglaw', text: '14. Governing Law' },
        { href: '#contact', text: '15. Contact' },
    ]

    return (
        <div className='hidden lg:block top-20 h-fit w-64 pt-6 '>
            <nav className="fixed border border-border bg-muted/30 w-64 p-6 mr-6 rounded-lg">
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


