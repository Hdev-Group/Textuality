"use client";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Button } from "@/components/ui/button";
import { Check, CheckCircleIcon, DatabaseIcon, User, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react"
import { useAuth } from "@clerk/clerk-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("month");
  const [isSticky, setIsSticky] = useState(false);
  
  
  // Plans data
  const plans = [
    {
      name: "Free",
      price: "0",
      users: "5",
      requests: "500k",
      description: "For personal projects, marketers and small teams looking to get started.",
      features: ["Basic analytics", "Limited projects", "Standard support", "Content creation tools", "API access", "Webhooks"],
      popular: false,
      highlight: false,
    },
    {
      name: "Pro",
      price: billingCycle === "month" ? "12.50" : "125",
      description: "For growing teams and businesses that need more advanced tools.",
      users: "10",
      requests: "5 Million",
      features: ["Advanced analytics", "Unlimited projects", "Content Approval", "AI tools", "Webhooks", "Priority support", "Role Based Access Control"],
      popular: true,
      highlight: true,
    },
    {
      name: "Enterprise",
      price: billingCycle === "month" ? "23.50" : "240",
      description: "For large businesses and enterprises that require custom solutions.",
      users: "30 + Pay per user/month",
      requests: "20 Million + Pay as you go/month",
      features: ["Custom integrations", "Subscription & Paywall", "Social media scheduling", "Custom branding"],
      popular: false,
      highlight: true,
    },
  ];

  const allFeatures = Array.from(new Set(plans.flatMap((plan) => plan.features)));
  
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);



  return (
    <div className={`flex bgmain flex-col min-h-screen w-full  items-center justify-center `}>
      <div className="flex items-center justify-center">
        <div className="w-full flex items-center justify-center flex-col z-30 rounded-sm lg:mx-10 lg:mb-10 border-b">
          <Header />
          <div className="mt-10">
            <div className="flex flex-col items-center gap-7 h-full">
              <div className="flex flex-col items-center gap-0.5">
                <h2 className="text-md font-semibold text-center text-foreground">Textuality Pricing</h2>
                <h1 className="text-7xl w-[80%] space-grotesk-600 text-center text-foreground">Plans written to grow your business</h1>
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
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${billingCycle === "month" ? "bg-primary text-background" : "bg-muted text-foreground"} focus:outline-none transition-colors duration-300`}
                        onClick={() => setBillingCycle("month")}
                      >
                        Monthly
                      </button>

                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${billingCycle === "year" ? "bg-primary text-background" : "bg-muted text-foreground"} focus:outline-none transition-colors duration-300`}
                        onClick={() => setBillingCycle("year")}
                      >
                        Yearly <span className={`text-xs ${billingCycle === "year" ? "text-green-400 dark:text-green-950" : "dark:text-green-500"}`}>Save 16%</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between w-full mt-5 gap-10 flex-col lg:flex-row">
                  <PricingCard plans={plans[0]} productid={null} lastone={null} billingCycle={"forever"} priceId={null} />
                  <PricingCard plans={plans[1]} productid={"prod_RD94s4Pa5cgS4C"} lastone="Free" billingCycle={billingCycle} priceId={billingCycle === "month" ? "price_1QKilvG1nQ3zP4pJN3WVpvHs" : "price_1QKjYBG1nQ3zP4pJf9yeSali"} />
                  <PricingCard plans={plans[2]} productid={"prod_RD94mxiuenz1m9"} lastone="Pro" billingCycle={billingCycle} priceId={billingCycle === "month" ? "price_1QKimJG1nQ3zP4pJeDdPL6RB" : "price_1QKlKOG1nQ3zP4pJQBJffEqx"} />
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full w-full mt-20 pt-20 border-t relative justify-center">
            <div className="sticky container mx-auto h-28 py-2 border-b-accent border-b bg-background top-[4.5rem] z-30">
              <div className="w-full flex flex-row items-center justify-center">
              <TableHead className="w-[200px] h-max flex items-center">Features</TableHead>
              {plans.map((plan) => (
                          <TableHead key={plan.name} className="text-start">
                            <div className="font-bold text-foreground">{plan.name}</div>
                            <div className="text-2xl font-bold text-foreground">
                              £{plan.price} <span className="md:text-xl text-xs text-muted-foreground">{billingCycle === "month" ? "/ mo" : "/ yr"}</span>
                            </div>
                            <div className="text-sm text-muted-foreground lg:block hidden">{plan.description}</div>
                          </TableHead>
                        ))}
              </div>
            </div>
              <div className="flex items-center justify-center w-full container mx-auto">
                <div ref={tableRef} className="overflow-x-auto w-full flex items-center justify-center">
                  <Table className="relative">
                    <TableHeader
                      ref={headerRef}
                      className={`sticky top-0 z-10 h-1 bg-background ${isSticky ? "shadow-md" : ""}`}
                    >
                      <TableRow className="h-1 w-full border-none justify-between">
                        <TableHead className="w-[200px] h-1"></TableHead>
                          <TableHead className="text-start h-1 w-1/1">
                          </TableHead>
                          <TableHead className="text-start h-1 w-1/1">
                          </TableHead>
                          <TableHead className="text-start h-1 w-1/3">
                          </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium flex flex-row items-center gap-1">
                          <User size={16} /> Users
                        </TableCell>
                        {plans.map((plan) => (
                          <TableCell key={plan.name} className="text-center">{plan.users}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium flex flex-row items-center gap-1">
                          <DatabaseIcon size={16} /> Requests <span>/ month</span>
                        </TableCell>
                        {plans.map((plan) => (
                          <TableCell key={plan.name} className="text-center">{plan.requests}</TableCell>
                        ))}
                      </TableRow>
                      {allFeatures.map((feature) => (
                        <TableRow key={feature}>
                          <TableCell className="font-medium">{feature}</TableCell>
                          {plans.map((plan, planIndex) => {
                            const cumulativeFeatures = plans.slice(0, planIndex + 1).flatMap((p) => p.features);
                            return (
                              <TableCell key={`${plan.name}-${feature}`} className="text-center">
                                {cumulativeFeatures.includes(feature) ? <Check className="mx-auto text-green-500" /> : <X className="mx-auto text-red-500" />}
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
            <div className="flex flex-col items-center justify-center w-full mt-20 h-screen">
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ plans, lastone, billingCycle, priceId, productid }) {
  const router = useRouter();
  const user = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  // check the url if ?success=true
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const success = searchParams.get("success");
    const priceIder = searchParams.get("priceId");
    if (success === "true" && priceIder === priceId) {
      setIsSuccess(true);
    }
  }, [priceId]);
  const handlesigninCheckout = async (priceId) => {
    // send them to the sign in page
    router.push("/sign-in?redirect=/plans?priceId=" + priceId);
  }

  const handleCheckout = async (priceId: string) => {
    const mainemail = user.user.emailAddresses[0].emailAddress;
    if (!user || !mainemail) {
      router.push("/sign-in?redirect=/plans?priceId=" + priceId);
      return;
    }
    const bundel = { priceId, mainemail, userid: user.user.id, productid: productid };
    const response = await fetch('/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bundel }),
    });
  
    const data = await response.json();
    if (data.url) {
      router.push(data.url);
    } else {
      console.error(data.error);
    }
  };
  return (
    <div>
      <div className="relative">
        {plans.popular && (
          <div className="absolute top-0 right-0 bg-primary text-background px-4 py-1.5 rounded-bl-lg rounded-tr-lg text-xs shadow-md shadow-primary/40 font-semibold">
            Popular
          </div>
        )}
        <div className={`flex flex-col border-2 hover:bg-muted/20 transition-all w-full rounded-lg ${isSuccess ? "pingersuccessbought" : ""} ${plans.highlight ? "border-primary shadow-md shadow-primary/40 " : "border-muted"}`}>
          <div className={`flex border-b-2 flex-col p-6 h-72 justify-between ${plans.highlight ? "border-primary" : "border-muted"}`}>
            <div className="flex flex-col items-start gap-1">
              <img src={plans.name === "Free" ? "/planimg/freeplan.png" : plans.name === "Pro" ? "/planimg/pro.png" : "/planimg/enterprise.png"} alt={plans.name} className="w-12 h-12" />
              <h1 className="text-2xl font-semibold text-foreground">{plans.name}</h1>
              <h2 className="text-2xl font-semibold text-foreground">
                £{plans.price}
                <span className="text-lg text-muted-foreground">/</span>
                <span className="text-muted-foreground font-medium text-sm">{plans.price === "0" ? "forever" : billingCycle} </span>
                {billingCycle === "year" && plans.price !== "0" && (
                  <span className="text-green-500 text-xs">
                    Save {plans.name === "Pro" ? "16%" : plans.name === "Enterprise" ? "15%" : "0%"}
                  </span>
                )}
              </h2>
              <p className="text-[15px]">{plans.description}</p>
            </div>
            {
              isSignedIn ? (
                <Button
                  onClick={() => handleCheckout(priceId)}
                  className="w-full mt-2 bg-primary text-background"
                >
                  Get Started
                </Button>
              ) : (
                <Button
                  onClick={() => handlesigninCheckout(priceId)}
                  className="w-full bg-primary text-background"
                >
                  Get Started
                </Button>
              )
            }
          </div>
          <div className="p-6 h-auto lg:h-80">
            <ul className="space-y-2">
              <p className="text-md font-semibold text-foreground">
                {lastone !== "null" && <span className="text-muted-foreground">Includes all features from {lastone} and</span>}
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
      </div>
    </div>
  );
}
