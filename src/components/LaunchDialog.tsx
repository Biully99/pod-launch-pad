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
import { Rocket, Upload, DollarSign, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAccount } from 'wagmi'

const LaunchDialog = () => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    fundraisingTarget: '',
    creatorAllocation: '5',
    lpLockDuration: '30'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const { isConnected } = useAccount()

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
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      })
      return
    }

    // Basic validation
    if (!formData.name || !formData.symbol || !formData.fundraisingTarget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    // Simulate token launch process
    toast({
      title: "Launch Initiated! 🚀",
      description: "Your meme token launch is being processed...",
    })

    // Close dialog and reset form
    setIsOpen(false)
    setFormData({
      name: '',
      symbol: '',
      description: '',
      fundraisingTarget: '',
      creatorAllocation: '5',
      lpLockDuration: '30'
    })
    setSelectedFile(null)

    // Simulate success after delay
    setTimeout(() => {
      toast({
        title: "Token Deployed Successfully! 🎉",
        description: `Your token is now live and ready for trading!`,
      })
    }, 3000)
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
            Launch Your Memecoin on Peapods
          </DialogTitle>
          <DialogDescription>
            Create yield-generating memecoins with the institutional infrastructure trusted by $51M+ TVL
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
                  placeholder="10"
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
                  placeholder="5"
                  value={formData.creatorAllocation}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="lpLockDuration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  LP Lock Duration (days)
                </Label>
                <Input
                  id="lpLockDuration"
                  name="lpLockDuration"
                  type="number"
                  placeholder="30"
                  value={formData.lpLockDuration}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </Card>

          {/* Launch Button */}
          <Button 
            onClick={handleLaunch} 
            className="w-full" 
            variant="hero" 
            size="lg"
            disabled={!isConnected}
          >
            <Rocket className="h-5 w-5 mr-2" />
            {isConnected ? 'Deploy Token & Create LP' : 'Connect Wallet to Launch'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LaunchDialog