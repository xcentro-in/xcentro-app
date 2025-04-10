
import React from "react";
import { Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/formatters";

interface EmployeeData {
  id: number;
  name: string;
  gross: number;
  deductions: number;
  net: number;
}

interface EmployeeSalaryBreakdownCardProps {
  employeeData: EmployeeData[];
}

const EmployeeSalaryBreakdownCard: React.FC<EmployeeSalaryBreakdownCardProps> = ({
  employeeData
}) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Employee Salary Breakdown</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Individual salary details including gross pay, deductions, and net pay</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.gross)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.deductions)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(employee.net)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <tfoot className="border-t">
              <TableRow>
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(
                    employeeData.reduce((sum, emp) => sum + emp.gross, 0)
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(
                    employeeData.reduce((sum, emp) => sum + emp.deductions, 0)
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(
                    employeeData.reduce((sum, emp) => sum + emp.net, 0)
                  )}
                </TableCell>
              </TableRow>
            </tfoot>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeSalaryBreakdownCard;
