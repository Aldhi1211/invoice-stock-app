import { createCustomer } from "@/actions/customers";
import { CustomerForm } from "@/components/customer-form";
import { Card, PageHeader } from "@/components/ui";

export const metadata = { title: "Pelanggan baru" };

export default function NewCustomerPage() {
  return (
    <>
      <PageHeader title="Pelanggan baru" back="/pelanggan" />
      <Card>
        <CustomerForm action={createCustomer} />
      </Card>
    </>
  );
}
