'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Car,
  Home,
  Briefcase,
  Truck,
  Users,
  Calendar,
  Wrench,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Upload,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAi } from '@/hooks/useAi';
import type { AiRiskEstimatorOutput } from '@/ai/flows/ai-risk-estimator';
import { useAuth } from '@/hooks/use-auth';

const steps = [
  { id: 1, title: 'Select Category' },
  { id: 2, title: 'Coverage Details' },
  { id: 3, title: 'AI Risk Estimator' },
  { id: 4, title: 'Deposit Collateral' },
  { id: 5, title: 'Upload Evidence' },
  { id: 6, title: 'Summary & Confirmation' },
];

const categories = [
  { value: 'Hospitality', label: 'Hospitality', icon: Home, description: 'Coverage for rentals and stays, powered by PYUSD.', enabled: true },
  { value: 'Car Rental', label: 'Car Rental', icon: Car, description: 'Protection for your rented vehicles.', enabled: true },
  { value: 'Equipment', label: 'Equipment', icon: Wrench, description: 'Secure your valuable equipment during rental.', enabled: false },
  { value: 'Logistics', label: 'Logistics', icon: Truck, description: 'Insurance for goods in transit.', enabled: false },
  { value: 'Freelance', label: 'Freelance', icon: Briefcase, description: 'Cover your freelance contracts and projects.', enabled: false },
  { value: 'P2P', label: 'P2P', icon: Users, description: 'Peer-to-peer transaction protection.', enabled: false },
  { value: 'Events', label: 'Events', icon: Calendar, description: 'Insure your events against unforeseen issues.', enabled: false },
];

const formSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  coverageName: z.string().min(3, 'Coverage name must be at least 3 characters'),
  valueToProtect: z.coerce.number().min(1, 'Value must be greater than 0'),
  durationDays: z.coerce.number().int().min(1, 'Duration must be at least 1 day'),
  deductible: z.coerce.number().optional(),
  partnerName: z.string().min(2, 'Partner name is required'),
});

type FormData = z.infer<typeof formSchema>;

