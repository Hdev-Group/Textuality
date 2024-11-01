import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

export default function FeatureCardComponent({ title, description, icon }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}