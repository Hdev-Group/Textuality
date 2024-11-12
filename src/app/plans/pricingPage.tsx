"use client"
import { useState } from "react";
import Header from "@/components/header/header"
import Footer from "@/components/footer/footer";
import { Button } from "@/components/ui/button";
import { Check, CheckCircleIcon, DatabaseIcon, User, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRef } from "react";


export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("month");
  const plans = [
    {
      name: "Free",
      price: "0",
      users: "5",
      requests: "1 Million",
      description: "For personal projects, marketers and small teams looking to get started.",
      features: ["Basic analytics", "Limited projects", "Standard support", "Content creation tools", "API access", "Webhooks"],
      popular: false,
      highlight: false,
    },
    {
      name: "Pro",
      price: billingCycle === "month" ? "22.55" : "230",
      description: "For growing teams and businesses that need more advanced tools.",
      users: "10",
      requests: "5 Million",
      features: ["Advanced analytics", "Unlimited projects", "Content Approval", "AI tools", "Webhooks", "Priority support", "Role Based Access Control"],
      popular: true,
      highlight: true,
    },
    {
    name: "Enterprise",
    price: billingCycle === "month" ? "86.55" : "851",
    description: "For large businesses and enterprises that require custom solutions.",
    users: "Custom",
    requests: "Custom",
    features: ["Custom integrations", "Subscription & Paywall", "Social media scheduling", "SLA guarantees", "Custom branding"],
    popular: false,
    highlight: true,
    },
  ]
  const allFeatures = Array.from(new Set(plans.flatMap(plan => plan.features)))
  const tableRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLTableSectionElement>(null)
  const [isSticky, setIsSticky] = useState(true)


  return (
    <body className="flex bgmain flex-col min-h-screen w-full items-center justify-center">
    <div className="flex items-center justify-center ">
      <div className="border-x bg-background border-neutral-600 max-w-[2000px] w-full z-30  dark:border-white/50 rounded-sm lg:mx-10 lg:mb-10 border-y">
        <Header />
        <div className="mt-10">
            <div className="flex flex-col items-center gap-7 h-full">
                <div className="flex flex-col items-center gap-0.5">
                    <h2 className="text-md font-semibold text-center text-foreground">Textuality Pricing</h2>
                    <h1 className="text-7xl w-[80%] space-grotesk-600 text-center text-foreground">Plans written to grow your buisness</h1>
                </div>
                <p className="text-sm text-center w-[40%] text-muted-foreground">
                    Compare plans that work for you, your business, and your team. Whether you're just starting out or looking to scale, we have a plan that fits your needs. Explore the features and benefits of each plan to find the perfect match for your goals.
                </p>
            </div>
            <div className="flex h-full w-full mt-10 justify-center">
                <div className="flex items-center justify-center w-full container lg:mx-auto">
                    <div className="flex justify-center mt-10">
                        <div className="flex flex-col justify-center gap-2 text-center w-full items-center">
                        <h3 className="text-3xl font-semibold text-foreground">Billing Cycle</h3>
                        <div className="flex flex-row gap-5">
                            <button className={`px-4 py-2 rounded-lg text-sm font-semibold ${billingCycle === "month" ? "bg-primary text-black" : "bg-muted text-foreground"} focus:outline-none transition-colors duration-300`} onClick={() => setBillingCycle("month")}>
                                Monthly
                            </button>

                            <button className={`px-4 py-2 rounded-lg text-sm font-semibold ${billingCycle === "year" ? "bg-primary text-black" : "bg-muted text-foreground"} focus:outline-none transition-colors duration-300`} onClick={() => setBillingCycle("year")}>
                                Yearly <span className={`text-xs ${billingCycle === "year" ? "text-green-800" : "text-green-500"}`}>Save 10%</span>
                            </button>
                        </div>
                        </div>
                    </div>
                    <div className="flex justify-between w-full mt-5 gap-10 flex-col lg:flex-row ">
                        <PricingCard
                            plans={plans[0]}
                            lastone={null}
                            billingCycle={"forever"}
                        />
                        <PricingCard
                            plans={plans[1]}
                            lastone="Free"
                            billingCycle={billingCycle}
                        />
                        <PricingCard
                            plans={plans[2]}
                            lastone="Pro"
                            billingCycle={billingCycle}
                        />
                    </div>
                </div>
            </div>
            
            <div className="flex h-full w-full mt-20 pt-20 border-t justify-center">
                <div className="flex items-center justify-center w-full container lg:mx-auto">
                    <div ref={tableRef} className="overflow-x-auto w-full ">
                        <Table>
                            <TableHeader ref={headerRef} className={`${isSticky ? 'sticky top-0 bg-background z-10 shadow-md' : ''}`}>
                                <TableRow>
                                    <TableHead className="w-[200px]">Features</TableHead>
                                    {plans.map((plan) => (
                                        <TableHead key={plan.name} className="text-start">
                                            <div className="font-bold text-foreground">{plan.name}</div>
                                            <div className="text-2xl font-bold text-foreground">£{plan.price} <span className="text-xl text-muted-foreground">{billingCycle === 'month' ? '/ mo' : '/ yr'}</span></div>
                                            <div className="text-sm text-muted-foreground">{plan.description}</div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium flex flex-row items-center gap-1"><User size={16} /> Users</TableCell>
                                    {plans.map((plan) => (
                                        <TableCell key={plan.name} className="text-center">{plan.users}</TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium flex flex-row items-center gap-1"><DatabaseIcon size={16} /> Requests <span >/ month</span></TableCell>
                                    {plans.map((plan) => (
                                        <TableCell key={plan.name} className="text-center">{plan.requests}</TableCell>
                                    ))}
                                </TableRow>
                                {allFeatures.map((feature) => (
                                    <TableRow key={feature}>
                                        <TableCell className="font-medium">{feature}</TableCell>
                                        {plans.map((plan, planIndex) => {
                                            const cumulativeFeatures = plans.slice(0, planIndex + 1).flatMap(p => p.features);
                                            return (
                                                <TableCell key={`${plan.name}-${feature}`} className="text-center">
                                                    {cumulativeFeatures.includes(feature) ? (
                                                        <Check className="mx-auto text-green-500" />
                                                    ) : (
                                                        <X className="mx-auto text-red-500" />
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </div>
                </div>
            </div>
        <Footer />
        </div>
    </div>
</body>
  );
}
function PricingCard({ plans, lastone, billingCycle }) {
    return (
        <div className={`flex flex-col border-2 w-full rounded-lg ${plans.highlight ? 'border-primary' : 'border-muted'}`}>
            <div className={`flex border-b-2 flex-col p-6 h-52 justify-between ${plans.highlight ? 'border-primary' : 'border-muted'}`}>
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-foreground">{plans.name}</h1>
                    <h2 className="text-2xl font-semibold text-foreground">£{plans.price} 
                        <span className="text-lg text-muted-foreground">/</span> 
                        <span className="text-muted-foreground font-medium text-sm">{plans.price === "0" ? "forever" : billingCycle}</span>
                        {
                            billingCycle === "year" && plans.price !== "0" && (
                                <span className="text-green-500 text-xs"> Save {
                                    plans.name === "Pro" ? "15%" : plans.name === "Enterprise" ? "18%" : "0%"
                                    }
                                </span>
                            )
                        }
                    </h2>
                    <p className="text-[15px]">{plans.description}</p>
                </div>
                <Button className="mt-4">{plans.price === "0" ? "Build for free" : plans.price === "custom" ? "Contact Sales" : "Get Started"}</Button>
            </div>
            <div className={`p-6 h-auto lg:h-80`}>
                <ul className="space-y-2">
                    <p className="text-md font-semibold text-foreground">
                        {
                            lastone !== "null" && (
                                <span className="text-muted-foreground">Includes all features from {lastone} and</span>
                            )
                        }
                    </p>
                    {plans.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-foreground">
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-primary" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}