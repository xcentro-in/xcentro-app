import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const vendors = ["Office Supplies Co.", "Cloud Services", "Marketing Agency", "Internet Provider"];
const RecentVendorsCard = () => {
  return <Card className="animate-fade-in" style={{
    animationDelay: "200ms"
  }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Frequently Paid Vendors</CardTitle>
        <CardDescription>Quick access to your frequent vendors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {vendors.map(vendor => <div key={vendor} className="flex items-center justify-between p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                {vendor.charAt(0).toUpperCase()}
              </div>
              <div className="font-medium">{vendor}</div>
            </div>
            <Button size="sm" variant="outline" className="h-8">Pay</Button>
          </div>)}
      </CardContent>
    </Card>;
};
export default RecentVendorsCard;