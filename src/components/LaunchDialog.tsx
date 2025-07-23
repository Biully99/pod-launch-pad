import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Rocket, Upload, DollarSign, Clock, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { usePrivy } from '@privy-io/react-auth'
import { useTokenFactory } from '@/hooks/useTokenFactory'
import { getExplorerUrl } from '@/lib/contracts'

const LaunchDialog = () => {
  console.log('🚀 LaunchDialog rendering...')
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    maxSupply: '1000000', // 1M tokens default
    fundraisingTarget: '',
    creatorAllocation: '5',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const { ready, authenticated } = usePrivy()
  const { 
    deployToken, 
    isDeploying, 
    deploymentFee, 
    deployReceipt, 
    deployError
  } = useTokenFactory()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleLaunch = async () => {
    if (!ready || !authenticated) {
      toast({
        title: "Wallet Not Connected",
        description: "Connect your wallet to Base network first, anon",
        variant: "destructive"
      })
      return
    }

    // Basic validation
    if (!formData.name || !formData.symbol || !formData.fundraisingTarget || !formData.maxSupply) {
      toast({
        title: "Missing Information",
        description: "Fill all fields or ngmi",
        variant: "destructive"
      })
      return
    }

    try {
      toast({
        title: "Deploying Based Token 🚀",
        description: "Your memecoin is being deployed to Base chain...",
      })

      await deployToken({
        name: formData.name,
        symbol: formData.symbol,
        maxSupply: formData.maxSupply,
        fundraisingTarget: formData.fundraisingTarget,
        creatorAllocation: formData.creatorAllocation,
        deploymentFee: deploymentFee
      })

    } catch (error) {
      toast({
        title: "Deployment Rekt",
        description: error instanceof Error ? error.message : "Something went wrong, fren",
        variant: "destructive"
      })
    }
  }

  // Handle successful deployment
  if (deployReceipt) {
    toast({
      title: "Token Deployed Successfully! 🎉",
      description: `${formData.name} is now live and ready to farm!`,
    })
    
    // Reset form and close dialog
    setIsOpen(false)
    setFormData({
      name: '',
      symbol: '',
      description: '',
      maxSupply: '1000000',
      fundraisingTarget: '',
      creatorAllocation: '5',
    })
    setSelectedFile(null)
  }

  // Handle deployment error
  if (deployError) {
    toast({
      title: "Deployment Error",
      description: deployError.message,
      variant: "destructive"
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="xl" className="group">
          <Rocket className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          Launch Your Token
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Launch Your Flywheel Token
          </DialogTitle>
          <DialogDescription>
            Deploy borrowing-enabled memecoins that buy back their own chart. No rugs, just infinite loops.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Token Details */}
          <Card className="p-6 gradient-card border-primary/20">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Token Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Token Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Based Pepe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="symbol">Symbol *</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  placeholder="BPEPE"
                  value={formData.symbol}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="maxSupply">Max Supply *</Label>
                <Input
                  id="maxSupply"
                  name="maxSupply"
                  placeholder="1000000"
                  value={formData.maxSupply}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="The most based Pepe token on the blockchain..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </Card>

          {/* Image Upload */}
          <Card className="p-6 gradient-card border-secondary/20">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Token Image</h3>
            <div className="border-2 border-dashed border-secondary/30 rounded-lg p-6 text-center hover:border-secondary/50 transition-colors relative">
              <Upload className="h-12 w-12 text-secondary mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Launch Parameters */}
          <Card className="p-6 gradient-card border-accent/20">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Launch Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fundraisingTarget" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Fundraising Target (ETH) *
                </Label>
                <Input
                  id="fundraisingTarget"
                  name="fundraisingTarget"
                  type="number"
                  step="0.1"
                  placeholder="10.0"
                  value={formData.fundraisingTarget}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="creatorAllocation">Creator Allocation (%)</Label>
                <Input
                  id="creatorAllocation"
                  name="creatorAllocation"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="5"
                  value={formData.creatorAllocation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Deployment Fee Info */}
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Deployment Fee:</span>
                <span className="text-sm font-semibold text-primary">{deploymentFee} ETH</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Covers Base deployment + flywheel setup (infinite money glitch activation fee)
              </p>
            </div>
          </Card>

          {/* Launch Button */}
          <Button 
            onClick={handleLaunch} 
            className="w-full" 
            variant="hero" 
            size="lg"
            disabled={!ready || !authenticated || isDeploying}
          >
            <Rocket className="h-5 w-5 mr-2" />
            {isDeploying 
              ? 'Deploying to Base...' 
              : (ready && authenticated)
                ? `Deploy Token (${deploymentFee} ETH)` 
                : 'Connect Wallet First'
            }
          </Button>

          {/* Transaction Link */}
          {deployReceipt && (
            <div className="text-center">
              <a 
                href={getExplorerUrl(deployReceipt.transactionHash)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-glow transition-colors"
              >
                View on BaseScan <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LaunchDialog