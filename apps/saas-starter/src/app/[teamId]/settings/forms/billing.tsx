import { Button } from '../../../../components/ui/button';
import { DownloadIcon } from '@radix-ui/react-icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/Label';
import { Card } from '@/components/ui/card';

export const BillingForm = () => {
  return (
    <form className="w-2/3 space-y-6">
      <Label>
        Plan
        <select className="flex w-full px-3 py-1 text-sm transition-colors border rounded-md shadow-sm border-neutral-700 h-9 border-input bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
          <option selected>Pro - $12/user/month</option>
          <option>Free - Up to 2 users</option>
        </select>
      </Label>
    </form>
  );
};

export const Billing = () => {
  const invoices = [
    {
      invoice: 'INV001',
      date: 'July 2023',
      totalAmount: '$250.00',
      paymentMethod: 'Credit Card',
    },
    {
      invoice: 'INV002',
      date: 'June 2023',
      totalAmount: '$150.00',
      paymentMethod: 'PayPal',
    },
    {
      invoice: 'INV003',
      date: 'May 2023',
      totalAmount: '$350.00',
      paymentMethod: 'Bank Transfer',
    },
    {
      invoice: 'INV004',
      date: 'April 2023',
      totalAmount: '$450.00',
      paymentMethod: 'Credit Card',
    },
    {
      invoice: 'INV005',
      date: 'March 2023',
      totalAmount: '$550.00',
      paymentMethod: 'PayPal',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <BillingForm />
      <div className="flex flex-col">
        <Label>
          Invoices
          <Card className="rounded shadow-none">
            <Table>
              <TableHeader className="bg-slate-3">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[36px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="p-1 pl-2 font-medium">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell className="p-1 px-2">{invoice.date}</TableCell>
                    <TableCell className="p-1 px-2 text-right">
                      {invoice.totalAmount}
                    </TableCell>
                    <TableCell className="p-1">
                      <Button variant={'ghost'} size={'icon'}>
                        <DownloadIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Label>
      </div>
    </div>
  );
};
