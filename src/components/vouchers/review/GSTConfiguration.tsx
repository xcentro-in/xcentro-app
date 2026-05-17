import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GST_TYPES, type GSTType } from "@/constants/gstRates";

interface GSTConfigurationProps {
  value: GSTType;
  onChange: (value: GSTType) => void;
  /** Prefix for RadioGroupItem ids to keep them unique if two instances coexist. */
  idPrefix?: string;
  /** Subtitle under the "GST Type" label. */
  description?: string;
}

const GSTConfiguration = ({
  value,
  onChange,
  idPrefix = "review",
  description = "Select how GST should be calculated for this document",
}: GSTConfigurationProps) => {
  const cgstId = `${idPrefix}-cgst_sgst`;
  const igstId = `${idPrefix}-igst`;
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-base font-medium mb-4">GST Configuration</h3>
        <Label>GST Type</Label>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <RadioGroup
          value={value}
          onValueChange={(v: string) => onChange(v as GSTType)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={GST_TYPES.CGST_SGST} id={cgstId} />
            <Label htmlFor={cgstId} className="font-normal cursor-pointer">
              CGST + SGST (Intra-state)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={GST_TYPES.IGST} id={igstId} />
            <Label htmlFor={igstId} className="font-normal cursor-pointer">
              IGST (Inter-state)
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default GSTConfiguration;
