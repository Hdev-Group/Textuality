import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Welcome from './Welcome'
import EnvSetup from './EnvSetup'
import ContentSetup from './ContentSetup'
import ApiSetup from './ApiSetup'
import CreateContent from './createContent'
import { useCallback } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function SetupFlow({ pageInfo, OnClose }: { pageInfo: any, OnClose: () => void }) {
    const [currentStep, setCurrentStep] = useState(0)

    const steps = [
      { title: 'Welcome', component: Welcome },
      { title: 'Environment Setup', component: EnvSetup },
      { title: 'Content Setup', component: ContentSetup },
      { title: 'Create Content', component: CreateContent },
      { title: 'API Setup', component: ApiSetup },
    ]
  
    const handleNext = useCallback(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }, [steps.length])
  
    const handlePrevious = useCallback(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 0))
    }, [])

    useEffect(() => {
        const outersetup = document.getElementById('outersetup-flow')
        outersetup?.addEventListener('click', (e) => {
          if (e.target === outersetup) {
            OnClose()
          }
        })
        return () => outersetup?.removeEventListener('click', () => {})
    }, [])

  
    const CurrentStepComponent = steps[currentStep].component
  
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-background/20 overflow-y-scroll backdrop-blur-lg z-50 flex items-center justify-center" id='outersetup-flow'>
        <Card className="w-full max-w-3xl">
          <CardContent className="p-6">
            <CurrentStepComponent pageInfo={pageInfo} />
            <div className="flex w-full justify-between gap-10 mt-6">
              {currentStep > 0 && (
                <Button onClick={handlePrevious} variant="outline" className='w-full'><ArrowLeft className='w-4 h-4' /> Previous</Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} className='w-full'>Next <ArrowRight className='w-4 h-4' /> </Button>
              ) : (
                <Button onClick={() => OnClose} className='w-full'>Finish</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }