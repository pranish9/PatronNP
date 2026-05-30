import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ArrowRight, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import Alert from '../components/Alert'
import { useLanguage } from '../hooks/useLanguage'

export const Onboarding = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const steps = [
    { id: 1, title: t('onboarding.step1'), description: 'Profile Setup' },
    { id: 2, title: t('onboarding.step2'), description: 'Social Links' },
    { id: 3, title: t('onboarding.step3'), description: 'Payment Setup' },
    { id: 4, title: t('onboarding.step4'), description: 'Preview' },
  ]

  const handleNext = (data) => {
    setProfileData(prev => ({ ...prev, ...data }))
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Mock API call - replace with actual backend
      await new Promise(r => setTimeout(r, 1500))
      
      localStorage.setItem('profileComplete', 'true')
      toast.success(t('onboarding.allSet'))
      navigate('/dashboard')
    } catch (error) {
      toast.error(t('errors.somethingWrong'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-6">
              {steps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  className={`flex-1 h-2 mx-1 rounded-full cursor-pointer transition-all ${
                    step.id <= currentStep 
                      ? 'bg-purple-600' 
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('onboarding.step' + currentStep)} - Step {currentStep} of 4
              </p>
            </div>
          </div>

          {/* Form Steps */}
          <Card>
            <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
              {/* Step 1: Profile Setup */}
              {currentStep === 1 && (
                <Step1Component register={register} errors={errors} t={t} />
              )}

              {/* Step 2: Social Links */}
              {currentStep === 2 && (
                <Step2Component register={register} errors={errors} t={t} />
              )}

              {/* Step 3: Payment Setup */}
              {currentStep === 3 && (
                <Step3Component register={register} errors={errors} t={t} />
              )}

              {/* Step 4: Preview */}
              {currentStep === 4 && (
                <Step4Component profileData={profileData} t={t} />
              )}

              {/* Navigation */}
              <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                {currentStep > 1 && (
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="md"
                    onClick={handleBack}
                  >
                    <ArrowLeft size={20} />
                    {t('common.back')}
                  </Button>
                )}
                
                {currentStep < 4 ? (
                  <Button type="submit" size="md" className="ml-auto">
                    {t('common.next')}
                    <ArrowRight size={20} />
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    size="md"
                    isLoading={isLoading}
                    onClick={handleComplete}
                    className="ml-auto"
                  >
                    {t('onboarding.publishCreatorPage')}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

const Step1Component = ({ register, errors, t }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">{t('onboarding.step1')}</h2>
    
    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
      <Upload size={40} className="mx-auto text-slate-400 mb-2" />
      <p className="text-slate-600 dark:text-slate-400">{t('onboarding.profilePicture')}</p>
      <input type="file" accept="image/*" className="hidden" />
    </div>

    <Input
      label={t('onboarding.displayName')}
      placeholder="Your Name"
      {...register('displayName', { required: t('errors.fieldRequired') })}
      error={errors.displayName?.message}
    />

    <Input
      label={t('onboarding.bio')}
      placeholder="Tell us about yourself..."
      as="textarea"
      {...register('bio', { required: t('errors.fieldRequired') })}
      error={errors.bio?.message}
    />
  </div>
)

const Step2Component = ({ register, errors, t }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">{t('onboarding.step2')}</h2>
    <p className="text-slate-600 dark:text-slate-400">Optional - Add your social links</p>

    <Input label={t('onboarding.website')} placeholder="https://yourwebsite.com" {...register('website')} />
    <Input label={t('onboarding.instagram')} placeholder="@yourhandle" {...register('instagram')} />
    <Input label={t('onboarding.facebook')} placeholder="yourpage" {...register('facebook')} />
    <Input label={t('onboarding.youtube')} placeholder="@yourchannel" {...register('youtube')} />
    <Input label={t('onboarding.tiktok')} placeholder="@yourprofile" {...register('tiktok')} />
    <Input label={t('onboarding.linkedin')} placeholder="yourprofile" {...register('linkedin')} />
    <Input label={t('onboarding.twitter')} placeholder="@yourhandle" {...register('twitter')} />
  </div>
)

const Step3Component = ({ register, errors, t }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">{t('onboarding.step3')}</h2>
    
    <div className="space-y-2">
      <label className="block text-sm font-medium">{t('onboarding.paymentMethod')}</label>
      <select className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <option value="esewa">{t('onboarding.esewa')}</option>
        <option value="khalti">{t('onboarding.khalti')}</option>
        <option value="bank">{t('onboarding.bankTransfer')}</option>
      </select>
    </div>

    <Input
      label={t('onboarding.accountId')}
      placeholder="xxxxxxxx"
      {...register('accountId', { required: t('errors.fieldRequired') })}
      error={errors.accountId?.message}
    />

    <Input
      label={t('onboarding.accountHolder')}
      placeholder="Your Full Name"
      {...register('accountHolder', { required: t('errors.fieldRequired') })}
      error={errors.accountHolder?.message}
    />
  </div>
)

const Step4Component = ({ profileData, t }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">{t('onboarding.previewProfile')}</h2>
    
    <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-32 rounded-lg"></div>
    
    <div className="text-center -mt-16 relative z-10">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-300 border-4 border-white dark:border-slate-900"></div>
      <h3 className="text-2xl font-bold">{profileData.displayName || 'Your Name'}</h3>
      <p className="text-slate-600 dark:text-slate-400 mt-2">{profileData.bio || 'Your bio here'}</p>
    </div>

    <Alert type="success" message={t('onboarding.allSet')} />
  </div>
)

export default Onboarding
