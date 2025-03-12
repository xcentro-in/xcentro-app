
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoyaltyPartner } from "@/types/rewards";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

interface LoyaltyPartnersSettingsProps {
  savedPartners: LoyaltyPartner[];
  onSavePartner: (partner: LoyaltyPartner) => void;
  onDeletePartner: (partnerId: string) => void;
}

const LoyaltyPartnersSettings: React.FC<LoyaltyPartnersSettingsProps> = ({ 
  savedPartners, 
  onSavePartner, 
  onDeletePartner 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  
  // Update the form's default values to match the LoyaltyPartner type
  const form = useForm<LoyaltyPartner>({
    defaultValues: {
      id: "",
      name: "",
      type: "airline",
      conversionRatio: 0.5,
      category: "flights",
      membershipDetails: {
        membershipNumber: "",
        registeredName: "",
        email: "",
        preferredSettings: "",
      }
    }
  });

  const handleAddNew = () => {
    setIsAdding(true);
    form.reset({
      id: `partner-${Date.now()}`,
      name: "",
      type: "airline",
      conversionRatio: 0.5,
      category: "flights",
      membershipDetails: {
        membershipNumber: "",
        registeredName: "",
        email: "",
        preferredSettings: "",
      }
    });
  };

  const handleEdit = (partner: LoyaltyPartner) => {
    setEditingPartnerId(partner.id);
    form.reset(partner);
  };

  const handleSave = (data: LoyaltyPartner) => {
    onSavePartner(data);
    toast.success(`Partner ${data.name} saved successfully!`);
    setIsAdding(false);
    setEditingPartnerId(null);
    form.reset();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingPartnerId(null);
    form.reset();
  };

  const handleDelete = (partnerId: string) => {
    onDeletePartner(partnerId);
    toast.success("Partner deleted successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Loyalty Program Partners</CardTitle>
        <CardDescription>
          Link your loyalty accounts for seamless points conversion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedPartners.length === 0 && !isAdding && (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground">No loyalty partners connected yet</p>
            <Button onClick={handleAddNew} className="mt-4">Add Your First Partner</Button>
          </div>
        )}

        {savedPartners.length > 0 && (
          <div className="space-y-3">
            {savedPartners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-3 rounded-md border">
                {editingPartnerId === partner.id ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="w-full space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Partner Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Emirates Skywards" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Partner Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select partner type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="airline">Airline</SelectItem>
                                  <SelectItem value="hotel">Hotel</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="conversionRatio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Conversion Ratio</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.1" 
                                  placeholder="0.5" 
                                  {...field} 
                                  onChange={e => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Partner points per 1 PaySphere point
                              </FormDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="membershipDetails.membershipNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Membership Number</FormLabel>
                              <FormControl>
                                <Input placeholder="ABC1234567" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="membershipDetails.registeredName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registered Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="membershipDetails.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registered Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center font-semibold text-sm">
                        {partner.name.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium">{partner.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {partner.membershipDetails?.membershipNumber || "No membership number"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(partner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(partner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {isAdding && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 border rounded-md p-4">
              <h3 className="font-medium">Add New Partner</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Emirates Skywards" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select partner type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="airline">Airline</SelectItem>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conversionRatio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conversion Ratio</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          placeholder="0.5" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Partner points per 1 PaySphere point
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="membershipDetails.membershipNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Number</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC1234567" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="membershipDetails.registeredName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="membershipDetails.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
                <Button type="submit">Save Partner</Button>
              </div>
            </form>
          </Form>
        )}

        {savedPartners.length > 0 && !isAdding && !editingPartnerId && (
          <Button onClick={handleAddNew} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add New Partner
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyPartnersSettings;
