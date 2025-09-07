import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Upload, Paperclip, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InvoiceDetails, OCRProgress } from "@/types/invoice";

const NewBill = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrProgress, setOcrProgress] = useState<OCRProgress>({
    status: 'idle',
    progress: 0
  });
  const [isServiceBill, setIsServiceBill] = useState(false);
  const [billData, setBillData] = useState<InvoiceDetails>({
    vendorName: '',
    invoiceNumber: '',
    invoiceDate: undefined,
    dueDate: undefined,
    totalAmount: 0,
    items: []
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setOcrProgress({ status: 'processing', progress: 0 });

    // Simulate OCR processing
    const interval = setInterval(() => {
      setOcrProgress(prev => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Simulate extracted data
          setBillData({
            vendorName: 'East Repair Inc.',
            invoiceNumber: 'US-001',
            invoiceDate: new Date('2019-02-11'),
            dueDate: new Date('2019-02-26'),
            totalAmount: 154.06,
            items: [
              { description: 'Front and rear brake cables', quantity: 1, rate: 100.00, amount: 100.00 },
              { description: 'New set of pedal arms', quantity: 1, rate: 30.00, amount: 30.00 },
              { description: 'Labor 3hrs', quantity: 3, rate: 5.00, amount: 15.00 }
            ]
          });
          return { status: 'complete', progress: 100 };
        }
        return { status: 'processing', progress: newProgress };
      });
    }, 200);
  };

  const addNewItem = () => {
    setBillData(prev => ({
      ...prev,
      items: [...(prev.items || []), { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setBillData(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index) || []
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setBillData(prev => ({
      ...prev,
      items: prev.items?.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      }) || []
    }));
  };

  const calculateSubtotal = () => {
    return billData.items?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">New Bill</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save & Continue</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Upload Area */}
        <div className="w-1/2 p-6 border-r">
          <div className="h-full flex flex-col">
            <h2 className="text-lg font-medium mb-4">Create bill manually</h2>
            
            <div 
              className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 mb-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {ocrProgress.status === 'processing' ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Processing invoice...</p>
                  <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress.progress}%` }}
                    ></div>
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="text-center">
                  <div className="w-16 h-20 bg-red-500 rounded mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PDF</span>
                  </div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  {ocrProgress.status !== 'complete' && (
                    <Button onClick={handleUpload} className="mt-4">
                      Process Invoice
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drag & Drop invoice from vendor here</p>
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Auto-read invoice and save time from manual entry
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Right Side - Form Fields */}
        <div className="w-1/2 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Vendor Section */}
            <div>
              <Button variant="outline" size="sm" className="mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
              
              {billData.vendorName && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{billData.vendorName}</p>
                        <p className="text-sm text-muted-foreground">Bill to</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Bill Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billNumber">Bill Number</Label>
                <Input 
                  id="billNumber" 
                  value={billData.invoiceNumber || ''} 
                  onChange={(e) => setBillData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="billDate">Bill Date</Label>
                <Input 
                  id="billDate" 
                  type="date" 
                  value={billData.invoiceDate ? billData.invoiceDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setBillData(prev => ({ ...prev, invoiceDate: new Date(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="poNumber">PO / SO Number</Label>
                <Input id="poNumber" />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={billData.dueDate ? billData.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setBillData(prev => ({ ...prev, dueDate: new Date(e.target.value) }))}
                />
              </div>
            </div>

            {/* Service Bill Toggle */}
            <div className="flex items-center space-x-2">
              <Switch 
                id="serviceBill" 
                checked={isServiceBill}
                onCheckedChange={setIsServiceBill}
              />
              <Label htmlFor="serviceBill">Service Bill</Label>
            </div>

            {/* Line Items */}
            <div>
              <div className="space-y-4">
                {billData.items?.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input 
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label>Quantity</Label>
                            <Input 
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label>Rate</Label>
                            <Input 
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label>Amount</Label>
                            <Input 
                              type="number"
                              value={item.amount}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button variant="outline" onClick={addNewItem} className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add another item
              </Button>
            </div>

            {/* Attach File */}
            <Button variant="outline" className="w-full">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach file to Bill (eg: receipt)
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Max 5MB in size and JPEG, PNG or PDF formats
            </p>

            {/* Summary */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>₹ {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST @ 2.5%</span>
                  <span>₹ {(calculateSubtotal() * 0.025).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST @ 2.5%</span>
                  <span>₹ {(calculateSubtotal() * 0.025).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <Input className="w-20 text-right" defaultValue="10%" />
                  <span>₹ 0.00</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Round off</span>
                  <span className="ml-auto">₹ 0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>TOTAL</span>
                  <span>₹ {(calculateSubtotal() * 1.05).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBill;