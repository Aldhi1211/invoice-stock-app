import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { deleteCustomer, updateCustomer } from "@/actions/customers";
import { CustomerForm } from "@/components/customer-form";
import { DeleteButton } from "@/components/form";
import { Card, PageHeader } from "@/components/ui";
import { db, schema } from "@/db";
import { requireShop } from "@/lib/session";
import { isUuid } from "@/lib/uuid";

export const metadata = { title: "Ubah pelanggan" };

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { shop } = await requireShop();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const customer = await db().query.customers.findFirst({
    where: and(eq(schema.customers.id, id), eq(schema.customers.shopId, shop.id)),
  });
  if (!customer) notFound();

  return (
    <>
      <PageHeader title={customer.name} back="/pelanggan" />
      <Card>
        <CustomerForm action={updateCustomer.bind(null, customer.id)} customer={customer} />
      </Card>
      <div className="mt-6">
        <DeleteButton action={deleteCustomer.bind(null, customer.id)} label="Hapus pelanggan" />
      </div>
    </>
  );
}