export function CoverageWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiRiskEstimatorOutput | null>(null);
  const [depositTx, setDepositTx] = useState('');
  const [evidenceCid, setEvidenceCid] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const { addCoverage, transfer, pyusdBalance } = useAuth();
  const { estimateRisk, suggestName, isLoading: isAiLoading } = useAi();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      coverageName: '',
      valueToProtect: 1500,
      durationDays: 7,
      deductible: 100,
      partnerName: '',
    },
  });

  const handleNext = async () => {
    if (currentStep < steps.length) {
      const isValid = await form.trigger(
        currentStep === 1 ? ['category'] : 
        currentStep === 2 ? ['coverageName', 'valueToProtect', 'durationDays', 'partnerName'] : []
      );
      if (!isValid) return;

      if (currentStep === 2) {
        const result = await estimateRisk({
          category: form.getValues('category'),
          valueToProtect: form.getValues('valueToProtect'),
          durationDays: form.getValues('durationDays'),
          activityScore: 87, // Mock score
        });
        if (result) {
            setAiResult(result);
        }
      }

      if (currentStep === 3 && !aiResult) return;
      if (currentStep === 4) {
         if (!aiResult) return;
        setIsTxLoading(true);
        try {
          // This will be the platform's treasury address
          const toAddress = '0x1234567890123456789012345678901234567890'; 
          const tx = await transfer(toAddress, aiResult.totalCost);
          setDepositTx(tx.hash);
          toast({ title: 'Transaction confirmed ✅', description: 'Collateral deposited successfully.' });
          setCurrentStep(currentStep + 1);
        } catch (error) {
          toast({ variant: 'destructive', title: 'Transaction Failed', description: (error as Error).message });
        } finally {
          setIsTxLoading(false);
        }
        return; // Prevent double step increment
      }
      if (currentStep === 5) {
        // This is a mock CID, in a real app you'd upload the file to IPFS
        setEvidenceCid(`bafy${[...Array(55)].map(() => (Math.random().toString(36)+'00000000000000000').slice(2, 18)).join('').slice(0, 55)}`);
        toast({ title: 'Evidence uploaded successfully.', description: 'Your file has been secured.' });
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSuggestName = async () => {
    const category = form.getValues('category');
    const partnerName = form.getValues('partnerName');
    if (!category || !partnerName) {
      toast({ variant: 'destructive', title: 'Missing Info', description: 'Please provide a category and partner name.' });
      return;
    }
    const result = await suggestName({ category, partnerName });
    if(result) {
      form.setValue('coverageName', result.coverageName);
    }
  };
  
  const handleFinalSubmit = () => {
    if (!aiResult) return;
    const formData = form.getValues();
    const newCoverage = {
      id: `#COV-${Math.floor(Math.random() * 1000)}`,
      category: formData.category,
      value: formData.valueToProtect,
      fee: aiResult.suggestedFeePercentage,
      duration: formData.durationDays,
      status: 'Active' as const,
    };
    addCoverage(newCoverage);
    toast({
      title: 'Coverage successfully created ✅',
      description: 'Your new policy is now active.',
    });
    router.push('/dashboard');
  }

  const riskToProgress = (risk: string | undefined) => {
    if (risk === 'Low') return 33;
    if (risk === 'Medium') return 66;
    if (risk === 'High') return 100;
    return 0;
  };
  
  const progressColor = (risk: string | undefined) => {
    if (risk === 'Low') return "bg-green-500";
    if (risk === 'Medium') return "bg-yellow-500";
    if (risk === 'High') return "bg-red-500";
    return "bg-primary";
  }

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="mt-2" />
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <CardContent className="min-h-[300px]">
            {currentStep === 1 && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category for your coverage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} disabled={!cat.enabled}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <cat.icon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p>{cat.label}</p>
                                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                                </div>
                              </div>
                              {!cat.enabled && <Badge variant="outline">Coming Soon</Badge>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="coverageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coverage Name</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="e.g., Airbnb stay 5 nights" {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={handleSuggestName} disabled={isAiLoading}>
                          <Sparkles className="mr-2 h-4 w-4" />
                          {isAiLoading ? 'Suggesting...' : 'Suggest'}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                   <FormField
                    control={form.control}
                    name="valueToProtect"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value to Protect (PYUSD)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="durationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (days)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="7" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="deductible"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deductible (optional)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                    control={form.control}
                    name="partnerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Airbnb" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex flex-col items-center justify-center text-center">
                {isAiLoading ? (
                  <>
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Our AI is estimating your risk...</p>
                  </>
                ) : aiResult && (
                  <div className='w-full max-w-md space-y-4'>
                    <p className="text-muted-foreground">Based on your activity score and coverage details:</p>
                    <div className='text-3xl font-bold'>Suggested fee: <span className='text-primary'>{aiResult.suggestedFeePercentage}%</span></div>
                    <div className='text-xl'>Total cost: <span className='font-bold'>{aiResult.totalCost} PYUSD</span></div>
                    <div className='w-full pt-4'>
                      <Progress value={riskToProgress(aiResult.riskLevel)} indicatorclassname={progressColor(aiResult.riskLevel)} />
                      <div className='flex justify-between text-sm mt-1'>
                        <span className={aiResult.riskLevel === 'Low' ? 'font-bold' : ''}>Low</span>
                        <span className={aiResult.riskLevel === 'Medium' ? 'font-bold' : ''}>Medium</span>
                        <span className={aiResult.riskLevel === 'High' ? 'font-bold' : ''}>High</span>
                      </div>
                    </div>
                    <Card className="text-left bg-muted/50">
                        <CardHeader><CardTitle>AI Explanation</CardTitle></CardHeader>
                        <CardContent><p className="text-sm">{aiResult.explanation}</p></CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
            {currentStep === 4 && (
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <h2 className="text-2xl font-semibold">Deposit Collateral</h2>
                <p className="text-muted-foreground">
                  You need to deposit{' '}
                  <strong className="text-primary">{aiResult?.totalCost} PYUSD</strong> to activate your coverage.
                </p>
                <p className="text-sm">Your balance: {pyusdBalance !== null ? `${pyusdBalance} PYUSD` : <Loader2 className="h-4 w-4 animate-spin inline-block" />}</p>
                <Button onClick={() => handleNext()} disabled={isTxLoading}>
                  {isTxLoading && <Loader2 className="animate-spin mr-2" />}
                  {isTxLoading ? 'Depositing...' : 'Deposit Now'}
                </Button>
              </div>
            )}
            {currentStep === 5 && (
              depositTx ? (
                 <div className="flex flex-col items-center justify-center text-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <h2 className="mt-4 text-2xl font-semibold">Collateral Deposited</h2>
                    <p className="text-muted-foreground">Transaction has been confirmed.</p>
                    <p className="mt-4 font-code text-sm break-all bg-muted p-2 rounded-md">{depositTx}</p>
                    <Button onClick={() => setCurrentStep(6)} className="mt-4">Continue</Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                    <Button size="lg">
                      <Upload className="mr-2 h-5 w-5" /> Upload Evidence
                    </Button>
                    <p className="mt-4 text-sm text-muted-foreground">Upload images or videos as initial evidence (mock).</p>
                    {evidenceCid && (
                       <div className="mt-6 w-full text-left">
                          <p className="font-semibold">Uploaded File (mock):</p>
                          <div className="mt-2 flex items-center gap-2 rounded-md border p-3 bg-muted/50">
                              <FileCheck2 className="h-5 w-5 text-green-500" />
                              <p className="font-code text-sm break-all">{evidenceCid}</p>
                          </div>
                       </div>
                    )}
                </div>
              )
            )}
            {currentStep === 6 && (
                <div>
                    <CardDescription>Please review your coverage details before confirming.</CardDescription>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div><strong className="text-muted-foreground">Category:</strong><p>{form.getValues('category')}</p></div>
                        <div><strong className="text-muted-foreground">Coverage Name:</strong><p>{form.getValues('coverageName')}</p></div>
                        <div><strong className="text-muted-foreground">Value:</strong><p>{form.getValues('valueToProtect')} PYUSD</p></div>
                        <div><strong className="text-muted-foreground">Duration:</strong><p>{form.getValues('durationDays')} days</p></div>
                        <div><strong className="text-muted-foreground">Fee:</strong><p>{aiResult?.suggestedFeePercentage}%</p></div>
                        <div><strong className="text-muted-foreground">Total Cost:</strong><p>{aiResult?.totalCost} PYUSD</p></div>
                        <div className="col-span-2"><strong className="text-muted-foreground">Deposit TX:</strong><p className="font-code break-all text-xs">{depositTx}</p></div>
                        <div className="col-span-2"><strong className="text-muted-foreground">Evidence CID:</strong><p className="font-code break-all text-xs">{evidenceCid}</p></div>
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {currentStep < 4 && (
              <Button onClick={handleNext} disabled={(currentStep === 3 && isAiLoading) || (currentStep === 3 && !aiResult)}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {currentStep === 5 && !depositTx && (
                <Button onClick={() => setCurrentStep(6)}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}
             {currentStep === 6 && (
                <Button onClick={handleFinalSubmit}>
                    Create Coverage
                </Button>
            )}
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
}
