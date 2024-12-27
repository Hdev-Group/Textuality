'use client'
import { useState, useEffect } from 'react'
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function TermsPage() {
    return(
        <>
        <head>
        <title>Cookies | Textuality</title>
        <meta
            name="description"
            content="Cookie Policy for Textuality"
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
                                    <h1 className="text-4xl font-bold text-start mt-10">Cookie Policy</h1>
                                    <div className="flex flex-col gap-2 w-full ">
                                        <p className="text-sm ml-1 mt-1 text-white/50">Last updated: 21-12-2024</p>
                                        <div className="flex flex-row gap-2 items-center">
                                        <div className="rounded-full bg-muted font-semibold flex items-center justify-center  text-sm p-1 w-9 h-9"><img src='/supporticons/manager.png'></img></div>
                                        <p className="text-sm text-muted-foreground">By: <span className="text-sm font-semibold">Legal & Privacy</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 mt-4">
                                Welcome to Textuality, a product of the Hdev Group (the "Company"). This Cookie Policy explains how we use cookies and similar technologies on our website and services (the "Service"). By using the Service, you consent to the use of cookies as described in this policy
                                <section id="what-are-cookies">
                                    <h1 className="text-2xl font-bold mt-4">What Are Cookies?</h1>
                                    <p className="mt-2">Cookies are small text files that are placed on your device (computer, smartphone, or tablet) by websites you visit. They help websites function, improve user experience, and provide insights to website operators.</p> 
                                </section>
                                <section id="how-we-use-cookies">
                                    <h1 className="text-2xl font-bold mt-4">How We Use Cookies</h1>
                                    <p className="mt-2">We use cookies to:</p>
                                    <ul className='list-disc ml-4'>
                                        <li>Authenticate users and prevent fraudulent activity.</li>
                                        <li>Remember user preferences and settings.</li>
                                        <li>Deliver personalized content and advertising.</li>
                                        <li>Analyze website traffic and usage.</li>
                                    </ul>
                                </section>
                                <section id="types-of-cookies">
                                    <h1 className="text-2xl font-bold mt-4">Types of Cookies We Use</h1>
                                    <ul className='list-disc ml-4 mt-2'>
                                        <li>Essential Cookies: Necessary for the website to function properly.</li>
                                        <li>Functional Cookies: Enhance user experience by remembering preferences and settings.</li>
                                        <li>Performance Cookies: Collect information about how users interact with the website.</li>
                                    </ul>
                                </section>
                                <section id="managing-cookies">
                                    <h1 className="text-2xl font-bold mt-4">Managing Cookies</h1>
                                    <p className='mt-2'>You can manage or disable cookies through your browser settings. However, please note that disabling cookies may affect the functionality and user experience of the Service.</p>
                                        <ul className='list-disc ml-4'>
                                            <li>Google Chrome: <a href='https://support.google.com/chrome/answer/95647?hl=en' className='text-blue-400 font-semibold'>Manage cookies</a></li>
                                            <li >Mozilla Firefox: <a href='https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences' className='text-blue-400 font-semibold'>Enable or disable cookies</a></li>
                                            <li >Safari: <a href='https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac' className='text-blue-400 font-semibold'>Manage cookies and website data</a></li>
                                            <li >Microsoft Edge: <a href='https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' className='text-blue-400 font-semibold'>Delete and manage cookies</a></li>
                                        </ul>
                                </section>
                                <section id="changes-to-policy">
                                    <h1 className="text-2xl font-bold mt-4">Changes to This Policy</h1>
                                        <p className='mt-2'>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any updates will be posted on this page, and the "Last Updated" date will be revised.</p>
                                </section>
                                <section id="contact">
                                    <h1 className="text-2xl font-bold mt-4">Contact</h1>
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
        { href: '#what-are-cookies', text: 'What Are Cookies?' },
        { href: '#how-we-use-cookies', text: 'How We Use Cookies' },
        { href: '#types-of-cookies', text: 'Types of Cookies We Use' },
        { href: '#managing-cookies', text: 'Managing Cookies' },
        { href: '#changes-to-policy', text: 'Changes to This Policy' },
        { href: '#contact', text: 'Contact' },
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


